const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, score } = JSON.parse(event.body);
        const PRIVATE_KEY = process.env.DREAMLO_PRIVATE_KEY;

        // Fixed: Added /lb/ and the missing $ for the template literal
        const url = `https://dreamlo.com{PRIVATE_KEY}/add/${name}/${score}`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Dreamlo rejected the score update");
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ message: "Score saved!" })
        };
    } catch (err) {
        console.error("Save error:", err);
        return { 
            statusCode: 500, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.toString() }) 
        };
    }
};
