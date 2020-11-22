import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeHashProvider: IHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to create a new user', async () => {
        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        const createdUser = await createUserService.execute(newUser);

        expect(createdUser).toHaveProperty('id');
    });

    it('should not be able to create a new user with a same email from another', async () => {
        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        await createUserService.execute(newUser);

        const sameNewUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        await expect(
            createUserService.execute(sameNewUser),
        ).rejects.toBeInstanceOf(AppError);
    });
});
