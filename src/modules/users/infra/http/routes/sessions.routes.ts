import { Router } from 'express';
import { container } from 'tsyringe';
import SessionsController from '../controllers/SessionsController';

const sessionsRoutes = Router();
const controller = container.resolve(SessionsController);

sessionsRoutes.post('/', controller.create);

export default sessionsRoutes;
