import { Router } from 'express';
import healthRoutes from './health.routes.js';
import officeRoutes from './office.routes.js';
import clientRoutes from './client.routes.js';
import leadRoutes from './lead.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

// Mount centralized routes
router.use('/health', healthRoutes);
router.use('/offices', officeRoutes);
router.use('/clients', clientRoutes);
router.use('/leads', leadRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

