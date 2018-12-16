FROM node:11.4.0-alpine
MAINTAINER Emanuele Ianni
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn run build
EXPOSE $PORT
CMD [ "yarn", "run", "start" ]