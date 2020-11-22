import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeUsersRepository: IUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeUsersRepository = new FakeUsersRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeUsersRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        const fakeHashProvider = new FakeHashProvider();

        const newUser: ICreateUserDTO = {
            name: 'Bruno Moura',
            email: 'bruno@mail.com',
            password: 'admin123',
        };

        const createdUser = await new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        ).execute(newUser);

        const newAppointment = await new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeUsersRepository,
        ).execute({
            date: new Date(),
            providerId: createdUser.id,
        });

        expect(newAppointment).toHaveProperty('id');
    });

    it('should not be able to create two appoiments on the same time', async () => {
        const fakeHashProvider = new FakeHashProvider();

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
        const appointmentDate = new Date();

        expect(
            createAppointment.execute({
                date: appointmentDate,
                providerId: '1234144',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
