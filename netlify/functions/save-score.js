// netlify/functions/save-score.js
exports.handler = async (event) => {
    try {
        const { name, score } = JSON.parse(event.body);
        const PRIVATE_KEY = process.env.DREAMLO_PRIVATE_KEY; 
        
        // Note: Dreamlo uses HTTP for the free tier, sometimes HTTPS fails
        const url = `http://dreamlo.com{PRIVATE_KEY}/add/${name}/${score}`;
        
        const response = await fetch(url);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Saved" })
        };
    } catch (error) {
        return { statusCode: 500, body: error.message };
    }
};
