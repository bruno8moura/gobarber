import nodemailer, { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        nodemailer.createTestAccount().then(account => {
            this.client = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
        });
    }

    public async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const message: MailOptions = {
            from: {
                name: from?.nome || 'Equipe GoBarber',
                address: from?.email || 'equipe@gobarber.com.br',
            },
            to: {
                name: to.nome,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        };

        this.client.sendMail(message, (err, info): void => {
            if (err) {
                console.log(`SEND EMAIL - Error occurred. ${err.message}`);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);

            // Preview only available when sending through an Ethereal account
            return console.log(
                'Preview URL: %s',
                nodemailer.getTestMessageUrl(info),
            );
        });
    }
}
