import { Request, Response, NextFunction } from 'express';
import { logger } from './config/logger';
import { AppError } from '../modules/cards/service';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}

export function errorHandler(
  err: Error & { statusCode?: number; status?: number; errors?: Record<string, string> },
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : (err.statusCode ?? err.status ?? 500);
  const isServerError = statusCode >= 500;

  if (isServerError) {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled server error');
  } else {
    logger.warn({ message: err.message, path: req.path, method: req.method }, 'Client error');
  }

  const body: Record<string, unknown> = {
    success: false,
    message: isServerError ? 'Internal server error' : err.message,
  };

  if (err.errors) body.errors = err.errors;

  res.status(statusCode).json(body);
}
