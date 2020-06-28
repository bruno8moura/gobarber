import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
    const { email, password } = request.body;

    try {
        const { user, token } = await new AuthenticateUserService().execute({
            email,
            password,
        });

        delete user.password;
        return response.status(201).json({ user, token }).end();
    } catch (error) {
        return response.status(400).json({ message: error.message }).end();
    }
});

export default sessionsRoutes;
