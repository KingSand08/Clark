
FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY ./dessert_api /app/dessert_api

COPY ./util /app/util

EXPOSE 8085

ARG GENERAL_API_URL

ARG DATABASE_HOST

ARG NODE_ENV

ARG VERIFICATION_BASE_URL

CMD [ "node", "./cloud_api/server.js" ]
