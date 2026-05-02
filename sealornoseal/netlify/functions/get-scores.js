// netlify/functions/get-scores.js
exports.handler = async () => {
    const PUBLIC_KEY = "69f60e2d8f40bb1068b944a4";
    const url = `http://dreamlo.com{PUBLIC_KEY}/json`;

    try {
        // NATIVE FETCH (No require needed in Node 18+)
        const response = await fetch(url);
        
        if (!response.ok) {
            return { statusCode: response.status, body: "Dreamlo Error" };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
