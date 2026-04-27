// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import rateLimit from "express-rate-limit";
// import path from "path";

// import { config } from "./middleware/config";
// import {
//   requestIdMiddleware,
//   requestLogger,
// } from "./middleware/request-logger";
// import { errorHandler, notFoundHandler } from "./middleware/error-handler";
// import { cardRoutes } from "./modules/cards/routes";

// export function createApp(): express.Application {
//   const app = express();

//   // ─── Global Middleware ───
//   app.use(
//     helmet({
//       crossOriginResourcePolicy: { policy: "cross-origin" },
//     }),
//   );
//   app.use(
//     cors({
//       origin: config.cors.origins,
//       methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//       allowedHeaders: ["Content-Type", "X-Request-ID"],
//     }),
//   );

//   // Static uploads
//   app.use(
//     "/uploads",
//     (_req, res, next) => {
//       res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//       next();
//     },
//     express.static(path.join(process.cwd(), config.storage.basePath)),
//   );

//   app.use(compression());
//   app.use(express.json({ limit: "10mb" }));
//   app.use(express.urlencoded({ extended: true }));
//   app.use(requestIdMiddleware);
//   app.use(requestLogger);

//   // Rate limiting
//   const limiter = rateLimit({
//     windowMs: config.rateLimit.windowMs,
//     max: config.rateLimit.maxRequests,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: {
//       success: false,
//       message: "Too many requests, please try again later",
//     },
//   });
//   app.use(limiter);

//   // ─── Health Check ───
//   app.get("/health", async (_req, res) => {
//     const { healthCheck } = await import("./middleware/database/connection");
//     const dbHealthy = await healthCheck();
//     res.status(dbHealthy ? 200 : 503).json({
//       status: dbHealthy ? "healthy" : "unhealthy",
//       timestamp: new Date().toISOString(),
//       service: config.app.name,
//       database: dbHealthy ? "connected" : "disconnected",
//     });
//   });

//   // ─── Routes ───
//   const api = config.app.apiPrefix;
//   app.use(`${api}/cards`, cardRoutes);

 

// const frontendPath = path.join(__dirname, "frontend", "dist");
//   app.use(express.static(frontendPath));
//   app.get(/.*/, (_req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });


//   // ─── Error Handling ───
//   app.use(notFoundHandler);
//   app.use(errorHandler);

//   return app;
// }



// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import rateLimit from "express-rate-limit";
// import path from "path";

// import { config } from "./middleware/config";
// import {
//   requestIdMiddleware,
//   requestLogger,
// } from "./middleware/request-logger";
// import { errorHandler, notFoundHandler } from "./middleware/error-handler";
// import { cardRoutes } from "./modules/cards/routes";

// export function createApp(): express.Application {
//   const app = express();

//   // ─── Global Middleware ───
//   app.use(
//     helmet({
//       crossOriginResourcePolicy: { policy: "cross-origin" },
//     }),
//   );
//   app.use(
//     cors({
//       origin: config.cors.origins,
//       methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//       allowedHeaders: ["Content-Type", "X-Request-ID"],
//     }),
//   );

//   // Static uploads
//   app.use(
//     "/uploads",
//     (_req, res, next) => {
//       res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//       next();
//     },
//     express.static(path.join(process.cwd(), config.storage.basePath)),
//   );

//   app.use(compression());
//   app.use(express.json({ limit: "10mb" }));
//   app.use(express.urlencoded({ extended: true }));
//   app.use(requestIdMiddleware);
//   app.use(requestLogger);

//   // Rate limiting
//   const limiter = rateLimit({
//     windowMs: config.rateLimit.windowMs,
//     max: config.rateLimit.maxRequests,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: {
//       success: false,
//       message: "Too many requests, please try again later",
//     },
//   });
//   app.use(limiter);

//   // ─── Health Check ───
//   app.get("/health", async (_req, res) => {
//     const { healthCheck } = await import("./middleware/database/connection");
//     const dbHealthy = await healthCheck();
//     res.status(dbHealthy ? 200 : 503).json({
//       status: dbHealthy ? "healthy" : "unhealthy",
//       timestamp: new Date().toISOString(),
//       service: config.app.name,
//       database: dbHealthy ? "connected" : "disconnected",
//     });
//   });

//   // ─── Routes ───
//   const api = config.app.apiPrefix;
//   app.use(`${api}/cards`, cardRoutes);

//   // ─── Frontend Static Files ───
//   // __dirname = backend/dist/ on Hostinger
//   // frontend/dist is placed inside backend/dist/frontend/dist/
//   const frontendPath = path.join(__dirname, "frontend", "dist");

//   app.use(express.static(frontendPath));
//   app.get(/.*/, (_req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });

//   // ─── Error Handling ───
//   app.use(notFoundHandler);
//   app.use(errorHandler);

//   return app;
// }



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

  // ─── Frontend Static Files ───
  // Passenger AppRoot = nodejs/  →  __dirname = nodejs/dist/  →  process.cwd() = nodejs/
  // Check candidates in priority order so it works on Hostinger, Docker, and local dev.
  const frontendCandidates = [
    // 1. Explicit env override (set this in Hostinger Node.js → Environment Variables)
    process.env.FRONTEND_PATH,
    // 2. RECOMMENDED on Hostinger: put frontend dist/ contents into nodejs/public/
    path.join(__dirname, '..', 'public'),
    // 3. nodejs/frontend/dist/  (alternative Hostinger placement)
    path.join(__dirname, '..', 'frontend', 'dist'),
    // 4. Hostinger web root public_html/ (if Apache also serves frontend there)
    path.join(process.cwd(), '..', 'public_html'),
    // 5. Legacy hardcoded Hostinger path
    '/home/u166243786/domains/qr.buildigo.org/public_html/.builds/source/frontend/dist',
    // 6. Docker: frontend built into backend container at ./public
    path.join(process.cwd(), 'public'),
  ].filter(Boolean) as string[];

  const frontendPath = frontendCandidates.find(
    (p) => fs.existsSync(path.join(p, 'index.html'))
  ) ?? null;

  if (frontendPath) {
    logger.info({ frontendPath }, 'Serving frontend from path');
    app.use(express.static(frontendPath));

    // SPA fallback — all non-API routes serve index.html
    // Express 5 requires regex wildcard, not bare '*'
    app.get(/(.*)/, (_req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    logger.warn(
      { checked: frontendCandidates },
      'Frontend not found — set FRONTEND_PATH env var or deploy frontend dist'
    );
    app.get(/(.*)/, (_req, res) => {
      res.status(503).json({
        success: false,
        message: 'Frontend not deployed. Set FRONTEND_PATH env var.',
      });
    });
  }

  // ─── Error Handling ───
  app.use(errorHandler);

  return app;
}