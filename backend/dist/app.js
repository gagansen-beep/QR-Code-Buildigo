"use strict";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import rateLimit from "express-rate-limit";
// import path from "path";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./middleware/config");
const request_logger_1 = require("./middleware/request-logger");
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = require("./modules/cards/routes");
function createApp() {
    const app = (0, express_1.default)();
    // ─── Trust Proxy (Hostinger ke liye ZAROORI) ───
    app.set("trust proxy", 1);
    // ─── Global Middleware ───
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    app.use((0, cors_1.default)({
        origin: config_1.config.cors.origins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Request-ID"],
    }));
    // Static uploads
    app.use("/uploads", (_req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    }, express_1.default.static(path_1.default.join(process.cwd(), config_1.config.storage.basePath)));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(request_logger_1.requestIdMiddleware);
    app.use(request_logger_1.requestLogger);
    // Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: config_1.config.rateLimit.windowMs,
        max: config_1.config.rateLimit.maxRequests,
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
        const { healthCheck } = await Promise.resolve().then(() => __importStar(require("./middleware/database/connection")));
        const dbHealthy = await healthCheck();
        res.status(dbHealthy ? 200 : 503).json({
            status: dbHealthy ? "healthy" : "unhealthy",
            timestamp: new Date().toISOString(),
            service: config_1.config.app.name,
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
    const api = config_1.config.app.apiPrefix;
    app.use(`${api}/cards`, routes_1.cardRoutes);
    // ─── Frontend Static Files ───
    // FRONTEND_PATH env var se set karo, ya Hostinger default use karo
    const frontendPath = process.env.FRONTEND_PATH ||
        '/home/u166243786/domains/qr.buildigo.org/public_html/.builds/source/frontend/dist';
    const fs = require('fs');
    const frontendExists = fs.existsSync(frontendPath);
    if (frontendExists) {
        app.use(express_1.default.static(frontendPath));
        // SPA fallback — all non-API routes serve index.html (Express 5 requires regex, not '*')
        app.get(/(.*)/, (_req, res) => {
            res.sendFile(path_1.default.join(frontendPath, 'index.html'));
        });
    }
    else {
        // Frontend not deployed here — API-only mode
        app.get(/(.*)/, (_req, res) => {
            res.status(404).json({
                success: false,
                message: 'Frontend not found. Set FRONTEND_PATH or deploy frontend to the correct path.',
            });
        });
    }
    // ─── Error Handling ───
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map