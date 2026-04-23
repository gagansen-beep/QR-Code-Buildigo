import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from './config/logger';

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  (req as Request & { id: string }).id = randomUUID();
  next();
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      { method: req.method, url: req.url, status: res.statusCode, duration },
      'Request completed',
    );
  });
  next();
}
