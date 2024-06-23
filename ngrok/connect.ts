import ngrok from "ngrok";

export default async function connectToNgrok(): Promise<[string, string]> {
    const token = process.env["NGROK_TOKEN"] ?? "";
    return Promise.all(
        [
            ngrok.connect({
                authtoken: token,
                proto: "tcp",
                addr: 1935
            }),
            ngrok.connect({
                authtoken: token,
                proto: "http",
                addr: 8443
            })
        ]
    ).then(([streamingUrl, liveStreamingPageUrl]: [string, string]) => 
        [`${streamingUrl.replace("tcp", "rtmp")}/live`, `${liveStreamingPageUrl}/admin/streams`]
      )
}