/**
 * @typedef {Object} MigrationConfig
 * @property {string} tableName - Source table name
 * @property {string} targetTable - Target table name
 * @property {string} primaryKey - Primary key column for keyset pagination
 * @property {Function} transformer - Row transformer function
 * @property {Function} validator - Post-migration validator function
 */

/**
 * @typedef {Object} MigrationResult
 * @property {string} table - Table name
 * @property {number} extracted - Rows extracted from source
 * @property {number} loaded - Rows loaded into target
 * @property {number} failed - Rows that failed to insert
 * @property {string} status - Migration status
 * @property {number} durationMs - Total duration in milliseconds
 */

/**
 * @typedef {Object} BatchResult
 * @property {number} inserted - Rows inserted in this batch
 * @property {number} failed - Rows failed in this batch
 */
