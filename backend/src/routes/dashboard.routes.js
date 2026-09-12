import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboard.controller.js';

const router = Router();

// GET /api/dashboard/overview
router.get('/overview', getDashboardOverview);

export default router;
