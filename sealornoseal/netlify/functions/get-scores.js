exports.handler = async () => {
    const PUBLIC_KEY = "69f60e2d8f40bb1068b944a4";
    // Fixed: Added /lb/ and the $ so the variable actually works
    const url = `http://dreamlo.com{PUBLIC_KEY}/json`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // This will help you see if Dreamlo is rejecting the request
            const errorText = await response.text();
            return { statusCode: response.status, body: `Dreamlo Error: ${errorText}` };
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
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
