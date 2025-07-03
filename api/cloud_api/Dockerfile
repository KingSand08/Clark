FROM node:alpine

WORKDIR /app/dessert_api

COPY package.json ../../
RUN cd ../.. && npm install

COPY . .

CMD ["node", "server.js"]
