import transcribe from "./transcribe";
import { GOOGLE_SPEECH_API_TIMEOUT } from "./transcribe";

export default function useTranscription() {
    let isStreaming: boolean = false;

    let streamingId: string | null = null;
    
    let streamingUrl: string = "";
  
    const setStreamingUrl = (url: string) => {
      if (isStreaming) {
        console.error("Still streaming, unable to set stream url.\n");
        return;
      }
      streamingUrl = url;
    }
  
    const startTranscription = (id: string) => {
      if (isStreaming) {
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
            transcribe(streamingUrl);
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
  
    const dispatchAction = (actionType: "START" | "STOP" | "SET_URL") => {
      switch (actionType) {
        case "START":
          return startTranscription
        case "STOP":
          return stopTranscription
        case "SET_URL":
          return setStreamingUrl
        default:
          throw new Error("No such action type " + actionType)
      }
    }
  
    return dispatchAction;
  }