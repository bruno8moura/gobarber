import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
    const usersRepository = new UsersRepository();
    const { email, password } = request.body;

    const { user, token } = await new AuthenticateUserService(usersRepository).execute({
        email,
        password,
    });

    delete user.password;
    return response.status(201).json({ user, token }).end();
});

export default sessionsRoutes;
