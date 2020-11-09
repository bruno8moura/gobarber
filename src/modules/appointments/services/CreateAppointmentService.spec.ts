import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const appointmentsRepository = new FakeAppointmentsRepository();
        const usersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const newUser: ICreateUserDTO = {
            name: 'Bruno Moura',
            email: 'bruno@mail.com',
            password: 'admin123',
        };

        const createdUser = await new CreateUserService(
            usersRepository,
            fakeHashProvider,
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

    it('should not be able to create two appoiments on the same time', async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
            fakeUsersRepository,
        );

        const newUser: ICreateUserDTO = {
            name: 'Bruno Moura',
            email: 'bruno@mail.com',
            password: 'admin123',
        };

        const createdUser = await new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        ).execute(newUser);

        const appointmentDate = new Date();

        await createAppointment.execute({
            date: appointmentDate,
            providerId: createdUser.id,
        });

        expect(
            createAppointment.execute({
                date: appointmentDate,
                providerId: createdUser.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment without a valid provider', async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const fakeUsersRepository = new FakeUsersRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
            fakeUsersRepository,
        );
        const appointmentDate = new Date();

        expect(
            createAppointment.execute({
                date: appointmentDate,
                providerId: '1234144',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
