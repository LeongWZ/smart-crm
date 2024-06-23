import dotenv from "dotenv";
import connectToNgrok from "./ngrok/connect";
import nms from "./nms/client";
import useTranscription from "./transcription/useTranscription";
import prompts from "prompts";
import { fetchPostBackend } from "./api/fetchPostBackend";

console.log("Press Ctrl+C to exit the program\n");

dotenv.config();
nms.run();

const transcription = useTranscription();

const STREAMING_KEY = process.env["STREAMING_KEY"] ?? "";

promptEmail()
  .then(connectToNgrok)
  .then(([streamingUrl, liveStreamingPageUrl]: [string, string]) => {

    transcription("SET_URL")(`${streamingUrl}/${STREAMING_KEY}`);
    
    printStreamDetails(streamingUrl, liveStreamingPageUrl);
  });

nms.on("postConnect", (id, streamPath, args) => {
  transcription("START")(id);
})

nms.on("doneConnect", (id, streamPath, args) => {
  transcription("STOP")(id);
})

function printStreamDetails(streamingUrl: string, liveStreamingPageUrl: string) {
  console.log(`\nConfiguration for Zoom\n` +
    `Streaming URL: ${streamingUrl}\n` +
    `Streaming key: ${STREAMING_KEY}\n` +
    `Live streaming page URL: ${liveStreamingPageUrl}\n\n`
  );
}

async function promptEmail() {

  const validateEmail = async (email: string) => {
    try {
      await fetchPostBackend(
        email,
        {
          transcript: "Successfully connected to smart-crm",
          dialogues: []
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return `Invalid email. Please input the email you used on your Lark account.`;
    }

    transcription("SET_EMAIL")(email);
    return true
  }

  await prompts({
    type: 'text',
    name: 'email',
    message: 'Email used on your Lark account',
    validate: async email => await validateEmail(email)
  });
}