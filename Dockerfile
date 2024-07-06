FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

RUN npm install\
    && npm install typescript

COPY . .

RUN chmod +x ./docker-node.sh

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]