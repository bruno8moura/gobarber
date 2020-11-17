import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: IUsersRepository;
let fakeUserTokensRepository: IUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const newPassword = '123123';
        await resetPasswordService.execute({
            token,
            newPassword,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith(newPassword);
        expect(updatedUser?.password).toBe(newPassword);
    });
    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                newPassword: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-token',
        );

        await expect(
            resetPasswordService.execute({
                token,
                newPassword: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than two hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: '123456',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        // avança a hora atual em 3 horas, de forma que o token fica expirado
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const horasAFrente = 3;
            const customDate = new Date();
            customDate.setTime(
                customDate.getTime() + horasAFrente * 60 * 60 * 1000,
            );

            return customDate.getTime();
        });

        const newPassword = '123123';
        await expect(
            resetPasswordService.execute({
                token: userToken.token,
                newPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
