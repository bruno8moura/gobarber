import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: IUsersRepository;
let fakeStorageProvider: IStorageProvider;

let updateUserAvatar: UpdateUserAvatarService;

describe('Update user avatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
    });
    it('should be able to update avatar user', async () => {
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
        expect(
            updateUserAvatar.execute({
                userId: 'non-exists-user',
                avartarFileName: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
