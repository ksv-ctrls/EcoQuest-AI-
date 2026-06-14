import { UserModel } from '../models/User.js';
import { verifyToken } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { createHttpError } from '../utils/http-error.js';
export const authMiddleware = asyncHandler(async (req, _res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        throw createHttpError(401, 'Authentication token is required.');
    }
    const payload = verifyToken(token);
    const user = await UserModel.findById(payload.userId);
    if (!user) {
        throw createHttpError(401, 'Authenticated user no longer exists.');
    }
    req.user = {
        id: user.id,
        mongoId: user._id,
        email: user.email,
        name: user.name,
    };
    next();
});
