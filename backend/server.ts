import { config } from './middleware/config';
import { logger } from './middleware/config/logger';
import { createApp } from './app';
import { closePool } from './middleware/database/connection';
import { runMigrations } from './middleware/database/migrate';

async function main() {
  try {
    await runMigrations();
    logger.info('Database migrations completed');
  } catch (err) {
    logger.error({ err }, 'Migration failed — server will start anyway');
  }

  const app = createApp();

  const server = app.listen(config.app.port, '0.0.0.0', () => {
    logger.info({
      port: config.app.port,
      env: config.app.env,
      apiPrefix: config.app.apiPrefix,
    }, `🚀 ${config.app.name} server running on port ${config.app.port}`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal, starting graceful shutdown...');

    server.close(async () => {
      logger.info('HTTP server closed');
      await closePool();
      logger.info('Database pool closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error({ err: reason }, 'Unhandled rejection');
  });
  process.on('uncaughtException', (error: Error) => {
    logger.fatal({ err: error }, 'Uncaught exception - shutting down');
    process.exit(1);
  });
}

main();
