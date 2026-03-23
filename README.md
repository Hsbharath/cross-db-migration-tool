# Cross-Database Migration Tool

## Overview

This project is a **Node.js-based ETL migration tool** designed to move data from **MSSQL to PostgreSQL** using a scalable and extensible architecture.

The system is built with a focus on:

- Modularity
- Scalability
- Data consistency
- Future multi-database support

---

## Problem Statement

Organizations often need to migrate data across different databases (e.g., MSSQL → PostgreSQL) due to:

- modernization efforts
- cost optimization
- performance improvements
- cloud migration

Manual migrations are error-prone and hard to scale.

This project solves that by providing a **structured ETL pipeline** with validation and extensibility.

---

## Features (Current)

- MSSQL → PostgreSQL migration
- Modular ETL pipeline (Extract → Transform → Load)
- Batch processing
- Schema transformation
- Basic validation (row counts)
- Docker-based local setup

---

## Architecture

The system is built using a **pluggable adapter pattern**.

Source DB → Source Adapter → ETL Pipeline → Target Adapter → Target DB


- Core logic is database-agnostic
- Adapters handle DB-specific logic
- Easily extendable to other databases

See: `docs/architecture.md`

---

## Tech Stack

- Node.js
- MSSQL
- PostgreSQL
- Docker / Docker Compose

---

## Project Structure

`src/`
`core/` → Migration engine
`adapters/` → DB-specific logic
`migrations/` → Table-specific logic
`utils/` → Helpers and logging
`db/` → Connections and factories


---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd <dir>
```

### 2. Setup envirnoment
```bash
cp .env.example .env
```

### 3. Start databases
```bash
docker-compose up -d
```

### 4. Initialize schemas

Run SQL scripts:
```bash
scripts/mssql-init.sql
scripts/postgres-init.sql
```

### 5. Run migration

```bash
npm install
npm run start
```

### Example Flow

1. Connect to MSSQL
2. Fetch customer records
3. Transform schema and data
4. Insert into PostgreSQL
5. Validate results

### Design Highlights

Adapter-Based Architecture
- Decouples core logic from databases
- Easy to add new databases

Batch Processing
- Improves performance
- Reduces memory usage
- Supports large datasets

Modular Migrations

Each table has its own:
- migration config
- transformer
- validator

Future Enhancements
- Incremental migration
- Checkpoint recovery
- Multi-table support
- Multi-database support
- CLI interface
- Advanced validation
- Monitoring and metrics

```See: docs/roadmap.md```

### LICENSE

MIT