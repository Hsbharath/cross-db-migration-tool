import logger from "../../utils/logger.js";

/**
 * Validates the migration result for the customers table.
 * Checks source vs target row counts.
 *
 * @param {Object} sourceAdapter
 * @param {Object} targetAdapter
 * @returns {Promise<{passed: boolean, sourceCount: number, targetCount: number}>}
 */
export async function validateCustomers(sourceAdapter, targetAdapter) {
  const sourceCount = await sourceAdapter.count();
  const targetCount = await targetAdapter.count();

  const passed = sourceCount === targetCount;

  if (passed) {
    logger.success(`Validation passed: ${sourceCount} rows in source and target.`);
  } else {
    logger.warn("Validation failed: row count mismatch.", {
      sourceCount,
      targetCount,
      diff: sourceCount - targetCount,
    });
  }

  return { passed, sourceCount, targetCount };
}
