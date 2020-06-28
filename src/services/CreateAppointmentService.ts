import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
    date: Date;
    providerId: string;
}

export default class CreateAppointmentService {
    public async execute({ date, providerId }: Request): Promise<Appointment> {
        const repository = getCustomRepository(AppointmentsRepository);
        const appointmentDate = startOfHour(date);

        const appointmentAlreadyRecorded = await repository.findByDate(
            appointmentDate,
        );

        if (appointmentAlreadyRecorded) {
            throw Error('This appointment is already booked.');
        }

        const newAppointment = repository.create({
            providerId,
            date: appointmentDate,
        });

        await repository.save(newAppointment);

        return newAppointment;
    }
}
