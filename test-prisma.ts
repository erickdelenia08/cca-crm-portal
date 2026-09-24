import "dotenv/config";
import mariadb from "mariadb";

async function main() {
    console.log("=== MARIADB DRIVER TEST ===");

    const pool = mariadb.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        connectionLimit: 1,
        connectTimeout: 5000,

        // MySQL 8 / caching_sha2_password
        allowPublicKeyRetrieval: true,
    });

    let conn;

    try {
        console.log("Connecting to MySQL...");

        conn = await pool.getConnection();

        console.log("✅ MySQL connection successful!");

        const result = await conn.query("SELECT 1 AS connected");

        console.log("Query result:", result);

        const users = await conn.query(
            "SELECT id, email, role FROM users"
        );

        console.log("Users:", users);
    } catch (error) {
        console.error("❌ MARIADB DRIVER ERROR:");
        console.error(error);
    } finally {
        if (conn) {
            conn.release();
        }

        await pool.end();
    }
}

main();