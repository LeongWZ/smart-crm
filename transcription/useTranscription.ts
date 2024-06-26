import transcribe, { WordInfo } from "./transcribe";
import { GOOGLE_SPEECH_API_TIMEOUT } from "./transcribe";
import { Transcript, fetchPostBackend } from "../api/fetchPostBackend";
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

  const latestTranscriptWordCount = data.results
    .flatMap(result => result.alternatives[0].transcript.split(" "))
    .length

  if (latestTranscriptWordCount === 0) {
      console.log('\n\nReached transcription time limit, press Ctrl+C\n');
  }

  const result = data.results[data.results.length - 1];
  const wordsInfo = result.alternatives[0].words ?? [];
  // Note: The transcript within each result is separate and sequential per result.
  // However, the words list within an alternative includes all the words
  // from all the results thus far. Thus, to get all the words with speaker
  // tags, you only have to take the words list from the last result

  if (latestTranscriptWordCount >= 5) {
    fetchPostBackend({
      email: email,
      transcripts: getTranscriptsWithTimestamp(wordsInfo)
    });
  }
}

function getTranscriptsWithTimestamp(wordsInfo: WordInfo[]): Transcript[] {
  const groupWordInfoBySentence = wordsInfo.reduce(
    (acc: WordInfo[][], wordInfo: WordInfo) => {
      const arr = acc.at(-1);
      
      if (arr === undefined) {
        acc.push([ wordInfo ])
        return acc;
      }

      const prevSpeakerTag = arr.at(-1)?.speakerTag
      
      if (prevSpeakerTag === undefined || prevSpeakerTag === wordInfo.speakerTag) {
        arr.push(wordInfo)
      } else {
        acc.push([ wordInfo ])
      }
      
      return acc
    },
    []
  );
  
  return groupWordInfoBySentence.map(sentence => (
    {
      speakerTag: sentence[0].speakerTag,
      startTime: convertToHms(sentence[0].startTime.seconds),
      endTime: convertToHms(sentence[sentence.length - 1].endTime.seconds),
      content: sentence.map(wordInfo => wordInfo.word).join(" ")
    }
  ));
}

function convertToHms(timeInSeconds: number) {
  let time = timeInSeconds
  const hmsArr = []

  for (let i = 0; i < 2; i += 1) {
    hmsArr.push(time % 60);
    time = Math.floor(time / 60);
  }

  hmsArr.push(time);
  return hmsArr.reverse().join(":");
}