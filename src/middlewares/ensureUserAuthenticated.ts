import { Request, Response, NextFunction, response } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureUserAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
    }

    const { secret } = config.jwt;

    const [, token] = authHeader.split(' ');

    try {
        const { sub } = verify(token, secret) as TokenPayload;
        request.user = {
            id: sub,
        };

        return next();
    } catch (error) {
        throw new AppError('JWT token is invalid', 401);
    }
}
