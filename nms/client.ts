import NodeMediaServer from "node-media-server";

const config = {
    logType: 1,
    
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        allow_origin: '*',
        mediaroot: "./media"
    }
}

const nms = new NodeMediaServer(config);

export default nms;