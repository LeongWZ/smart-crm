import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import connectToNgrok from "./ngrok/connect";
import nms from "./nms/client";
import onData from "./transcription/onData";
import { validateEmail } from "./api/validateEmail";
import transcribe from "./transcription/transcribe";


dotenv.config();

nms.run();

nms.on("postPublish", (id, streamPath, args) => {
  console.log(nms.getSession(id));
  const email = streamPath.split("/").pop() ?? "";
  
  let isStreaming: boolean = true;

  const loopTranscribe = () => {
    if (!isStreaming) {
      return;
    };

    transcribe(
      `${streamingUrl}/${email}`,
      (email => data => onData(data, email))(email) // currying
    )
      .on('error', err => {
          isStreaming = false;
          const message: string = err.message;
          if (!message.includes("Output stream error: Exceeded maximum allowed stream duration of 305 seconds.") &&
              !message.includes("process ran into a timeout")) {
              console.error(`\nAn error occurred: ${message}\n`)
          }
      })
      .on('end', () => {
        isStreaming = false;
        console.log('\nProcessing finished!\n')
      });

    setTimeout(loopTranscribe, 305 * 1000); // convert to ms
  }

  loopTranscribe();
})

connectToNgrok().then(console.log);

const streamingUrl = `rtmp://${process.env.NGROK_RTMP_REMOTE_ADDR}/live`;
const livestreamUrl = `https://${process.env.NGROK_SUBDOMAIN}/admin/streams`;


const app: Express = express();

app.set('views', './public/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.render("index", {
    error: req.query.error,
    streamingUrl: req.query.streamingUrl,
    streamingKey: req.query.streamingKey,
    livestreamUrl: req.query.livestreamUrl
  });
})

const validate = async (req: Request, res: Response, next: NextFunction) => {
  const email: string = req.body.email;
  
  try {
    await validateEmail(email);
    next();
  } catch (error) {
    res.status(404)
      .redirect(`/?error=${"Invalid email. Please input the email you used on your Lark account."}`)
    return;
  }
  
}

app.post("/", validate, async (req: Request, res: Response) => {
  const email: string = req.body.email;

  res.status(200)
    .redirect(`/?streamingUrl=${streamingUrl}&streamingKey=${email}&livestreamUrl=${livestreamUrl}`)
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})