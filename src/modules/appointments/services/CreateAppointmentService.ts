import { startOfHour } from 'date-fns';
import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import IGetAppointmentDTO from '../dtos/IGetAppointmentDTO';

interface Request {
    date: Date;
    providerId: string;
}

export default class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepository){}

    public async execute({ date, providerId }: Request): Promise<IGetAppointmentDTO> {
        const repository = this.appointmentsRepository;
        const usersRepository = getRepository(User);
        const appointmentDate = startOfHour(date);

        const appointmentAlreadyRecorded = await repository.findByDate(
            appointmentDate,
        );

        const providerFound = await usersRepository.findOne({
            where: { id: providerId },
        });

        if (!providerFound) {
            throw new AppError('Provider not found.');
        }

        if (appointmentAlreadyRecorded) {
            throw new AppError('This appointment is already booked.');
        }

        const newAppointment = repository.create({
            providerId,
            date: appointmentDate,
        });

        return newAppointment;
    }
}
