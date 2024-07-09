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
        mediaroot: "./media",
        api: true
    },
    auth: {
        api: true,
        api_user: 'admin',
        api_pass: 'admin',
        play: false,
        publish: false,
        secret: 'nodemedia2017privatekey'
    }
}

const nms = new NodeMediaServer(config);

export default nms;