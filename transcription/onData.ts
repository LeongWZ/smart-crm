import { WordInfo } from "./transcribe";
import { Transcript, fetchPostBackend } from "../api/fetchPostBackend";
import { LongRunningRecognizeResponse } from "./transcribe";


export default function onData(data: LongRunningRecognizeResponse, email: string) {

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