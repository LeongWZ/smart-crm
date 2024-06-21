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

3. Use docker-compose to build the container

        ```bash
        docker-compose build
        ```

## Run
1. Run the program using docker-compose

        ```bash
        docker-compose up
        ```

    - You will be given the configuration details for zoom upon running the program, for example:

        ```bash
        Configuration for Zoom
        Streaming URL: rtmp://SOME_URL
        Streaming key: SOME_KEY
        Live streaming page URL: https://ANOTHER_URL
        ```

2. Start the meeting/webinar as the host, by doing one of the following:
    - From your calendar: If you have added the meeting/webinar to your calendar, click the link displayed on your calendar reminder.
    - From the Zoom website: Sign in to Zoom, find the meeting or webinar on the Meetings or  Webinars page, and click Start.

3. Click the More button in the host controls.

4. Choose Live on Custom Live Stream Service.
    - If the organizer configured this webinar for live custom streaming, a browser window opens that shows the progress as Zoom prepares the livestream of your webinar.
    - If the organizer did not set up this webinar for live custom streaming, you must enter the values provided in the configuration details.
