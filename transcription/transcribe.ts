import ffmpeg from "fluent-ffmpeg";
import speech from "@google-cloud/speech";

const client = new speech.SpeechClient();

// Define the necessary variables
const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

// Stream the audio to the Google Cloud Speech API
const recognizeStream = client
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
    ffmpeg(rtmpUrl, { timeout: 432000 })
        .on('start', function (commandLine) {
            console.log(`\nSpawned Ffmpeg with command: ${commandLine}\n`);
        })
        .noVideo() // Process only the audio stream
        .audioCodec('pcm_s16le')
        .format('s16le')
        .audioFrequency(sampleRateHertz)
        .audioChannels(1)
        .on("data", data => console.log)
        .on('error', err => console.log(`\nAn error occurred: ${err.message}\n`))
        .on('end', () => console.log('\nProcessing finished!\n'))
        .pipe(recognizeStream, { end: true }); // Pipe the audio stream to recognizeStream
}