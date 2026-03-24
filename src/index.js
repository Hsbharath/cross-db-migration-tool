import "./config/env.js";
import logger from "./utils/logger.js";
import { MigrationRunner } from "./core/MigrationRunner.js";
import { createSourceAdapter, createTargetAdapter } from "./db/factories/adapterFactory.js";
import { closeMssqlConnection } from "./db/connections/mssqlConnection.js";
import { closePostgresConnection } from "./db/connections/postgresConnection.js";
import customersMigration from "./migrations/customers/customers.migration.js";
import env from "./config/env.js";

async function main() {
  logger.info("Starting cross-database migration tool...");
  logger.info(`Source: ${env.SOURCE_DB_TYPE} → Target: ${env.TARGET_DB_TYPE}`);

  const sourceAdapter = createSourceAdapter(env.SOURCE_DB_TYPE, customersMigration);
  const targetAdapter = createTargetAdapter(env.TARGET_DB_TYPE, customersMigration);

  const runner = new MigrationRunner(sourceAdapter, targetAdapter, customersMigration, {
    batchSize: env.BATCH_SIZE,
    maxRetries: env.MAX_RETRIES,
  });

  try {
    const result = await runner.run();
    if (result.status === "completed") {
      logger.success("All migrations finished successfully.");
      process.exit(0);
    } else {
      logger.warn("Migration finished with issues. Check logs above.");
      process.exit(1);
    }
  } catch (error) {
    logger.error("Migration failed with an unrecoverable error.", {
      error: error.message,
    });
    process.exit(1);
  } finally {
    try {
      await closeMssqlConnection();
      await closePostgresConnection();
      logger.info("All connections closed.");
    } catch (closeError) {
      logger.error("Error while closing connections.", { error: closeError.message });
    }
  }
}

main();
