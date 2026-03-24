export const DB_TYPES = {
  MSSQL: "mssql",
  POSTGRES: "postgres",
};

export const MIGRATION_STATUS = {
  PENDING: "pending",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
};

export const DEFAULT_BATCH_SIZE = 100;
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_RETRY_DELAY_MS = 500;
