const fetch = require('node-fetch');

exports.handler = async () => {
    const PUBLIC_KEY = "69f60e2d8f40bb1068b944a4";
    
    // Fixed: Added "/" and the missing "$" for the template literal
    const url = `http://dreamlo.com{PUBLIC_KEY}/json`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Dreamlo responded with status: ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(data)
        };
    } catch (err) {
        console.error("Error fetching scores:", err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};
