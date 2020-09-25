import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '@modules/appointments/infra/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';


const appointmentsRoutes = Router();

appointmentsRoutes.get('/', async (request, response) => {
    const appointmentsRepository = new AppointmentsRepository();
    const appointments = await appointmentsRepository.find();
    return response.status(200).json({ appointments }).end();
});

appointmentsRoutes.post('/', async (request, response) => {
    const { providerId, date } = request.body;
    const appointmentsRepository = new AppointmentsRepository();

    const parsedDate = parseISO(date);

    const appointmentService = new CreateAppointmentService(appointmentsRepository);

    const newAppointment = await appointmentService.execute({
        date: parsedDate,
        providerId,
    });

    return response.status(201).json(newAppointment).end();
});

export default appointmentsRoutes;
