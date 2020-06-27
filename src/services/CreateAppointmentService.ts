import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
    date: Date;
    provider: string;
}

export default class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepository;

    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public execute({ date, provider }: Request): Appointment {
        const appointmentDate = startOfHour(date);

        const appointmentAlreadyRecorded = this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (appointmentAlreadyRecorded) {
            throw Error('This appointment is already booked.');
        }

        return this.appointmentsRepository.create({
            provider,
            date: appointmentDate,
        });
    }
}
