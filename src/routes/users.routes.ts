import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureUserAuthenticated from '../middlewares/ensureUserAuthenticated';
import uploadConfig from '../config/upload.files';

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
    (request, response) => {
        console.log(request.file);

        return response.json({ ok: true }).end();
    },
);

export default usersRoutes;
