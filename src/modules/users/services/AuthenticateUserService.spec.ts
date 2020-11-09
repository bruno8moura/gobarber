import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        await createUserService.execute(newUser);

        const userAuthenticated = await authenticateUser.execute({
            email: newUser.email,
            password: newUser.password,
        });

        expect(userAuthenticated).toHaveProperty('token');
    });

    it('should not be able to authenticate in order unknown email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        await createUserService.execute(newUser);

        const wrongEmail = 'anotherUserEmail@example.com';
        expect(
            authenticateUser.execute({
                email: wrongEmail,
                password: newUser.password,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate in order wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        await createUserService.execute(newUser);

        const wrongPass = 'banana';
        expect(
            authenticateUser.execute({
                email: newUser.email,
                password: wrongPass,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
