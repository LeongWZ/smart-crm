# smart-crm

Real-time speech-to-text transciption on Zoom using Google Cloud API.

Deployment can be found here: <http://167.172.84.17:3000/>

## Prerequisites

1. Have a Pro, Business, Education, or Enterprise account on Zoom. (If you wish to use Zoom)
2. Have OBS Studio installed (If you wish to use OBS instead of Zoom)
3. Install docker and docker compose.
4. Join this Lark organisation to have access to the bot <https://xfmuck6tn0q.sg.larksuite.com/invite/d39NMQoqtalg1?join=1&team_name=whatisthis>

## Installation

Use docker compose to build the container
```bash
docker compose build
```

## Run
1. Run the program using docker compose

        docker compose up

2. Go to http://localhost:3000 and enter your email used on lark account for configuration details

### For Zoom
1. Start the meeting/webinar on Zoom as the host.

2. Click the More button in the host controls.

3. Choose Live on Custom Live Stream Service.
    - If the organizer configured this webinar for live custom streaming, a browser window opens that shows the progress as Zoom prepares the livestream of your webinar.
    - If the organizer did not set up this webinar for live custom streaming, you must enter the values provided in the configuration details.

4. Once streaming has started, the bot will be able to receive audio. Move over to lark to begin interacting with the bot.

### For OBS

1. Click Settings and then click Stream

2. On the "Service" field, select Custom...

3. Paste the Streaming Key to the "Stream Key" field

4. Paste the RTMP URL provided to the "Server" field

5. Once streaming has started, the bot will be able to receive audio. Move over to lark to begin interacting with the bot.


## Backend
Readme for backend server can be found on <https://github.com/LeongWZ/smart-crm-backend>
