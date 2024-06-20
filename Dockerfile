FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

RUN npm install

COPY . .

RUN chmod +x ./docker-node.sh

CMD ["npm","run","dev"]