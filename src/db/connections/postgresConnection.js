import pg from "pg";
import logger from "../../utils/logger.js";

const { Pool } = pg;

let pool = null;

export function getPostgresPool() {
  if (pool) return pool;
  pool = new Pool({
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
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
