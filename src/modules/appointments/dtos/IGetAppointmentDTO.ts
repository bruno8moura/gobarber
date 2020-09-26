import IGetUserDTO from '@modules/users/dtos/IGetUserDTO';

export default interface IGetAppointmentDTO {
    id: string;
    provider: IGetUserDTO;
    date: Date;
}
