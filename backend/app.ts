<<<<<<< HEAD
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


=======
>>>>>>> 9afc19a25287bc16ba8734d8df2f8cb4de05592e
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

<<<<<<< HEAD
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
=======
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
>>>>>>> 9afc19a25287bc16ba8734d8df2f8cb4de05592e

  app.use(cors({
    origin: config.cors.origins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Request-ID"],
  }));

<<<<<<< HEAD
  app.use("/uploads",
=======
  app.use(
    "/uploads",
>>>>>>> 9afc19a25287bc16ba8734d8df2f8cb4de05592e
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

<<<<<<< HEAD
  app.use(rateLimit({
=======
  const limiter = rateLimit({
>>>>>>> 9afc19a25287bc16ba8734d8df2f8cb4de05592e
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
<<<<<<< HEAD
    message: { success: false, message: "Too many requests" },
  }));
=======
    message: {
      success: false,
      message: "Too many requests, please try again later",
    },
  });
  app.use(limiter);
>>>>>>> 9afc19a25287bc16ba8734d8df2f8cb4de05592e

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

<<<<<<< HEAD
  // ─── API Routes ───
  const api = config.app.apiPrefix;
  app.use(`${api}/cards`, cardRoutes);

  // ─── Frontend ───
  const frontendPath = "/home/u166243786/domains/qr.buildigo.org/public_html/.builds/source/frontend/dist";
  app.use(express.static(frontendPath));
  app.use((_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

=======
  const api = config.app.apiPrefix;
  app.use(`${api}/cards`, cardRoutes);

  const frontendPath =
    process.env.FRONTEND_PATH ||
    "/home/u166243786/domains/qr.buildigo.org/public_html/.builds/source/frontend/dist";

  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get(/(.*)/, (_req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    app.get(/(.*)/, (_req, res) => {
      res.status(404).json({
        success: false,
        message: "Frontend not found. Set FRONTEND_PATH env var to the absolute path of your frontend dist/.",
      });
    });
  }

>>>>>>> 9afc19a25287bc16ba8734d8df2f8cb4de05592e
  app.use(errorHandler);

  return app;
}
