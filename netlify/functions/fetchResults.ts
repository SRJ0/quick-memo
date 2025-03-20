import pg from "pg";
const { Client } = pg;

interface Event {
    queryStringParameters: {
        dbname: string;
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
        const dbname = event.queryStringParameters.dbname;
        const queryString = `SELECT * FROM ${dbname} WHERE subject LIKE $1`;
        const res = await client.query(queryString, [`${query}%`]);

        await client.end();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(res.rows)
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(error)
        };
    }
};