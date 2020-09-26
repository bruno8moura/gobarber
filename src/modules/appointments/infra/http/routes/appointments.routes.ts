import { Router } from 'express';
import { container } from 'tsyringe';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRoutes = Router();
const controller = container.resolve(AppointmentsController);

appointmentsRoutes.get('/', controller.index);

appointmentsRoutes.post('/', controller.create);

export default appointmentsRoutes;
