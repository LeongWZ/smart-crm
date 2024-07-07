# smart-crm

Real-time speech-to-text transciption on Zoom using Google Cloud API.

## Prerequisites

1. Have a Pro, Business, Education, or Enterprise account on Zoom.
2. Install docker and docker compose.

## Installation

Use docker compose to build the container

        docker compose build

## Run
1. Run the program using docker compose

        docker compose up

2. Go to http://localhost:3000 and enter your email used on lark account for configuration details

3. Start the meeting/webinar on Zoom as the host.

4. Click the More button in the host controls.

5. Choose Live on Custom Live Stream Service.
    - If the organizer configured this webinar for live custom streaming, a browser window opens that shows the progress as Zoom prepares the livestream of your webinar.
    - If the organizer did not set up this webinar for live custom streaming, you must enter the values provided in the configuration details.

6. Once streaming has started, the bot will be able to receive audio. Move over to lark to begin interacting with the bot.

## Backend
Readme for backend server can be found on <https://github.com/LeongWZ/smart-crm-backend>