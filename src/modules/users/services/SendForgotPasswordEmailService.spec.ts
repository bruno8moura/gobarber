import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProviders/fakes/FakeMailProvider';
import IMailProvider from '@shared/container/providers/MailProviders/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

let fakeUsersRepository: IUsersRepository;
let fakeUserTokensRepository: IUserTokensRepository;
let fakeMailProvider: IMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const createdUser = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'jonhdoe@example.com',
        });

        await expect(sendMail).toHaveBeenCalled();
    });

    it('should be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'jonhdoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generated a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: user.email,
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
