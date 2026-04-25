import { Request, Response, NextFunction } from 'express';
export declare function notFoundHandler(req: Request, res: Response): void;
export declare function errorHandler(err: Error & {
    statusCode?: number;
    status?: number;
    errors?: Record<string, string>;
}, req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error-handler.d.ts.map