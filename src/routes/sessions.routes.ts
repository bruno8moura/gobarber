import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
    const { email, password } = request.body;

    const { user, token } = await new AuthenticateUserService().execute({
        email,
        password,
    });

    delete user.password;
    return response.status(201).json({ user, token }).end();
});

export default sessionsRoutes;
