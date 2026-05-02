const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, score } = JSON.parse(event.body);
        const PRIVATE_KEY = process.env.DREAMLO_PRIVATE_KEY; // This is the secret!

        const url = `https://dreamlo.com{PRIVATE_KEY}/add/${name}/${score}`;
        
        await fetch(url);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Score saved successfully!" })
        };
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    }
};
