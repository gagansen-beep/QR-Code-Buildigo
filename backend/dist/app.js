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
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    app.use((0, cors_1.default)({
        origin: config_1.config.cors.origins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-Request-ID"],
    }));
    app.use("/uploads", (_req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    }, express_1.default.static(path_1.default.join(process.cwd(), config_1.config.storage.basePath)));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(request_logger_1.requestIdMiddleware);
    app.use(request_logger_1.requestLogger);
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
    const api = config_1.config.app.apiPrefix;
    app.use(`${api}/cards`, routes_1.cardRoutes);
    const frontendPath = process.env.FRONTEND_PATH ||
        "/home/u166243786/domains/qr.buildigo.org/public_html/.builds/source/frontend/dist";
    if (fs_1.default.existsSync(frontendPath)) {
        app.use(express_1.default.static(frontendPath));
        app.get(/(.*)/, (_req, res) => {
            res.sendFile(path_1.default.join(frontendPath, "index.html"));
        });
    }
    else {
        app.get(/(.*)/, (_req, res) => {
            res.status(404).json({
                success: false,
                message: "Frontend not found. Set FRONTEND_PATH env var to the absolute path of your frontend dist/.",
            });
        });
    }
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map