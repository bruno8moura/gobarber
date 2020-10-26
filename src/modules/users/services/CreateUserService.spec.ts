import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();

        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        const createdUser = await new CreateUserService(
            fakeUsersRepository,
        ).execute(newUser);

        expect(createdUser).toHaveProperty('id');
    });

    it('should not be able to create a new user with a same email from another', async () => {
        const fakeUsersRepository = new FakeUsersRepository();

        const newUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        const createdUser = await new CreateUserService(
            fakeUsersRepository,
        ).execute(newUser);

        const sameNewUser: ICreateUserDTO = {
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: 'admin123',
        };

        expect(
            new CreateUserService(fakeUsersRepository).execute(sameNewUser),
        ).rejects.toBeInstanceOf(AppError);
    });
});
