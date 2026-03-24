import pg from "pg";
import logger from "../../utils/logger.js";

const { Pool } = pg;

let pool = null;

export function getPostgresPool() {
  if (pool) return pool;
  pool = new Pool({
    host: process.env.PG_HOST || "localhost",
    port: Number(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on("error", (err) => {
    logger.error("Unexpected Postgres pool error", { error: err.message });
  });

  return pool;
}

export async function connectPostgres() {
  const p = getPostgresPool();
  logger.info("Connecting to PostgreSQL...");
  const client = await p.connect();
  client.release();
  logger.success("PostgreSQL connected.");
  return p;
}

export async function closePostgresConnection() {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info("PostgreSQL connection closed.");
  }
}
