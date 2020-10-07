import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import IGetAppointmentDTO from '../dtos/IGetAppointmentDTO';

interface Request {
    date: Date;
    providerId: string;
}

@injectable()
export default class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({
        date,
        providerId,
    }: Request): Promise<IGetAppointmentDTO> {
        const repository = this.appointmentsRepository;
        const appointmentDate = startOfHour(date);

        const appointmentAlreadyRecorded = await repository.findByDate(
            appointmentDate,
        );

        const providerFound = await this.usersRepository.findById(providerId);

        if (!providerFound) {
            throw new AppError('Provider not found.');
        }

        if (appointmentAlreadyRecorded) {
            throw new AppError('This appointment is already booked.');
        }

        const newAppointment = await repository.create({
            providerId,
            date: appointmentDate,
        });

        return {
            id: newAppointment.id,
            date: newAppointment.date,
            provider: {
                id: providerFound.id,
                name: providerFound.name,
                email: providerFound.email,
            },
        };
    }
}
