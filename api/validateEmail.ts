export async function validateEmail(email: string) {
    const url = `http://host.docker.internal:8000/validate/?api_key=${process.env.BACKEND_API_KEY}&email=${email}`;

    return fetch(url, {  method: "POST" })
        .then(async response => {
            const result = await response.json();

            if (response.status === 404) {
                throw new Error(result["detail"])
            }

            return result
        });
}