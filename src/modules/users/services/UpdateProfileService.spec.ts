import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: IHashProvider;
let fakeUsersRepository: IUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const novoNome = 'John Trê';
        const novoEmail = 'johntre@example.com';

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: novoNome,
            email: novoEmail,
        });

        expect(updatedUser?.name).toBe(novoNome);
        expect(updatedUser?.email).toBe(novoEmail);
    });

    it('should not be able to update the email to an email already used', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const newUser = await fakeUsersRepository.create({
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                userId: newUser.id,
                name: newUser.name,
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const novoNome = 'John Trê';
        const novoEmail = 'johntre@example.com';
        const novoPassword = '123123';

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: novoNome,
            email: novoEmail,
            oldPassword: '123456',
            newPassword: novoPassword,
        });

        expect(updatedUser?.password).toBe(novoPassword);
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const novoNome = 'John Trê';
        const novoEmail = 'johntre@example.com';
        const novoPassword = '123123';

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: novoNome,
                email: novoEmail,
                newPassword: novoPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const novoNome = 'John Trê';
        const novoEmail = 'johntre@example.com';
        const novoPassword = '123123';

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: novoNome,
                email: novoEmail,
                oldPassword: '123451111',
                newPassword: novoPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with an empty new password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const novoNome = 'John Trê';
        const novoEmail = 'johntre@example.com';
        const novoPassword = '';

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: novoNome,
                email: novoEmail,
                oldPassword: '123456',
                newPassword: novoPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
