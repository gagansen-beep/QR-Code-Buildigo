import fs from 'fs';
import path from 'path';
import { pool } from './connection';
import { logger } from '../config/logger';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await pool.query<{ name: string }>('SELECT name FROM _migrations ORDER BY id');
  return result.rows.map((r) => r.name);
}

async function runMigrations(): Promise<void> {
  logger.info('Starting database migrations...');

  await ensureMigrationsTable();
  const executed = await getExecutedMigrations();

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let migrated = 0;

  for (const file of files) {
    if (executed.includes(file)) {
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      migrated++;
      logger.info({ migration: file }, 'Migration executed successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error({ err: error, migration: file }, 'Migration failed');
      throw error;
    } finally {
      client.release();
    }
  }

  if (migrated === 0) {
    logger.info('No new migrations to run');
  } else {
    logger.info({ count: migrated }, 'Migrations completed');
  }
}

// Run if called directly (not when imported)
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error({ err }, 'Migration runner failed');
      process.exit(1);
    });
}

export { runMigrations };
