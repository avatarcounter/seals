const fetch = require('node-fetch');

exports.handler = async () => {
    // Your Dreamlo Public Key
    const PUBLIC_KEY = "69f60e2d8f40bb1068b944a4";
    
    // We call HTTP here to avoid the SSL error
    const url = `http://dreamlo.com{PUBLIC_KEY}/json`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                // This allows your HTML page to talk to this function
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        };
    } catch (err) {
        console.error("Error fetching scores:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch scores from Dreamlo" })
        };
    }
};
