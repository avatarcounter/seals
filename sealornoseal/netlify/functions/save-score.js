const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, score } = JSON.parse(event.body);
        const PRIVATE_KEY = process.env.DREAMLO_PRIVATE_KEY; // Hidden on Netlify

        const url = `https://dreamlo.com{PRIVATE_KEY}/add/${name}/${score}`;
        
        await fetch(url);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Score saved!" })
        };
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    }
};
