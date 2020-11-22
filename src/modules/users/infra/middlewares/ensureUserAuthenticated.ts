import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import config from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
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
        const { sub } = verify(token, secret) as ITokenPayload;
        request.user = {
            id: sub,
        };

        return next();
    } catch (error) {
        throw new AppError('JWT token is invalid', 401);
    }
}
