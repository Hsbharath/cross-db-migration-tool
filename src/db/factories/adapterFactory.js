import { DB_TYPES } from "../../core/constants.js";
import { MssqlSourceAdapter } from "../../adapters/source/mssqlSourceAdapter.js";
import { PostgresTargetAdapter } from "../../adapters/target/postgresTargetAdapter.js";

/**
 * Returns a source adapter for the given DB type.
 * @param {string} dbType
 * @param {Object} migrationConfig
 */
export function createSourceAdapter(dbType, migrationConfig) {
  switch (dbType) {
    case DB_TYPES.MSSQL:
      return new MssqlSourceAdapter(migrationConfig);
    default:
      throw new Error(`Unsupported source DB type: ${dbType}`);
  }
}

/**
 * Returns a target adapter for the given DB type.
 * @param {string} dbType
 * @param {Object} migrationConfig
 */
export function createTargetAdapter(dbType, migrationConfig) {
  switch (dbType) {
    case DB_TYPES.POSTGRES:
      return new PostgresTargetAdapter(migrationConfig);
    default:
      throw new Error(`Unsupported target DB type: ${dbType}`);
  }
}
