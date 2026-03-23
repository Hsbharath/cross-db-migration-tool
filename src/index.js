import logger from "./utils/logger.js";

async function main() {
  try {
    logger.info("Starting cross-database migration tool...");
  } catch (error) {
    logger.error("Migration failed.");
  } finally {
    try {
      logger.info("Connections closed.");
    } catch (closeError) {
      logger.error("Error while closing database connections.");
    }
  }
}

main();