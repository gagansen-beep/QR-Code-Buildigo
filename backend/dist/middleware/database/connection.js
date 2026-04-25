"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
exports.getClient = getClient;
exports.transaction = transaction;
exports.healthCheck = healthCheck;
exports.closePool = closePool;
const pg_1 = require("pg");
const config_1 = require("../config");
const logger_1 = require("../config/logger");
const pool = new pg_1.Pool({
    host: config_1.config.db.host,
    port: config_1.config.db.port,
    database: config_1.config.db.database,
    user: config_1.config.db.user,
    password: config_1.config.db.password,
    min: config_1.config.db.poolMin,
    max: config_1.config.db.poolMax,
    ssl: config_1.config.db.ssl ? { rejectUnauthorized: false } : false,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});
exports.pool = pool;
pool.on('error', (err) => {
    logger_1.logger.error({ err }, 'Unexpected error on idle database client');
});
pool.on('connect', () => {
    logger_1.logger.debug('New database client connected');
});
async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        logger_1.logger.debug({ query: text.substring(0, 100), duration, rows: result.rowCount }, 'Executed query');
        return result;
    }
    catch (error) {
        logger_1.logger.error({ err: error, query: text.substring(0, 200) }, 'Query error');
        throw error;
    }
}
async function getClient() {
    return pool.connect();
}
async function transaction(callback) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
}
async function healthCheck() {
    try {
        await pool.query('SELECT 1');
        return true;
    }
    catch {
        return false;
    }
}
async function closePool() {
    await pool.end();
    logger_1.logger.info('Database pool closed');
}
//# sourceMappingURL=connection.js.map