import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';
export const notFoundHandler = (req, _res, next) => {
    next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
export const errorHandler = (error, _req, res, _next) => {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    res.status(statusCode).json({
        message,
        ...(env.nodeEnv === 'development' && error instanceof Error
            ? { stack: error.stack }
            : {}),
    });
};
