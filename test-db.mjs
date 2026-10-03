import "dotenv/config";
import mariadb from "mariadb";

const t = Date.now();
try {
  const conn = await mariadb.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    connectTimeout: 15000,
  });
  console.log("OK", await conn.query("SELECT 1 AS ok"), `${Date.now() - t}ms`);
  await conn.end();
} catch (e) {
  console.error("ERROR:", e.code, e.message, `${Date.now() - t}ms`);
}