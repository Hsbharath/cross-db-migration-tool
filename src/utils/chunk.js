/**
 * Splits an array into chunks of the given size.
 * @param {Array} array
 * @param {number} size
 * @returns {Array<Array>}
 */
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
