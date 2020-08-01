import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';
import User from '../models/User';
import { getRepository } from 'typeorm';

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

        const providerFound = await usersRepository.findOne({where: {id: providerId}});

        if(!providerFound) {
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
