import { Router } from 'express';
import {
  getClients,
  getClientStats,
  createClient,
  updateClient,
  deleteClient,
  exportClientsCSV
} from '../controllers/client.controller.js';

const router = Router();

router.get('/export/csv', exportClientsCSV);
router.get('/stats', getClientStats);
router.get('/', getClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
