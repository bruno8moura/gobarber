import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('Update user avatar', () => {
    it('should be able to update avatar user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const newUser = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'newUser@mail.com',
            password: 'banana',
        });

        await updateUserAvatar.execute({
            userId: newUser.id,
            avartarFileName: 'avatar.jpg',
        });

        expect(newUser.avatar).toBe('avatar.jpg');
    });

    it('should be not able to update avatar from a user not found', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatar.execute({
                userId: 'non-exists-user',
                avartarFileName: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const newUser = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'newUser@mail.com',
            password: 'banana',
        });

        await updateUserAvatar.execute({
            userId: newUser.id,
            avartarFileName: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            userId: newUser.id,
            avartarFileName: 'avatar2.jpg',
        });

        expect(deleteFile).toBeCalledWith('avatar.jpg');

        expect(newUser.avatar).toBe('avatar2.jpg');
    });
});
