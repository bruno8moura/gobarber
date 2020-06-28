import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRoutes = Router();

appointmentsRoutes.get('/', async (request, response) => {
    const repository = getCustomRepository(AppointmentsRepository);
    const appointments = await repository.find();
    return response.status(200).json({ appointments }).end();
});

appointmentsRoutes.post('/', async (request, response) => {
    const { providerId, date } = request.body;

    try {
        const parsedDate = parseISO(date);

        const appointmentService = new CreateAppointmentService();

        const newAppointment = await appointmentService.execute({
            date: parsedDate,
            providerId,
        });

        return response.status(201).json(newAppointment).end();
    } catch (error) {
        return response.status(400).json({ message: error.message }).end();
    }
});

export default appointmentsRoutes;
