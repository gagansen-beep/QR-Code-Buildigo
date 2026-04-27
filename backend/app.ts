import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";

import { config } from "./middleware/config";
import {
  requestIdMiddleware,
  requestLogger,
} from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import { cardRoutes } from "./modules/cards/routes";
import { logger } from "./middleware/config/logger";

export function createApp(): express.Application {
  const app = express();

  // Required for Hostinger Passenger — reads correct client IP from X-Forwarded-For
  app.set("trust proxy", 1);

  // ─── Security ────────────────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          defaultSrc:  ["'self'"],
          scriptSrc:   ["'self'"],
          styleSrc:    ["'self'", "'unsafe-inline'", "https:"],
          // data: is required so <img src="data:image/png;base64,..."> (QR codes) render
          imgSrc:      ["'self'", "data:", "blob:", "https:"],
          fontSrc:     ["'self'", "https:", "data:"],
          connectSrc:  ["'self'", "https:"],
          objectSrc:   ["'none'"],
          baseUri:     ["'self'"],
          formAction:  ["'self'"],
        },
      },
    })
  );

  app.use(
    cors({
      origin: config.cors.origins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Request-ID"],
    })
  );

  // ─── Body / Compression ──────────────────────────────────────────────────────
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Logging / Request ID ────────────────────────────────────────────────────
  app.use(requestIdMiddleware);
  app.use(requestLogger);

  // ─── Uploaded Files ──────────────────────────────────────────────────────────
  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(process.cwd(), config.storage.basePath))
  );

  // ─── Rate Limiting ───────────────────────────────────────────────────────────
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many requests, please try again later" },
    })
  );

  // ─── Health Check ────────────────────────────────────────────────────────────
  app.get("/health", async (_req, res) => {
    const { healthCheck } = await import("./middleware/database/connection");
    const dbHealthy = await healthCheck();
    res.status(dbHealthy ? 200 : 503).json({
      status:    dbHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      service:   config.app.name,
      database:  dbHealthy ? "connected" : "disconnected",
    });
  });

  // ─── API Routes (must come before SPA fallback) ──────────────────────────────
  app.use(`${config.app.apiPrefix}/cards`, cardRoutes);

  // ─── Frontend + SPA Fallback ─────────────────────────────────────────────────
  // Resolve the first readable frontend path from the candidate list.
  // On Hostinger: set FRONTEND_PATH=/home/<user>/domains/<domain>/nodejs/public
  const frontendPath = resolveFrontendPath();

  if (frontendPath) {
    const indexHtml = path.join(frontendPath, "index.html");
    logger.info({ frontendPath, indexHtml }, "Serving frontend static files");

    // Serve JS/CSS/images with default caching.
    // index:false so every HTML request (including /) goes through the SPA fallback below.
    app.use(express.static(frontendPath, { index: false }));

    // SPA fallback ─ any GET that is not an API route or a real file gets index.html.
    // React Router then handles /card/:uuid, /admin, etc. on the client.
    app.get(/(.*)/, (_req, res) => {
      res.sendFile(indexHtml, (err) => {
        if (err) {
          logger.error({ err, indexHtml }, "SPA fallback: sendFile failed");
          if (!res.headersSent) {
            res.status(503).json({
              success: false,
              message:
                "Frontend unavailable. Check FRONTEND_PATH env var or server logs.",
            });
          }
        }
      });
    });
  } else {
    logger.warn("Frontend not found — set FRONTEND_PATH env var");
    app.get(/(.*)/, (_req, res) => {
      res.status(503).json({
        success: false,
        message:
          "Frontend not deployed. Set FRONTEND_PATH=/absolute/path/to/frontend/dist",
      });
    });
  }

  // ─── Global Error Handler ────────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}

/**
 * Walk candidate paths and return the first one whose index.html is readable
 * by the current process. Uses fs.accessSync (checks real read permission)
 * instead of existsSync (only checks inode existence, not permissions).
 */
function resolveFrontendPath(): string | null {
  const cwd = process.cwd();  // nodejs/          (Passenger app root)
  const dir = __dirname;      // nodejs/dist/     (compiled output dir)

  const candidates: string[] = [
    // 1. Explicit env override — set this in Hostinger → Node.js → Environment Variables
    //    FRONTEND_PATH=/home/<user>/domains/<domain>/nodejs/public
    process.env.FRONTEND_PATH ?? "",

    // 2. nodejs/public/  ← recommended: copy frontend/dist/* here before deploying
    path.join(cwd, "public"),

    // 3. nodejs/dist/../public = nodejs/public/  (same as 2, different resolution)
    path.join(dir, "..", "public"),

    // 4. nodejs/frontend/dist/  (alternative layout)
    path.join(cwd, "frontend", "dist"),

    // 5. nodejs/dist/../frontend/dist/
    path.join(dir, "..", "frontend", "dist"),

    // 6. Hostinger domain root public_html/ (only works if Passenger can read it)
    path.join(cwd, "..", "public_html"),
  ].filter(Boolean);

  logger.info({ cwd, dir }, "Resolving frontend path");

  for (const p of candidates) {
    const indexPath = path.join(p, "index.html");
    try {
      fs.accessSync(indexPath, fs.constants.R_OK);
      return p;
    } catch {
      // not readable — try next
    }
  }

  logger.warn({ candidates }, "No readable frontend/index.html found");
  return null;
}
