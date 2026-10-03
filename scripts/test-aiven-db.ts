import "dotenv/config";
import mariadb from "mariadb";

async function main() {
    const pool = mariadb.createPool({
        host: "165.227.160.59",
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 1,
        connectTimeout: 1000,
        ssl: process.env.DB_SSL === "true"
            ? {
                rejectUnauthorized: false,
            }
            : undefined,
    });

    try {
        const connection = await pool.getConnection();

        console.log("CONNECTED");

        const rows = await connection.query(
            "SELECT DATABASE() AS databaseName, VERSION() AS version"
        );

        console.log(rows);

        connection.release();
    } catch (error) {
        console.error("DATABASE CONNECTION FAILED");
        console.error(error);
    } finally {
        await pool.end();
    }
}

main();