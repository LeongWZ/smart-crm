# smart-crm

Real-time speech-to-text transciption on Zoom using Google Cloud API.

## Prerequisites

1. Sign up for Google Cloud API account and enable Speech-To-Text API.
2. Generate service account on Google Cloud API for access credentials
3. Sign up for Ngrok account and retrieve Ngrok token.
4. Install docker and docker-compose

## Installation

1. Copy .env.example to .env
```bash
cp ./.env.example ./.env
```

2. On .env file, replace `GOOGLE_APPLICATION_CREDENTIALS` and `NGROK_TOKEN` environment variables accordingly

3. Use docker-compose to build and run container
```bash
docker-compose build
docker-compose up
```