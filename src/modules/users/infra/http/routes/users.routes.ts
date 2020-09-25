import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import uploadConfig from '@config/upload.files';
import ensureUserAuthenticated from '@modules/users/infra/middlewares/ensureUserAuthenticated';
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.post('/', async (request, response) => {
    const usersRepository = new UsersRepository();
    const { name, password, email } = request.body;

    try {
        const newUser = {
            name,
            password,
            email,
        };

        const userCreated = await new CreateUserService(usersRepository).execute(newUser);

        delete userCreated.password;

        return response.status(201).json(userCreated).end();
    } catch (error) {
        return response.status(400).json({ message: error.message }).end();
    }
});

usersRoutes.patch(
    '/avatar',
    ensureUserAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const {
            user: { id },
            file: { filename },
        } = request;

        const usersRepository = new UsersRepository();
        const service = new UpdateUserAvatarService(usersRepository);
        const user = await service.execute({
            userId: id,
            avartarFileName: filename,
        });

        delete user.password;

        return response.json({ user }).end();
    },
);

export default usersRoutes;
