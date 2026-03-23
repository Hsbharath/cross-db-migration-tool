/**
 * Transforms a raw MSSQL customer row into the PostgreSQL target schema.
 * - Renames PascalCase fields to snake_case
 * - Trims whitespace from FullName
 * - Lowercases email
 * - Replaces null/empty email with null
 * - Converts CreatedAt to a JS Date
 *
 * @param {Object} row - Raw source row
 * @returns {Object} - Transformed row for target DB
 */
export function transformCustomer(row) {
  const email =
    row.Email && row.Email.trim() !== ""
      ? row.Email.trim().toLowerCase()
      : null;

  return {
    customer_id: row.CustomerID,
    full_name: row.FullName ? row.FullName.trim() : null,
    email,
    created_at: row.CreatedAt ? new Date(row.CreatedAt) : null,
  };
}
