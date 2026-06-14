import { Router } from 'express';
import mongoose from 'mongoose';
import { authRouter } from './auth.routes.js';
import { progressRouter } from './progress.routes.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getRecommendations } from '../controllers/progress.controller.js';
export const apiRouter = Router();
apiRouter.get('/health', (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const statesMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    const isHealthy = dbState === 1;
    res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'ok' : 'error',
        service: 'ecoquest-server',
        database: statesMap[dbState] ?? 'unknown',
    });
});
apiRouter.use('/auth', authRouter);
apiRouter.use('/progress', progressRouter);
apiRouter.get('/recommendations', authMiddleware, getRecommendations);
