CREATE TABLE IF NOT EXISTS customers (
  customer_id  INT PRIMARY KEY,
  full_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255),
  created_at   TIMESTAMPTZ
);
