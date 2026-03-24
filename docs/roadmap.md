# Project Roadmap

## Phase 1: MVP (Day 1 Goal) ✅

**Objective:**  
Basic working migration from MSSQL → PostgreSQL

### Features
- Docker setup for MSSQL + PostgreSQL
- Source schema (MSSQL)
- Target schema (PostgreSQL)
- DB connection setup in Node.js
- Single table migration (customers)
- Basic transformation
- Basic validation (row count)

---

## Phase 2: Core ETL Enhancements

**Objective:**  
Make migration robust and scalable

### Features
- Batch processing
- Configurable batch size
- Structured logging
- Error handling
- Retry mechanism (basic)
- Improved transformer logic

---

## Phase 3: Multi-Table Support

**Objective:**  
Handle relational data

### Features
- Add tables:
  - orders
  - order_items
- Maintain migration order
- Handle foreign key dependencies
- Data consistency validation

---

## Phase 4: Checkpoint & Resume

**Objective:**  
Make migration restart-safe

### Features
- Checkpoint table in target DB
- Track last processed ID
- Resume migration from failure point
- Job status tracking

---

## Phase 5: Incremental Migration

**Objective:**  
Support continuous data sync

### Features
- Use `updated_at` for incremental load
- Sync only changed records
- Avoid duplicate inserts
- Upsert support

---

## Phase 6: Advanced Validation

**Objective:**  
Ensure data correctness

### Features
- Field-level validation
- Sample record comparison
- Duplicate detection
- Null constraint checks
- Validation reports

---

## Phase 7: Performance Optimization

**Objective:**  
Handle large datasets efficiently

### Features
- Parallel batch processing
- Connection pooling tuning
- Bulk inserts
- Streaming extraction

---

## Phase 8: Multi-Database Support

**Objective:**  
Extend beyond MSSQL/PostgreSQL

### Add Adapters
- MySQL
- Oracle
- MongoDB (target)
- Snowflake (target)

---

## Phase 9: CLI & Developer Experience

**Objective:**  
Improve usability

### Features
- CLI commands:
  - migrate:customers
  - migrate:all
  - validate
- Flags:
  - --batchSize
  - --resume
  - --dryRun

---

## Phase 10: Observability & Monitoring

**Objective:**  
Make system production-ready

### Features
- Structured logging
- Metrics (rows/sec, failures)
- Dashboard (optional)
- Alerts for failures

---

## Phase 11: Production Readiness

**Objective:**  
Enterprise-grade migration tool

### Features
- CI/CD integration
- Secure credential management
- Config-driven pipelines
- Schema versioning

---

## Final Vision

A **pluggable, scalable migration framework** capable of:

- Migrating across multiple databases
- Handling large-scale datasets
- Supporting real-time and batch pipelines
- Ensuring high data integrity