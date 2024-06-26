import ngrok from "ngrok";

export default async function connectToNgrok(): Promise<[string, string]> {
    const token = process.env.NGROK_TOKEN ?? "";

    return Promise.all(
        [
            ngrok.connect({
                authtoken: token,
                proto: "tcp",
                addr: 1935,
                remote_addr: process.env.NGROK_RTMP_REMOTE_ADDR,
                region: "ap"
            }),
            ngrok.connect({
                authtoken: token,
                proto: "http",
                addr: 8443,
                subdomain: process.env.NGROK_SUBDOMAIN
            })
        ]
    ).then(([streamingUrl, liveStreamingPageUrl]: [string, string]) => 
        [`${streamingUrl.replace("tcp", "rtmp")}/live`, `${liveStreamingPageUrl}/admin/streams`]
      )
}