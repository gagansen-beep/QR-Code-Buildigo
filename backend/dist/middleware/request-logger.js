"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
exports.requestLogger = requestLogger;
const crypto_1 = require("crypto");
const logger_1 = require("./config/logger");
function requestIdMiddleware(req, _res, next) {
    req.id = (0, crypto_1.randomUUID)();
    next();
}
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.info({ method: req.method, url: req.url, status: res.statusCode, duration }, 'Request completed');
    });
    next();
}
//# sourceMappingURL=request-logger.js.map