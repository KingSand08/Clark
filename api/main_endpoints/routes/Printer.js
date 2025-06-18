const axios = require('axios');
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const logger = require('../../util/logger');
const fs = require('fs');
const path = require('path');

const {
  decodeToken,
  checkIfTokenSent,
} = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const {
  PRINTING = {}
} = require('../../config/config.json');
const { MetricsHandler } = require('../../util/metrics');

// see https://github.com/SCE-Development/Quasar/tree/dev/docker-compose.dev.yml#L11
let PRINTER_URL = process.env.PRINTER_URL
  || 'http://localhost:14000';

const router = express.Router();

// stores file inside temp folder
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'printing'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '_' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/healthCheck', async (req, res) => {
  /*
   * How these work with Quasar:
   * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
   */
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }
  await axios
    .get(PRINTER_URL + '/healthcheck/printer')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      MetricsHandler.sshTunnelErrors.inc({ type: 'Printer' });
      return res.sendStatus(NOT_FOUND);
    });
});

router.post('/sendPrintRequest', upload.single('chunk'), async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/sendPrintRequest was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await decodeToken(req)) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }

  const { totalChunks, chunkIdx } = req.body;

  // reassemble pdf on last chunk received
  if (Number(chunkIdx) === totalChunks - 1) {
    const { copies, sides, id } = req.body;
    const dir = req.file.destination;
    const chunks = await fs.promises.readdir(dir);
    const pdf = path.join(dir, id + '.pdf');

    for (let chunk of chunks) {
      if (path.extname(chunk) !== '.CHUNK') continue;
      if (!path.basename(chunk).includes(id)) continue;

      try {
        const chunkData = await fs.promises.readFile(path.join(dir, chunk));
        fs.appendFileSync(pdf, chunkData);
      } catch (err) {
        logger.warn('/sendPrintRequest encountered an error while assembling pdf');
        return res.sendStatus(SERVER_ERROR);
      }
    }

    const stream = await fs.createReadStream(pdf);
    const data = new FormData();
    data.append('file', stream, {filename: id, type: 'application/pdf'});
    data.append('copies', copies);
    data.append('sides', sides);

    try {
      // full pdf can be sent to quasar no problem
      await axios.post(PRINTER_URL + '/print', data, {
        headers: {
          ...data.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const tempFiles = await fs.promises.readdir(dir);
      for (let temp of tempFiles) {
        if (!path.basename(temp).includes(id)) continue;

        await fs.promises.unlink(path.join(dir, temp), err => {
          logger.error('/sendPrintRequest failed to delete a file while clearing out temp folder, error msg: ', err);
          res.sendStatus(SERVER_ERROR);
        });
      }

      res.sendStatus(OK);
    } catch (err) {
      logger.error('/sendPrintRequest had an error: ', err);
      res.sendStatus(SERVER_ERROR);
    }
  } else {
    res.sendStatus(OK);
  }
});

router.post('/cleanUpChunks', express.json(), async (req, res) => {
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, chunk clean up will not commence');
  }

  const id = req.body.id;
  const dir = path.join(__dirname, 'printing');

  const tempFiles = await fs.promises.readdir(dir);
  for (let temp of tempFiles) {
    if (!path.basename(temp).includes(id)) continue;

    await fs.promises.unlink(path.join(dir, temp), err => {
      logger.error('/cleanUpChunks failed to delete a file while clearing out temp folder, error msg: ', err);
    });
  }
});

module.exports = router;
