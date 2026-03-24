# Local Setup Guide

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+
- npm

---

## Step 1 — Environment

```bash
cp .env.example .env
```

No changes needed — defaults match the Docker setup below.

---

## Step 2 — Start Databases

```bash
docker-compose up -d
```

> **Note (Apple Silicon):** The MSSQL image runs via Rosetta emulation. The warning about `linux/amd64` platform is expected and harmless.

Wait ~20 seconds for MSSQL to fully initialize before proceeding.

Verify both containers are up:

```bash
docker ps
```

You should see `mssql-db` and `postgres-db` both with status `Up`.

---

## Step 3 — Initialize Schemas

Run once after first `docker-compose up` (or after wiping volumes):

**MSSQL** — creates and seeds the `Customers` table:
```bash
docker exec -i mssql-db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong!Pass123' -C -d master \
  < scripts/mssql-init.sql
```

**PostgreSQL** — creates the `customers` table:
```bash
docker exec -i postgres-db psql -U postgres -d migration_db \
  < scripts/postgres-init.sql
```

---

## Step 4 — Run Migration

```bash
npm install      # first time only
npm run dev      # runs with nodemon (auto-restarts on file changes)
# or
npm run start    # single run
```

---

## Resetting Everything

If you need a clean slate (e.g. wrong SA password, data issues):

```bash
docker-compose down -v   # stops containers AND removes volumes
docker-compose up -d
# wait ~20 seconds, then re-run Step 3
```

---

## Port Reference

| Service    | Host Port | Container Port |
|------------|-----------|----------------|
| MSSQL      | 1433      | 1433           |
| PostgreSQL | 5433      | 5432           |

> PostgreSQL is on **5433** (not the default 5432) to avoid conflicts with any locally installed Postgres.

---

## Troubleshooting

**`Invalid object name 'Customers'`**
→ MSSQL init script hasn't been run. Repeat Step 3.

**`role "postgres" does not exist`**
→ Node.js is connecting to a local Postgres instead of Docker.
Ensure `POSTGRES_PORT=5433` is set in `.env`.

**`Login failed for user 'sa'`**
→ The MSSQL volume has a stale password. Run `docker-compose down -v && docker-compose up -d`, wait 20 seconds, then re-run Step 3.

**MSSQL takes too long / connection refused**
→ Wait longer — MSSQL on Apple Silicon via emulation can take 30–40 seconds to be ready.
