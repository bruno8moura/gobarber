import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import uploadConfig from '@config/upload.files';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    console.log(err);

    if (err instanceof AppError) {
        return response
            .status(err.statusCode)
            .json({
                status: 'client.error',
                message: err.message,
            })
            .end();
    }

    return response
        .status(500)
        .json({
            status: 'server.error',
            message: 'Internal Server Error',
        })
        .end();
});
app.listen(3333, () => {
    console.log('🚀 >>> Server Start on port 3333 >>> 🚀');
});
