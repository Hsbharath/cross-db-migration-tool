import dotenv from "dotenv";
import { DEFAULT_BATCH_SIZE, DEFAULT_MAX_RETRIES } from "../core/constants.js";

dotenv.config();

const env = {
  SOURCE_DB_TYPE: process.env.SOURCE_DB_TYPE || "mssql",
  TARGET_DB_TYPE: process.env.TARGET_DB_TYPE || "postgres",
  BATCH_SIZE: Number(process.env.BATCH_SIZE) || DEFAULT_BATCH_SIZE,
  MAX_RETRIES: Number(process.env.MAX_RETRIES) || DEFAULT_MAX_RETRIES,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

export default env;
