
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";

import { config } from "./middleware/config";
import {
  requestIdMiddleware,
  requestLogger,
} from "./middleware/request-logger";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { cardRoutes } from "./modules/cards/routes";

export function createApp(): express.Application {
  const app = express();

  // ─── Trust Proxy (Hostinger ke liye ZAROORI) ───
  app.set("trust proxy", 1);

  // ─── Global Middleware ───
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin: config.cors.origins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Request-ID"],
    })
  );

  // Static uploads
  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(process.cwd(), config.storage.basePath))
  );

  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);
  app.use(requestLogger);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later",
    },
  });

  app.use(limiter);

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



  // ─────────────────────────────────────────────
  // FRONTEND SERVE (HOSTINGER)
  // ─────────────────────────────────────────────
  // const frontendPath = path.join(
  //   process.cwd(),
  //   "..",
  //   "public_html",
  //   ".builds",
  //   "source",
  //   "frontend",
  //   "dist"
  // );

  // app.use(express.static(frontendPath));
  // app.get(/(.*)/, (_req, res) => {
  //   res.sendFile(path.join(frontendPath, "index.html"));
  // });
  
// ─── API Routes ───
const api = config.app.apiPrefix;
app.use(`${api}/cards`, cardRoutes);

// ─── Frontend ───
// __dirname = backend/dist/ after tsc build
// frontend/dist is at ../../frontend/dist relative to __dirname
const frontendPath = process.env.FRONTEND_DIST_PATH ||
  path.resolve(__dirname, '..', '..', 'frontend', 'dist');

console.log('[app] Serving frontend from:', frontendPath);

app.use(express.static(frontendPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      console.error('[app] Failed to serve index.html from:', frontendPath, err);
      res.status(404).json({ success: false, message: 'Frontend not found. Run npm run build.' });
    }
  });
});

// ─── Error Handling ───
app.use(errorHandler);

  return app;
}