import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureUserAuthenticated from '../middlewares/ensureUserAuthenticated';
import uploadConfig from '../config/upload.files';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRoutes = Router();
const upload = multer(uploadConfig);

usersRoutes.post('/', async (request, response) => {
    const { name, password, email } = request.body;

    try {
        const newUser = {
            name,
            password,
            email,
        };

        const userCreated = await new CreateUserService().execute(newUser);

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

        const service = new UpdateUserAvatarService();
        const user = await service.execute({
            userId: id,
            avartarFileName: filename,
        });

        delete user.password;

        return response.json({ user }).end();
    },
);

export default usersRoutes;
