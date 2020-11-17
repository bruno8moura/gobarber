import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProviders/fakes/FakeMailProvider';

describe('SendForgotPasswordEmail', () => {
    it('should be able to recover the password using the email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();
        const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
        );

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const createdUser = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'jonhdoe@example.com',
            password: '123456',
        });

        sendForgotPasswordEmailService.execute({
            email: 'jonhdoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });
});
