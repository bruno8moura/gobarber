import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeHashProvider: IHashProvider;
let createUserService: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to authenticate', async () => {
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
        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        await createUserService.execute(newUser);

        const wrongEmail = 'anotherUserEmail@example.com';
        await expect(
            authenticateUser.execute({
                email: wrongEmail,
                password: newUser.password,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate in order wrong password', async () => {
        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        await createUserService.execute(newUser);

        const wrongPass = 'banana';
        await expect(
            authenticateUser.execute({
                email: newUser.email,
                password: wrongPass,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
