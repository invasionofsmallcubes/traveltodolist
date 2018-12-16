FROM node:11.4.0-alpine

MAINTAINER Emanuele Ianni

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD [ "npm", "run start" ]