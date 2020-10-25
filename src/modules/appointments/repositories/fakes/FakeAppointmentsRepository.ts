import { uuid } from 'uuidv4';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IGetAppointmentDTO from '@modules/appointments/dtos/IGetAppointmentDTO';
import { isEqual } from 'date-fns';

export default class FakeAppointmentsRepository
    implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async find(): Promise<IGetAppointmentDTO[] | undefined> {
        return this.appointments.map(({ id, date, providerId }) => ({
            id,
            date,
            provider: { id: providerId, name: '', email: '' },
        }));
    }

    public async create({
        date,
        providerId,
    }: ICreateAppointmentDTO): Promise<IGetAppointmentDTO> {
        const newAppointment = new Appointment();
        const createdAt = new Date();

        Object.assign(newAppointment, {
            id: uuid(),
            date,
            providerId,
            createdAt,
            updatedAt: createdAt,
        });

        this.appointments.push(newAppointment);

        return {
            id: newAppointment.id,
            date: newAppointment.date,
            provider: { id: providerId, name: '', email: '' },
        };
    }

    public async findByDate(
        date: Date,
    ): Promise<IGetAppointmentDTO | undefined> {
        const foundAppointment = this.appointments.find(el =>
            isEqual(el.date, date),
        );

        if (!foundAppointment) return undefined;

        return {
            id: foundAppointment?.id,
            date: foundAppointment?.date,
            provider: { id: foundAppointment?.providerId, name: '', email: '' },
        };
    }
}
