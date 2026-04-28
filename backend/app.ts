import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";

import { config } from "./middleware/config";
import { requestIdMiddleware, requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import { cardRoutes } from "./modules/cards/routes";

export function createApp(): express.Application {
  const app = express();

  app.set("trust proxy", 1);

  // ─── Security ───
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  app.use(
    cors({
      origin: config.cors.origins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Request-ID"],
      credentials: true,
    }),
  );

  // ─── Static Uploads ───
  app.use(
    "/uploads",
    (_req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(process.cwd(), config.storage.basePath)),
  );

  // ─── Middleware ───
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);
  app.use(requestLogger);

  // ─── Rate Limiting ───
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many requests, please try again later" },
    }),
  );

  // ─── Health Check ───
  app.get("/health", async (_req: Request, res: Response) => {
    const { healthCheck } = await import("./middleware/database/connection");
    const dbHealthy = await healthCheck();
    res.status(dbHealthy ? 200 : 503).json({
      status: dbHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      service: config.app.name,
      database: dbHealthy ? "connected" : "disconnected",
    });
  });

  // ─── API Routes ───
  const api = config.app.apiPrefix;
  app.use(`${api}/cards`, cardRoutes);

  // ─── SPA Frontend Serving ───
  const frontendPath =
    "/home/u166243786/domains/qr.buildigo.org/public_html/.builds/source/frontend/dist";
  const indexHtml = path.join(frontendPath, "index.html");

  // Serve static assets (JS, CSS, images)
  app.use(express.static(frontendPath, { index: false }));

  // All remaining routes → serve index.html (React handles routing in browser)
  app.get("*", (_req: Request, res: Response, next: NextFunction) => {
    res.sendFile(indexHtml, (err) => {
      if (err) next(err);
    });
  });

  // ─── Error Handler ───
  app.use(errorHandler);

  return app;
}
