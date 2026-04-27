"use strict";
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./middleware/config");
const request_logger_1 = require("./middleware/request-logger");
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = require("./modules/cards/routes");
const logger_1 = require("./middleware/config/logger");
function createApp() {
    const app = (0, express_1.default)();
    // Required for Hostinger Passenger — reads correct client IP from X-Forwarded-For
    app.set("trust proxy", 1);
    // ─── Security ────────────────────────────────────────────────────────────────
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https:"],
                // data: is required so <img src="data:image/png;base64,..."> (QR codes) render
                imgSrc: ["'self'", "data:", "blob:", "https:"],
                fontSrc: ["'self'", "https:", "data:"],
                connectSrc: ["'self'", "https:"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
            },
        },
    }));
    app.use((0, cors_1.default)({
        origin: config_1.config.cors.origins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Request-ID"],
    }));
    // ─── Body / Compression ──────────────────────────────────────────────────────
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // ─── Logging / Request ID ────────────────────────────────────────────────────
    app.use(request_logger_1.requestIdMiddleware);
    app.use(request_logger_1.requestLogger);
    // ─── Uploaded Files ──────────────────────────────────────────────────────────
    app.use("/uploads", (_req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    }, express_1.default.static(path_1.default.join(process.cwd(), config_1.config.storage.basePath)));
    // ─── Rate Limiting ───────────────────────────────────────────────────────────
    app.use((0, express_rate_limit_1.default)({
        windowMs: config_1.config.rateLimit.windowMs,
        max: config_1.config.rateLimit.maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: "Too many requests, please try again later" },
    }));
    // ─── Health Check ────────────────────────────────────────────────────────────
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
    // ─── API Routes (must come before SPA fallback) ──────────────────────────────
    app.use(`${config_1.config.app.apiPrefix}/cards`, routes_1.cardRoutes);
    // ─── Frontend + SPA Fallback ─────────────────────────────────────────────────
    // Resolve the first readable frontend path from the candidate list.
    // On Hostinger: set FRONTEND_PATH=/home/<user>/domains/<domain>/nodejs/public
    const frontendPath = resolveFrontendPath();
    if (frontendPath) {
        const indexHtml = path_1.default.join(frontendPath, "index.html");
        logger_1.logger.info({ frontendPath, indexHtml }, "Serving frontend static files");
        // Serve JS/CSS/images with default caching.
        // index:false so every HTML request (including /) goes through the SPA fallback below.
        app.use(express_1.default.static(frontendPath, { index: false }));
        // SPA fallback ─ any GET that is not an API route or a real file gets index.html.
        // React Router then handles /card/:uuid, /admin, etc. on the client.
        app.get(/(.*)/, (_req, res) => {
            res.sendFile(indexHtml, (err) => {
                if (err) {
                    logger_1.logger.error({ err, indexHtml }, "SPA fallback: sendFile failed");
                    if (!res.headersSent) {
                        res.status(503).json({
                            success: false,
                            message: "Frontend unavailable. Check FRONTEND_PATH env var or server logs.",
                        });
                    }
                }
            });
        });
    }
    else {
        logger_1.logger.warn("Frontend not found — set FRONTEND_PATH env var");
        app.get(/(.*)/, (_req, res) => {
            res.status(503).json({
                success: false,
                message: "Frontend not deployed. Set FRONTEND_PATH=/absolute/path/to/frontend/dist",
            });
        });
    }
    // ─── Global Error Handler ────────────────────────────────────────────────────
    app.use(error_handler_1.errorHandler);
    return app;
}
/**
 * Walk candidate paths and return the first one whose index.html is readable
 * by the current process. Uses fs.accessSync (checks real read permission)
 * instead of existsSync (only checks inode existence, not permissions).
 */
function resolveFrontendPath() {
    const cwd = process.cwd(); // nodejs/          (Passenger app root)
    const dir = __dirname; // nodejs/dist/     (compiled output dir)
    const candidates = [
        // 1. Explicit env override — set this in Hostinger → Node.js → Environment Variables
        //    FRONTEND_PATH=/home/<user>/domains/<domain>/nodejs/public
        process.env.FRONTEND_PATH ?? "",
        // 2. nodejs/public/  ← recommended: copy frontend/dist/* here before deploying
        path_1.default.join(cwd, "public"),
        // 3. nodejs/dist/../public = nodejs/public/  (same as 2, different resolution)
        path_1.default.join(dir, "..", "public"),
        // 4. nodejs/frontend/dist/  (alternative layout)
        path_1.default.join(cwd, "frontend", "dist"),
        // 5. nodejs/dist/../frontend/dist/
        path_1.default.join(dir, "..", "frontend", "dist"),
        // 6. Hostinger domain root public_html/ (only works if Passenger can read it)
        path_1.default.join(cwd, "..", "public_html"),
    ].filter(Boolean);
    logger_1.logger.info({ cwd, dir }, "Resolving frontend path");
    for (const p of candidates) {
        const indexPath = path_1.default.join(p, "index.html");
        try {
            fs_1.default.accessSync(indexPath, fs_1.default.constants.R_OK);
            return p;
        }
        catch {
            // not readable — try next
        }
    }
    logger_1.logger.warn({ candidates }, "No readable frontend/index.html found");
    return null;
}
//# sourceMappingURL=app.js.map