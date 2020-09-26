import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
    const { email, password } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);
    const { user, token } = await authenticateUserService.execute({
        email,
        password,
    });

    delete user.password;
    return response.status(201).json({ user, token }).end();
});

export default sessionsRoutes;
