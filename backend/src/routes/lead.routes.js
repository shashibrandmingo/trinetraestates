import { Router } from 'express';
import {
  getLeads,
  getLeadStats,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV
} from '../controllers/lead.controller.js';

const router = Router();

router.get('/stats', getLeadStats);
router.get('/export/csv', exportLeadsCSV);
router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
