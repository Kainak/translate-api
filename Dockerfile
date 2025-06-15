FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./api ./api
COPY ./translation-worker ./translation-worker

RUN npm install
RUN npm run swagger:gen

EXPOSE 4040

CMD [ "npm", "run", "start:api" ] 