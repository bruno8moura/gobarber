import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRoutes = Router();

usersRoutes.post('/', async (request, response) => {
    const { name, password, email } = request.body;

    try {
        const newUser = {
            name,
            password,
            email,
        };

        const userCreated = await new CreateUserService().execute(newUser);

        return response.status(201).json(userCreated).end();
    } catch (error) {
        return response.status(400).json({ message: error.message }).end();
    }
});

export default usersRoutes;
