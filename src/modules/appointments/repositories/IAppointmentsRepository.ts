import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IGetAppointmentDTO from '../dtos/IGetAppointmentDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<IGetAppointmentDTO>;
    findByDate(date: Date): Promise<IGetAppointmentDTO | undefined>;
    find(): Promise<IGetAppointmentDTO[] | undefined>;
}
