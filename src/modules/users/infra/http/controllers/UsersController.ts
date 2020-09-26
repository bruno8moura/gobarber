import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, password, email } = request.body;

        try {
            const newUser = {
                name,
                password,
                email,
            };

            const userCreated = await container
                .resolve(CreateUserService)
                .execute(newUser);

            delete userCreated.password;

            return response.status(201).json(userCreated);
        } catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
