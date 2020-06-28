import { Router } from 'express';
import appointmentsRoutes from './appointments.routes';
import usersRoutes from './users.routes';
import sessionsRoutes from './sessions.routes';
import ensureUserAuthenticated from '../middlewares/ensureUserAuthenticated';

const routes = Router();
routes.use('/appointments', ensureUserAuthenticated, appointmentsRoutes);
routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);

export default routes;
