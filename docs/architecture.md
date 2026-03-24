# Architecture Overview

## 1. Goal

The goal of this system is to provide a **scalable, reusable, and database-agnostic migration framework** that can move data across heterogeneous databases (e.g., MSSQL → PostgreSQL) using a structured ETL pipeline.

---

## 2. High-Level Design

The system follows a modular ETL (Extract → Transform → Load) architecture with pluggable database adapters.

       +------------------+
       |   Source DB      |
       |   (MSSQL)        |
       +--------+---------+
                |
                v
         [ Source Adapter ]
                |
                v
            Extract
                |
                v
           Transform
                |
                v
            Validate
                |
                v
         [ Target Adapter ]
                |
                v
       +------------------+
       |   Target DB      |
       |   (PostgreSQL)   |
       +------------------+


---

## 3. Core Components

### 3.1 Migration Runner (Core Engine)

Responsible for orchestrating the migration process:

- Initializes source and target connections
- Fetches data in batches
- Applies transformation logic
- Loads data into target
- Runs validations
- Logs results

**Key Design Principle:**  
The runner is **database-agnostic** and interacts only through adapter interfaces.

---

### 3.2 Source Adapter

Encapsulates logic to extract data from a specific database.

**Responsibilities:**
- Establish connection
- Fetch data in batches (keyset pagination)
- Provide row counts (for validation)

**Current Implementation:**
- MSSQL Source Adapter

---

### 3.3 Target Adapter

Encapsulates logic to load data into a specific database.

**Responsibilities:**
- Insert batch records
- Manage transactions
- Provide row counts
- Handle insert failures

**Current Implementation:**
- PostgreSQL Target Adapter

---

### 3.4 Transformer Layer

Handles schema and data normalization between source and target.

**Responsibilities:**
- Rename fields (e.g., `CustomerID` → `customer_id`)
- Convert data types
- Clean invalid data
- Apply defaults

**Design Principle:**
- Pure functions (no DB dependency)
- Easily testable

---

### 3.5 Validator Layer

Ensures migration correctness.

**Initial Checks:**
- Source vs target row count
- Basic data integrity checks

**Future Enhancements:**
- Field-level validation
- Duplicate detection
- Data consistency checks

---

### 3.6 Adapter Factory

Dynamically selects adapters based on configuration.

Example:
- `mssql` → MSSQL Adapter
- `postgres` → PostgreSQL Adapter

This enables easy extension to other databases.

---

## 4. Data Flow

1. Initialize environment and configuration
2. Create source and target adapters
3. Start migration job
4. Fetch batch from source
5. Transform records
6. Load records into target
7. Repeat until complete
8. Validate results
9. Log summary

---

## 5. Key Design Decisions

### 5.1 Adapter Pattern

Decouples database-specific logic from core migration engine.

**Benefit:**
- Easily extend to new databases
- Clean separation of concerns

---

### 5.2 Batch Processing

Data is processed in batches instead of full-table load.

**Benefits:**
- Memory efficiency
- Scalability for large datasets
- Better failure handling

---

### 5.3 Keyset Pagination (Future Enhancement)

Instead of OFFSET:
- Use `WHERE id > last_processed_id`

**Benefits:**
- Faster on large tables
- Stable ordering
- Supports checkpoint recovery

---

### 5.4 Modular Migration Definitions

Each table has:
- migration config
- transformer
- validator

**Benefit:**
- Clean separation per dataset
- Easier to maintain and extend

---

## 6. Extensibility

To support a new database:

1. Create a new adapter:
   - `mysqlSourceAdapter.js`
   - `mongodbTargetAdapter.js`

2. Implement standard interface:
   - connect()
   - fetchBatch()
   - insertBatch()
   - count()

3. Register in adapter factory

No changes required in core logic.

---

## 7. Future Enhancements

- Incremental migration (CDC-based)
- Checkpoint recovery system
- Retry and failure handling
- Parallel processing
- Schema auto-mapping
- Monitoring dashboard

---

## 8. Summary

This architecture ensures:

- Scalability via batching
- Flexibility via adapters
- Maintainability via modular design
- Extensibility for multi-database support
