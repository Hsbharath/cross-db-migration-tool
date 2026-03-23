import { getPostgresPool } from "../../db/connections/postgresConnection.js";
import logger from "../../utils/logger.js";

export class PostgresTargetAdapter {
  constructor(migrationConfig) {
    this.config = migrationConfig;
    this.pool = null;
  }

  async connect() {
    this.pool = getPostgresPool();
  }

  /**
   * Insert a batch of transformed rows inside a transaction.
   * Returns counts of inserted and failed rows.
   * @param {Array<Object>} rows
   * @returns {Promise<{inserted: number, failed: number}>}
   */
  async insertBatch(rows) {
    if (!rows || rows.length === 0) return { inserted: 0, failed: 0 };

    const { targetTable } = this.config;
    const columns = Object.keys(rows[0]);
    const client = await this.pool.connect();

    let inserted = 0;
    let failed = 0;

    try {
      await client.query("BEGIN");

      for (const row of rows) {
        try {
          const values = columns.map((col) => row[col]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
          const colList = columns.map((c) => `"${c}"`).join(", ");

          await client.query(
            `INSERT INTO ${targetTable} (${colList}) VALUES (${placeholders})`,
            values
          );
          inserted++;
        } catch (rowErr) {
          logger.warn(`Failed to insert row into ${targetTable}`, {
            error: rowErr.message,
            row,
          });
          failed++;
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error(`Batch transaction rolled back for ${targetTable}`, {
        error: err.message,
      });
      throw err;
    } finally {
      client.release();
    }

    return { inserted, failed };
  }

  /**
   * Get total row count in target table.
   * @returns {Promise<number>}
   */
  async count() {
    const { targetTable } = this.config;
    const result = await this.pool.query(
      `SELECT COUNT(*) AS total FROM ${targetTable}`
    );
    return Number(result.rows[0].total);
  }
}
