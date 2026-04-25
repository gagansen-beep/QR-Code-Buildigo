"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./middleware/config");
const logger_1 = require("./middleware/config/logger");
const app_1 = require("./app");
const connection_1 = require("./middleware/database/connection");
const app = (0, app_1.createApp)();
const server = app.listen(config_1.config.app.port, "0.0.0.0", () => {
    logger_1.logger.info({
        port: config_1.config.app.port,
        env: config_1.config.app.env,
        apiPrefix: config_1.config.app.apiPrefix,
    }, `🚀 ${config_1.config.app.name} server running on port ${config_1.config.app.port}`);
});
// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger_1.logger.info({ signal }, 'Received shutdown signal, starting graceful shutdown...');
    server.close(async () => {
        logger_1.logger.info('HTTP server closed');
        await (0, connection_1.closePool)();
        logger_1.logger.info('Database pool closed');
        process.exit(0);
    });
    // Force exit after 30 seconds
    setTimeout(() => {
        logger_1.logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 30000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error({ err: reason }, 'Unhandled rejection');
});
process.on('uncaughtException', (error) => {
    logger_1.logger.fatal({ err: error }, 'Uncaught exception - shutting down');
    process.exit(1);
});
//# sourceMappingURL=server.js.map