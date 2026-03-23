import { getMssqlConnection, sql } from "../../db/connections/mssqlConnection.js";
import logger from "../../utils/logger.js";

export class MssqlSourceAdapter {
  constructor(migrationConfig) {
    this.config = migrationConfig;
    this.pool = null;
  }

  async connect() {
    this.pool = await getMssqlConnection();
  }

  /**
   * Fetch a batch of rows using offset-based pagination.
   * @param {number} offset
   * @param {number} batchSize
   * @returns {Promise<Array>}
   */
  async fetchBatch(offset, batchSize) {
    const { tableName, primaryKey } = this.config;
    logger.debug(`Fetching batch from ${tableName}`, { offset, batchSize });

    const result = await this.pool
      .request()
      .input("offset", sql.Int, offset)
      .input("batchSize", sql.Int, batchSize)
      .query(
        `SELECT * FROM ${tableName}
         ORDER BY ${primaryKey}
         OFFSET @offset ROWS
         FETCH NEXT @batchSize ROWS ONLY`
      );

    return result.recordset;
  }

  /**
   * Get total row count in source table.
   * @returns {Promise<number>}
   */
  async count() {
    const { tableName } = this.config;
    const result = await this.pool
      .request()
      .query(`SELECT COUNT(*) AS total FROM ${tableName}`);
    return result.recordset[0].total;
  }
}
