exports.handler = async () => {
    // UPDATED with your new Public Key
    const PUBLIC_KEY = "69f639198f40bb1068bb7e9f";
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
