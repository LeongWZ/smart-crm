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

RUN mkdir -p ./credentials
RUN echo $GOOGLE_BASE64 | base64 -d > ./credentials/smart-crm-426916-81e8c1f0f2b1.json

RUN npm run build

CMD ["npm","start"]