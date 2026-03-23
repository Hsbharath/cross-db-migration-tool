import sql from "mssql";
import logger from "../../utils/logger.js";

let pool = null;

const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_HOST || "localhost",
  port: Number(process.env.MSSQL_PORT) || 1433,
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === "true",
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

export async function getMssqlConnection() {
  if (pool) return pool;
  logger.info("Connecting to MSSQL...");
  pool = await sql.connect(config);
  logger.success("MSSQL connected.");
  return pool;
}

export async function closeMssqlConnection() {
  if (pool) {
    await pool.close();
    pool = null;
    logger.info("MSSQL connection closed.");
  }
}

export { sql };
