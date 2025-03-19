import pg from "pg";
const { Client } = pg;

interface Event {
    queryStringParameters: {
        query: string;
    };
}

export const handler = async (event: Event) => {
    const client = new Client({
        connectionString: process.env.DB_CONNECT_STRING,
    })
    try {
        await client.connect();
        const query = event.queryStringParameters.query;

        const res = await client.query(
            "SELECT * FROM INFO WHERE subject LIKE $1", [`${query}%`]
        );

        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify(res.rows)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        };
    }
};