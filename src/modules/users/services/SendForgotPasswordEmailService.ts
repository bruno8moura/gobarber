// import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProviders/models/IMailProvider';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
// import IGetUserDTO from '../dtos/IGetUserDTO';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        this.mailProvider.sendMail(email, 'Recupera a senha!');
    }
}

export default SendForgotPasswordEmailService;
