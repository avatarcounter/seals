exports.handler = async () => {
    const PUBLIC_KEY = "69f60e2d8f40bb1068b944a4";
    const url = `http://dreamlo.com{PUBLIC_KEY}/json`;

    try {
        const response = await fetch(url);
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
