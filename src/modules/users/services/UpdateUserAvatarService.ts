import { getRepository } from 'typeorm';
import path from 'path';
import { promises as fs } from 'fs'; // Enable the use of promises intead callbacks, so we use await.
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload.files';
import AppError from '@shared/errors/AppError';

interface Request {
    userId: string;
    avartarFileName: string;
}
class UpdateUserAvatarService {
    public async execute({ userId, avartarFileName }: Request): Promise<User> {
        const repository = getRepository(User);
        const user = await repository.findOne({ where: { id: userId } });

        if (!user) {
            throw new AppError('User logged not found.', 401);
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarFileExists = await fs.stat(userAvatarFilePath);

            if (userAvatarFileExists) {
                await fs.unlink(userAvatarFilePath); // delete a file
            }
        }

        user.avatar = avartarFileName;

        await repository.save(user); // update the user

        return user;
    }
}

export default UpdateUserAvatarService;
