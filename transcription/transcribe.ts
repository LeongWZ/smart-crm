import ffmpeg from "fluent-ffmpeg";
import speech from "@google-cloud/speech";
import { fetchPostBackend } from "../api/fetchPostBackend";

const client = new speech.SpeechClient();

export const GOOGLE_SPEECH_API_TIMEOUT = 305; // in seconds

// Define the necessary variables
const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

type WordInfo = {
    startTime: string;
    endTime: string;
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
  
type LongRunningRecognizeResponse  = {
    results: Result[];
}

function onData(data: LongRunningRecognizeResponse) {
    const transcription = data.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

    if (!transcription) {
        console.log('\n\nReached transcription time limit, press Ctrl+C\n');
    }

    console.log(`Transcription: ${transcription}\n`);

    const result = data.results[data.results.length - 1];
    const wordsInfo = result.alternatives[0].words;
    // Note: The transcript within each result is separate and sequential per result.
    // However, the words list within an alternative includes all the words
    // from all the results thus far. Thus, to get all the words with speaker
    // tags, you only have to take the words list from the last result

    const firstSpeakerDialogue = wordsInfo?.filter(a => a.speakerTag === 1)
        .map(a => a.word)
        .join(" ");
    const secondSpeakerDialogue = wordsInfo?.filter(a => a.speakerTag === 2)
        .map(a => a.word)
        .join(" ");
    
    fetchPostBackend({
        transcript: transcription,
        dialogues: [
            { speakerTag: 1, content: firstSpeakerDialogue ?? ""},
            { speakerTag: 2, content: secondSpeakerDialogue ?? ""}
        ]
    });
}

// Stream the audio to the Google Cloud Speech API
const launchRecognizeStream = () => client
    .streamingRecognize({
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
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