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
    }),
  );
  app.use(
    cors({
      origin: config.cors.origins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Request-ID"],
    }),
  );

  // Static uploads
  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(process.cwd(), config.storage.basePath)),
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

  // ─── Routes ───
  const api = config.app.apiPrefix;
  app.use(`${api}/cards`, cardRoutes);

  // ─── Frontend Static Files ───
  const frontendPath = path.join(
    process.cwd(),
    "..",
    "public_html",
    "qr-code-Build",
    "frontend",
    "dist"
  );

  app.use(express.static(frontendPath));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  // ─── Error Handling ───
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}