import logger from "../utils/logger.js";
import { withRetry } from "../utils/helper.js";
import { MIGRATION_STATUS, DEFAULT_BATCH_SIZE, DEFAULT_MAX_RETRIES } from "./constants.js";

export class MigrationRunner {
  /**
   * @param {Object} sourceAdapter
   * @param {Object} targetAdapter
   * @param {Object} migrationConfig
   * @param {Object} options
   * @param {number} options.batchSize
   * @param {number} options.maxRetries
   */
  constructor(sourceAdapter, targetAdapter, migrationConfig, options = {}) {
    this.source = sourceAdapter;
    this.target = targetAdapter;
    this.config = migrationConfig;
    this.batchSize = options.batchSize || DEFAULT_BATCH_SIZE;
    this.maxRetries = options.maxRetries || DEFAULT_MAX_RETRIES;
  }

  async run() {
    const { tableName, transformer, validator } = this.config;
    const startTime = Date.now();

    /** @type {import('./types.js').MigrationResult} */
    const result = {
      table: tableName,
      extracted: 0,
      loaded: 0,
      failed: 0,
      status: MIGRATION_STATUS.RUNNING,
      durationMs: 0,
    };

    logger.info(`Starting migration for table: ${tableName}`, {
      batchSize: this.batchSize,
    });

    try {
      await this.source.connect();
      await this.target.connect();

      const totalRows = await this.source.count();
      logger.info(`Total rows to migrate: ${totalRows}`, { table: tableName });

      let offset = 0;
      let batchNumber = 0;

      while (offset < totalRows) {
        batchNumber++;
        logger.debug(`Processing batch #${batchNumber}`, {
          offset,
          batchSize: this.batchSize,
        });

        // Fetch with retry
        const rawBatch = await withRetry(
          () => this.source.fetchBatch(offset, this.batchSize),
          this.maxRetries
        );

        if (!rawBatch || rawBatch.length === 0) break;

        result.extracted += rawBatch.length;

        // Transform
        const transformedBatch = rawBatch.map((row) => {
          try {
            return transformer(row);
          } catch (err) {
            logger.warn(`Transform failed for row`, {
              row,
              error: err.message,
            });
            result.failed++;
            return null;
          }
        }).filter(Boolean);

        // Insert with retry
        const { inserted, failed } = await withRetry(
          () => this.target.insertBatch(transformedBatch),
          this.maxRetries
        );

        result.loaded += inserted;
        result.failed += failed;

        logger.info(`Batch #${batchNumber} complete`, {
          inserted,
          failed,
          offset,
        });

        offset += rawBatch.length;
      }

      // Validate
      logger.info(`Running validation for ${tableName}...`);
      const validation = await validator(this.source, this.target);

      result.status = validation.passed
        ? MIGRATION_STATUS.COMPLETED
        : MIGRATION_STATUS.FAILED;

    } catch (err) {
      result.status = MIGRATION_STATUS.FAILED;
      logger.error(`Migration failed for ${tableName}`, { error: err.message });
      throw err;
    } finally {
      result.durationMs = Date.now() - startTime;
      this._logSummary(result);
    }

    return result;
  }

  _logSummary(result) {
    const summary = {
      table: result.table,
      extracted: result.extracted,
      loaded: result.loaded,
      failed: result.failed,
      status: result.status,
      durationMs: result.durationMs,
    };

    if (result.status === MIGRATION_STATUS.COMPLETED) {
      logger.success(`Migration completed for ${result.table}`, summary);
    } else {
      logger.warn(`Migration ended with status: ${result.status}`, summary);
    }
  }
}
