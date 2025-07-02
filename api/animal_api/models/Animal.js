const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimalsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: 'No description provided.'
    },
    lifespan: {
      type: Number,
    }
  },
  { collection: 'Animals' }
);

module.exports = mongoose.model('Animals', AnimalsSchema);
