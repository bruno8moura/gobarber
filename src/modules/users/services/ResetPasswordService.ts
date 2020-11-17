import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
    token: string;
    newPassword: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, newPassword }: IRequest): Promise<void> {
        const foundUserToken = await this.userTokensRepository.findByToken(
            token,
        );

        if (!foundUserToken) {
            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(foundUserToken.userId);

        if (!user) {
            throw new AppError('User does not exists');
        }

        const tokenCreatedAt = foundUserToken.createdAt;

        if (differenceInHours(new Date(Date.now()), tokenCreatedAt) > 2) {
            throw new AppError('Token expired');
        }

        user.password = await this.hashProvider.generateHash(newPassword);

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
