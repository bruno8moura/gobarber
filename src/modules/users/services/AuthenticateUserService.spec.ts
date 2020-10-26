import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUserService = new CreateUserService(fakeUsersRepository);
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
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
});
