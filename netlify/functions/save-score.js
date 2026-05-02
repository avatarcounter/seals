exports.handler = async (event) => {
    const PRIVATE_KEY = process.env.DREAMLO_PRIVATE_KEY;
    const { name, score } = JSON.parse(event.body);
    // Change http to https
    const url = `https://dreamlo.com{PRIVATE_KEY}/add/${name}/${score}`;

    try {
        const response = await fetch(url);
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
