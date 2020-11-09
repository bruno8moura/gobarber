import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('Update user avatar', () => {
    it('should be able to create a new user', async () => {
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
});
