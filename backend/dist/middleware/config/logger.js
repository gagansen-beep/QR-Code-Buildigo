"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const config_1 = require("../config");
exports.logger = (0, pino_1.default)({
    level: config_1.config.logging.level,
    transport: config_1.config.app.env === 'development'
        ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
        : undefined,
    base: { service: config_1.config.app.name, env: config_1.config.app.env },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    serializers: {
        err: pino_1.default.stdSerializers.err,
        req: (req) => ({
            method: req.method,
            url: req.url,
            id: req.id,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
    },
});
//# sourceMappingURL=logger.js.map