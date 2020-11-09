import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import config from '@config/auth';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IGetUserDTO from '../dtos/IGetUserDTO';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: IGetUserDTO;
    token: string;
}

@injectable()
export default class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const passwordMatch = await this.hashProvider.compareHash(
            password,
            user.password,
        );
        if (!passwordMatch) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const { secret, expiresIn } = config.jwt;
        const token = sign(
            {
                /* payload */
            },
            secret,
            {
                subject: user.id,
                expiresIn,
            },
        );

        return { user, token };
    }
}
