import logger from "./logger.js";
import { DEFAULT_MAX_RETRIES, DEFAULT_RETRY_DELAY_MS } from "../core/constants.js";

/**
 * Retries an async function with exponential backoff.
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries
 * @param {number} delayMs - Base delay in milliseconds
 * @returns {Promise<any>}
 */
export async function withRetry(fn, maxRetries = DEFAULT_MAX_RETRIES, delayMs = DEFAULT_RETRY_DELAY_MS) {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        logger.error(`All ${maxRetries} retries exhausted.`, { error: err.message });
        throw err;
      }
      const wait = delayMs * Math.pow(2, attempt - 1);
      logger.warn(`Attempt ${attempt} failed. Retrying in ${wait}ms...`, {
        error: err.message,
      });
      await sleep(wait);
    }
  }
}

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
