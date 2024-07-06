export type Transcript = {
    speakerTag?: number;
    startTime: string;
    endTime: string;
    content: string;
}

export type PostData = {
    email: string;
    transcripts: Transcript[],
}

export async function fetchPostBackend(data: PostData) {
    // For development
    //const url = `http://host.docker.internal:8000/?api_key=${process.env.BACKEND_API_KEY}`;
    
    const url = `https://smart-crm-backend-iodqf.ondigitalocean.app/?api_key=${process.env.BACKEND_API_KEY}`;

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then(async response => {
            const result = await response.json();

            if (response.status === 404) {
                throw new Error(result["detail"])
            }

            return result
        });
}