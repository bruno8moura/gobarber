import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor() {
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

    public async sendMail(to: string, body: string): Promise<void> {
        const message = {
            from: 'Equipe GoBarber - <equipe@gobarber.com.br>',
            to,
            subject: 'Recuperação de senha',
            text: body,
            html: `<p>${body}</p>`,
        };

        this.client.sendMail(message, (err, info) => {
            if (err) {
                console.log(`SEND EMAIL - Error occurred. ${err.message}`);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    }
}
