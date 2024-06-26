import ffmpeg from "fluent-ffmpeg";
import speech from "@google-cloud/speech";
import { fetchPostBackend } from "../api/fetchPostBackend";

const client = new speech.SpeechClient();

export const GOOGLE_SPEECH_API_TIMEOUT = 305; // in seconds

// Define the necessary variables
const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

type Duration = {
    seconds: number;
    nanos: number
}

export type WordInfo = {
    startTime: Duration;
    endTime: Duration;
    word: string;
    speakerTag?: number;
}
  
type Alternative = {
    transcript: string;
    confidence: number;
    words?: WordInfo[];
}
  
type Result = {
    alternatives: Alternative[];
}
  
export type LongRunningRecognizeResponse  = {
    results: Result[];
}


// Stream the audio to the Google Cloud Speech API
function launchRecognizeStream(onData: (data: LongRunningRecognizeResponse) => void) {
    return client.streamingRecognize({
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
            enableWordTimeOffsets: true,
            diarizationConfig: {
                enableSpeakerDiarization: true,
                minSpeakerCount: 2,
                maxSpeakerCount: 2,
            },
            model: "video"
        },
        interimResults: false, // If you want interim results, set this to true
    })
    .on('error', console.error)
    .on('data', onData);
}

export default function transcribe(rtmpUrl: string, onData: (data: LongRunningRecognizeResponse) => void) {
    ffmpeg(rtmpUrl, { timeout: GOOGLE_SPEECH_API_TIMEOUT })
        .on('start', function (commandLine) {
            console.log(`\nSpawned Ffmpeg with command: ${commandLine}\n`);
        })
        .noVideo() // Process only the audio stream
        .audioCodec('pcm_s16le')
        .format('s16le')
        .audioFrequency(sampleRateHertz)
        .audioChannels(1)
        .on("data", data => console.log)
        .on('error', err => {
            const message: string = err.message;
            if (!message.includes("Output stream error: Exceeded maximum allowed stream duration of 305 seconds.") &&
                !message.includes("process ran into a timeout")) {
                console.error(`\nAn error occurred: ${message}\n`)
            }
        })
        .on('end', () => console.log('\nProcessing finished!\n'))
        .pipe(launchRecognizeStream(onData), { end: true }); // Pipe the audio stream to recognizeStream
}