import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload.files';
import ensureUserAuthenticated from '@modules/users/infra/middlewares/ensureUserAuthenticated';
import { container } from 'tsyringe';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRoutes = Router();
const upload = multer(uploadConfig);
const usersController = container.resolve(UsersController);
const userAvatarController = container.resolve(UserAvatarController);

usersRoutes.post('/', usersController.create);

usersRoutes.patch(
    '/avatar',
    ensureUserAuthenticated,
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRoutes;
