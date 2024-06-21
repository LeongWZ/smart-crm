import dotenv from "dotenv";
import connectToNgrok from "./ngrok/connect";
import nms from "./nms/client";
import useTranscription from "./transcription/useTranscription";

dotenv.config();
nms.run();

const transcription = useTranscription();

const STREAMING_KEY = process.env["STREAMING_KEY"] ?? "";

connectToNgrok()
  .then(([streamingUrl, liveStreamingPageUrl]: [string, string]) => {

    transcription("SET_URL")(`${streamingUrl}/${STREAMING_KEY}`);
    
    printStreamDetails(streamingUrl, liveStreamingPageUrl);
  })

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

console.log("Press Ctrl+C to exit the program\n");