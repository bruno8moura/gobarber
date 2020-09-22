import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

interface Request {
    date: Date;
    providerId: string;
}

export default class CreateAppointmentService {
    public async execute({ date, providerId }: Request): Promise<Appointment> {
        const repository = getCustomRepository(AppointmentsRepository);
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

        await repository.save(newAppointment);

        return newAppointment;
    }
}
