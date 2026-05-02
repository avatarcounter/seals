exports.handler = async (event) => {
    const PRIVATE_KEY = process.env.DREAMLO_PRIVATE_KEY;
    const { name, score } = JSON.parse(event.body);
    const url = `http://dreamlo.com{PRIVATE_KEY}/add/${name}/${score}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            return { statusCode: response.status, body: "Error saving score" };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Score saved!" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
