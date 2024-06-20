import nms from "../nms/client";
import transcribe from "./transcribe";

export default function useTranscription() {
    let isStreaming: boolean = false;
    
    let streamingUrl: string = "";
  
    const setStreamingUrl = (url: string) => {
      if (isStreaming) {
        console.error("Still streaming, unable to set stream url.\n");
        return;
      }
      streamingUrl = url;
    }
  
    const startTranscription = () => {
      if (isStreaming) {
        return;
      }
  
      if (streamingUrl === "") {
        console.error("Please provide a url for the stream.\n");
        return;
      }
      
      isStreaming = true;
  
      try {
        transcribe(streamingUrl);
      } catch (exception) {
        console.error(exception);
        nms.stop();
        console.log("\nProgram stopped. Press Ctrl+C to exit.\n");
      }
    }
  
    const stopTranscription = () => {
      if (!isStreaming) {
        return;
      }
      isStreaming = false;
      console.log("\nTranscription stopped");
    }
  
    const dispatchAction = (actionType: "START" | "SET_URL" | "STOP") => {
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