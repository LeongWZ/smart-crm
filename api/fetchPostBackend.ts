type Dialogue = {
    speakerTag: number,
    content: string
}

type PostData = {
    transcript: string,
    dialogues: Dialogue[],
}

const API_ENDPOINT = "http://host.docker.internal:8000";

export async function fetchPostBackend(data: PostData) {
    fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            api_key: process.env.BACKEND_API_KEY
        })
    })
        .then(response => response.json())
        .then(result => console.log(`\n${JSON.stringify(result)}\n`));
}