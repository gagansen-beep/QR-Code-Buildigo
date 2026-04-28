import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";

import { config } from "./middleware/config";
import { logger } from "./middleware/config/logger";
import { requestIdMiddleware, requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import { cardRoutes } from "./modules/cards/routes";

export function createApp(): express.Application {
  const app = express();

  app.set("trust proxy", 1);

  // ─── Security ───
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  app.use(cors({
    origin: config.cors.origins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Request-ID"],
  }));

  // ─── Uploads (static images) ───
  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(process.cwd(), config.storage.basePath)),
  );

  // ─── Body Parsing & Middleware ───
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);
  app.use(requestLogger);

  // ─── Rate Limiting ───
  app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later" },
  }));

  // ─── Health Check ───
  app.get("/health", async (_req, res) => {
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

  // ─── SPA Frontend ───
  // On Hostinger: __dirname = /.../.builds/source/backend/dist
  // Going up 2 levels reaches /.../.builds/source → then frontend/dist
  // Override with FRONTEND_DIST_PATH env var if folder structure is different
  const frontendDist =
    process.env.FRONTEND_DIST_PATH ??
    path.join(__dirname, "..", "..", "frontend", "dist");

  const indexHtml = path.join(frontendDist, "index.html");

  logger.info({ frontendDist }, "Serving frontend static files from");

  // Serve Vite build assets (JS, CSS, images, etc.)
  app.use(express.static(frontendDist, { index: false }));

  // SPA fallback — every non-API GET request gets index.html
  // React reads window.location.pathname and renders the correct view
  app.use((_req, res, next) => {
    res.sendFile(indexHtml, (err) => {
      if (err) next(err);
    });
  });

  // ─── Error Handler ───
  app.use(errorHandler);

  return app;
}
