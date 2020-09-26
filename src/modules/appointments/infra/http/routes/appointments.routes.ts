import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { container } from 'tsyringe';

const appointmentsRoutes = Router();

appointmentsRoutes.get('/', async (request, response) => {
    const appointmentsRepository = new AppointmentsRepository();
    const appointments = await appointmentsRepository.find();
    return response.status(200).json({ appointments }).end();
});

appointmentsRoutes.post('/', async (request, response) => {
    const { providerId, date } = request.body;

    const parsedDate = parseISO(date);

    const appointmentService = container.resolve(CreateAppointmentService);

    const newAppointment = await appointmentService.execute({
        date: parsedDate,
        providerId,
    });

    return response.status(201).json(newAppointment).end();
});

export default appointmentsRoutes;
