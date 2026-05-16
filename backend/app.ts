

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";

import { config } from "./middleware/config";
import { requestIdMiddleware, requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import { cardRoutes } from "./modules/cards/routes";

export function createApp(): express.Application {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  app.use(cors({
    origin: config.cors.origins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Request-ID"],
  }));

  app.use("/uploads",
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

  app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests" },
  }));

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

  // ─── Frontend ───
  const frontendDist = process.env.FRONTEND_DIST
    ?? "/home/u166243786/domains/qr.buildigo.org/public_html/.builds/source/frontend/dist";
  const indexHtml = path.join(frontendDist, "index.html");

  const indexExists = fs.existsSync(indexHtml);
  if (!indexExists) {
    console.warn(`[app] WARNING: index.html not found at ${indexHtml}`);
  }

  app.use(express.static(frontendDist));

  // SPA catch-all — must come after all API routes, before errorHandler
  app.get("*", (_req, res) => {
    if (indexExists) {
      res.sendFile(indexHtml);
    } else {
      // Never return JSON for frontend routes — always return HTML so React can load
      res.status(200).type("html").send(
        '<!DOCTYPE html><html><head><meta charset="utf-8">' +
        '<meta http-equiv="refresh" content="5;url=/"></head>' +
        "<body><p>Loading... if this persists, contact support.</p></body></html>"
      );
    }
  });

  app.use(errorHandler);

  return app;
}
