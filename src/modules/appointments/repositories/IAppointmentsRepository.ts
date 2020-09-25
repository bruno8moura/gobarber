import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IGetAppointmentDTO from '../dtos/IGetAppointmentDTO';
import Appointment from '../infra/typeorm/entities/Appointment';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<IGetAppointmentDTO>;
    findByDate(date: Date): Promise<Appointment | undefined>;
    find(): Promise<Appointment[] | undefined>;
}
