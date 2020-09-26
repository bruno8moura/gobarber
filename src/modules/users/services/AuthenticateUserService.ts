import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import config from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
export default class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const passwordMatch = await compare(password, user.password);
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

        const Iresponse = { user, token };
        return Iresponse;
    }
}
