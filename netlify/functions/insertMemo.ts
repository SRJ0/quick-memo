import pg from "pg";
const { Client } = pg;

interface Event {
    queryStringParameters: {
        dbname: string;
        query: string;
        memo: string;
        id: number;
    };
}

export const handler = async (event: Event) => {
    const client = new Client({
        connectionString: process.env.DB_CONNECT_STRING,
    })
    try {
        await client.connect();
        const id = event.queryStringParameters.id;
        const memo = event.queryStringParameters.memo;
        // const query = event.queryStringParameters.query;
        const dbname = event.queryStringParameters.dbname;
        const queryString = `UPDATE ${dbname} SET memo = $1 WHERE id = $2`;
        const res = await client.query(queryString, [memo, id]);

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
}