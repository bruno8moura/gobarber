import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    userId: string;
    avartarFileName: string;
}
@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({ userId, avartarFileName }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError('User logged not found.', 401);
        }

        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const fileName = await this.storageProvider.saveFile(avartarFileName);
        user.avatar = fileName;

        const {
            name,
            avatar,
            password,
            email,
            id,
            createdAt,
            updatedAt,
        } = user;
        await this.usersRepository.save({
            name,
            avatar,
            password,
            email,
            id,
            createdAt,
            updatedAt,
        }); // update the user

        return user;
    }
}

export default UpdateUserAvatarService;
