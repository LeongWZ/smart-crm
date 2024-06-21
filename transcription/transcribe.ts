import ffmpeg from "fluent-ffmpeg";
import speech from "@google-cloud/speech";

const client = new speech.SpeechClient();

export const GOOGLE_SPEECH_API_TIMEOUT = 305; // in seconds

// Define the necessary variables
const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

// Stream the audio to the Google Cloud Speech API
const launchRecognizeStream = () => client
    .streamingRecognize({
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
        },
        interimResults: false, // If you want interim results, set this to true
    })
    .on('error', error => console.error)
    .on('data', data => {
        console.log(
            data.results[0] && data.results[0].alternatives[0]
                ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                : '\n\nReached transcription time limit, press Ctrl+C\n'
        );
    });

export default function transcribe(rtmpUrl: string) {
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
        .pipe(launchRecognizeStream(), { end: true }); // Pipe the audio stream to recognizeStream
}