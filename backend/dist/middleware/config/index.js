"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
function optionalEnv(key, fallback) {
    return process.env[key] || fallback;
}
exports.config = {
    app: {
        env: optionalEnv('NODE_ENV', 'development'),
        port: parseInt(optionalEnv('PORT', '3005'), 10),
        apiPrefix: optionalEnv('API_PREFIX', '/api'),
        name: optionalEnv('APP_NAME', 'QRCode'),
    },
    db: {
        host: optionalEnv('DB_HOST', 'localhost'),
        port: parseInt(optionalEnv('DB_PORT', '5432'), 10),
        database: optionalEnv('DB_NAME', 'QRCode'),
        user: optionalEnv('DB_USER', 'postgres'),
        password: optionalEnv('DB_PASSWORD', ''),
        poolMin: parseInt(optionalEnv('DB_POOL_MIN', '2'), 10),
        poolMax: parseInt(optionalEnv('DB_POOL_MAX', '20'), 10),
        ssl: optionalEnv('DB_SSL', 'false') === 'true',
    },
    cors: {
        origins: optionalEnv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000,https://qr.buildigo.org').split(','),
    },
    rateLimit: {
        windowMs: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '60000'), 10),
        maxRequests: parseInt(optionalEnv('RATE_LIMIT_MAX_REQUESTS', '200'), 10),
    },
    storage: {
        basePath: optionalEnv('STORAGE_BASE_PATH', './uploads'),
        maxFileSizeMb: parseInt(optionalEnv('MAX_FILE_SIZE_MB', '10'), 10),
    },
    logging: {
        level: optionalEnv('LOG_LEVEL', 'info'),
    },
};
//# sourceMappingURL=index.js.map