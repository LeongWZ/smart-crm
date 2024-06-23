import transcribe from "./transcribe";
import { GOOGLE_SPEECH_API_TIMEOUT } from "./transcribe";
import { fetchPostBackend } from "../api/fetchPostBackend";
import { LongRunningRecognizeResponse } from "./transcribe";

export default function useTranscription() {
  let isStreaming: boolean = false;

  let streamingId: string | null = null;

  let streamingUrl: string = "";

  let email: string = "";

  const setStreamingUrl = (url: string) => {
    if (isStreaming) {
      console.error("Still streaming, unable to set stream url.\n");
      return;
    }
    streamingUrl = url;
  }

  const setEmail = async (emailInput: string) => {
    email = emailInput
  }

  const startTranscription = (id: string) => {
    if (isStreaming) {
      return;
    }
    
    if (!email) {
      console.error("Please provide an email on your Lark account.\n");
      return;
    }

    if (streamingUrl === "") {
      console.error("Please provide a url for the stream.\n");
      return;
    }

    console.log("\nStarting transcription...");

    streamingId = id;
    isStreaming = true;

    const loopTranscribe = () => {
      if (isStreaming && streamingId === id) {
        try {
          transcribe(
            streamingUrl,
            (email => data => onData(data, email))(email) // currying
          );
          setTimeout(loopTranscribe, GOOGLE_SPEECH_API_TIMEOUT * 1000); // convert to ms
        } catch (exception) {
          console.error(exception);
          stopTranscription(streamingId);
        }
      }
    }

    loopTranscribe();
  }

  const stopTranscription = (id: string) => {
    if (!isStreaming || streamingId !== id) {
      return;
    }
    isStreaming = false;
    streamingId = null;
    console.log("\nTranscription stopped");
  }

  const dispatchAction = (actionType: "START" | "STOP" | "SET_URL" | "SET_EMAIL" ) => {
    switch (actionType) {
      case "START":
        return startTranscription
      case "STOP":
        return stopTranscription
      case "SET_URL":
        return setStreamingUrl
      case "SET_EMAIL":
        return setEmail
      default:
        throw new Error("No such action type " + actionType)
    }
  }

  return dispatchAction;
}

function onData(data: LongRunningRecognizeResponse, email: string) {
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

  fetchPostBackend(email, {
    transcript: transcription,
    dialogues: [
      { speakerTag: 1, content: firstSpeakerDialogue ?? "" },
      { speakerTag: 2, content: secondSpeakerDialogue ?? "" }
    ]
  });
}