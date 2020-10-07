import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const appointmentsRepository = new FakeAppointmentRepository();
        const usersRepository = new FakeUsersRepository();

        const newUser: ICreateUserDTO = {
            name: 'Bruno Moura',
            email: 'bruno@mail.com',
            password: 'admin123',
        };

        const createdUser = await new CreateUserService(
            usersRepository,
        ).execute(newUser);

        const newAppointment = await new CreateAppointmentService(
            appointmentsRepository,
            usersRepository,
        ).execute({
            date: new Date(),
            providerId: createdUser.id,
        });

        expect(newAppointment).toHaveProperty('id');
    });

    /* it('should not be able to create two appointments on the same time', () => {
        expect(1 + 2).toBe(3);
    }); */
});
