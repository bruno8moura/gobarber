import { getRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IGetAppointmentDTO from '@modules/appointments/dtos/IGetAppointmentDTO';

export default class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async find(): Promise<Appointment[] | undefined> {
        return this.ormRepository.find();
    }

    public async create(data: ICreateAppointmentDTO): Promise<IGetAppointmentDTO> {
        const newAppointment = this.ormRepository.create(data);
        await this.ormRepository.save(newAppointment);

        return {id: newAppointment.id, date: newAppointment.date, provider: newAppointment.provider.name};
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });

        return findAppointment;
    }
}
