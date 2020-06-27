import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRoutes = Router();
const repository = new AppointmentsRepository();

appointmentsRoutes.get('/', (request, response) => {
    return response.status(200).json(repository.all()).end();
});

appointmentsRoutes.post('/', (request, response) => {
    const { provider, date } = request.body;

    try {
        const parsedDate = parseISO(date);

        const appointmentService = new CreateAppointmentService(repository);

        const newAppointment = appointmentService.execute({
            date: parsedDate,
            provider,
        });

        return response.status(201).json(newAppointment).end();
    } catch (error) {
        return response.status(400).json({ message: error.message }).end();
    }
});

export default appointmentsRoutes;
