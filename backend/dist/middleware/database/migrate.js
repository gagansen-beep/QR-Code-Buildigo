"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const connection_1 = require("./connection");
const logger_1 = require("../config/logger");
const MIGRATIONS_DIR = path_1.default.join(__dirname, 'migrations');
async function ensureMigrationsTable() {
    await connection_1.pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
async function getExecutedMigrations() {
    const result = await connection_1.pool.query('SELECT name FROM _migrations ORDER BY id');
    return result.rows.map((r) => r.name);
}
async function runMigrations() {
    logger_1.logger.info('Starting database migrations...');
    await ensureMigrationsTable();
    const executed = await getExecutedMigrations();
    const files = fs_1.default
        .readdirSync(MIGRATIONS_DIR)
        .filter((f) => f.endsWith('.sql'))
        .sort();
    let migrated = 0;
    for (const file of files) {
        if (executed.includes(file)) {
            continue;
        }
        const filePath = path_1.default.join(MIGRATIONS_DIR, file);
        const sql = fs_1.default.readFileSync(filePath, 'utf-8');
        const client = await connection_1.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
            await client.query('COMMIT');
            migrated++;
            logger_1.logger.info({ migration: file }, 'Migration executed successfully');
        }
        catch (error) {
            await client.query('ROLLBACK');
            logger_1.logger.error({ err: error, migration: file }, 'Migration failed');
            throw error;
        }
        finally {
            client.release();
        }
    }
    if (migrated === 0) {
        logger_1.logger.info('No new migrations to run');
    }
    else {
        logger_1.logger.info({ count: migrated }, 'Migrations completed');
    }
}
// Run if called directly
runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
    logger_1.logger.error({ err }, 'Migration runner failed');
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map