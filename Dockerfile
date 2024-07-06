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

RUN echo $GOOGLE_CREDENTIALS_BASE64 | base64 -d > ./credentials/smart-crm-426916-ee647f5674f9.json

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]