type Dialogue = {
    speakerTag: number,
    content: string
}

type PostData = {
    transcript: string,
    dialogues: Dialogue[],
}

export async function fetchPostBackend(email: string, data: PostData) {
    const url = `http://host.docker.internal:8000/?api_key=${process.env.BACKEND_API_KEY}`;

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            email: email
        })
    })
        .then(async response => {
            const result = await response.json();

            if (response.status === 404) {
                throw new Error(result["detail"])
            }

            return result
        });
}