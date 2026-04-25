"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const logger_1 = require("./config/logger");
const service_1 = require("../modules/cards/service");
function notFoundHandler(req, res) {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}
function errorHandler(err, req, res, _next) {
    const statusCode = err instanceof service_1.AppError ? err.statusCode : (err.statusCode ?? err.status ?? 500);
    const isServerError = statusCode >= 500;
    if (isServerError) {
        logger_1.logger.error({ err, path: req.path, method: req.method }, 'Unhandled server error');
    }
    else {
        logger_1.logger.warn({ message: err.message, path: req.path, method: req.method }, 'Client error');
    }
    const body = {
        success: false,
        message: isServerError ? 'Internal server error' : err.message,
    };
    if (err.errors)
        body.errors = err.errors;
    res.status(statusCode).json(body);
}
//# sourceMappingURL=error-handler.js.map