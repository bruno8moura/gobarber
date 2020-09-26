import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppointmentsRepository from '../../typeorm/repositories/AppointmentsRepository';

export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { providerId, date } = request.body;

        const parsedDate = parseISO(date);

        const appointmentService = container.resolve(CreateAppointmentService);

        const newAppointment = await appointmentService.execute({
            date: parsedDate,
            providerId,
        });

        return response.status(201).json(newAppointment);
    }

    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const appointmentsRepository = container.resolve(
            AppointmentsRepository,
        );
        const appointments = await appointmentsRepository.find();
        return response.status(200).json({ appointments });
    }
}
