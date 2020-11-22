import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    userId: string;
    name: string;
    email: string;
    oldPassword?: string;
    newPassword?: string;
}
@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        userId,
        name,
        email,
        oldPassword,
        newPassword,
    }: IRequest): Promise<User | undefined> {
        const foundUser = await this.usersRepository.findById(userId);

        if (!foundUser) {
            throw new AppError('User not found.');
        }

        const foundUserByEmail = await this.usersRepository.findByEmail(email);
        if (foundUserByEmail && foundUserByEmail.id !== userId) {
            throw new AppError('Email already in use.');
        }

        foundUser.name = name;
        foundUser.email = email;

        if (newPassword && !oldPassword) {
            throw new AppError(
                'To change the current password, input the old password.',
            );
        }

        if (oldPassword && newPassword === '') {
            throw new AppError('The password cannot be empty.');
        }

        if (oldPassword && newPassword) {
            const isOldPasswordNotMatch = !(await this.hashProvider.compareHash(
                oldPassword,
                foundUser.password,
            ));

            if (isOldPasswordNotMatch) {
                throw new AppError('The old password is wrong.');
            }
            foundUser.password = newPassword;
        }

        return this.usersRepository.save(foundUser);
    }
}

export default UpdateProfileService;
