import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createHttpError } from '../utils/http-error.js';
import { UserModel } from '../models/User.js';
const SALT_ROUNDS = 12;
const TOKEN_EXPIRES_IN = '7d';
function signToken(user) {
    const payload = { userId: user.id };
    return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRES_IN });
}
export function toAuthResponse(user) {
    return {
        token: signToken(user),
        user: user.toJSON(),
    };
}
export async function registerUser(input) {
    const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (existing) {
        throw createHttpError(409, 'An account with this email already exists.');
    }
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await UserModel.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        profile: input.profile ?? {},
    });
    return toAuthResponse(user);
}
export async function loginUser(input) {
    const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select('+password');
    if (!user) {
        throw createHttpError(401, 'Invalid email or password.');
    }
    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
        throw createHttpError(401, 'Invalid email or password.');
    }
    return toAuthResponse(user);
}
export function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
}
