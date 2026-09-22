import { Router } from 'express';
import {
  getOffices,
  getOfficeStats,
  getSectorSummary,
  searchOffices,
  createOffice,
  bulkImportOffices,
  exportOfficesCSV,
  deleteOffice,
  updateOffice,
  duplicateOffice,
  renewOffice,
  purgeTestData,
  getOfficeById
} from '../controllers/office.controller.js';

const router = Router();

// Stats summary endpoint
router.get('/stats', getOfficeStats);

// Sector counts summary endpoint
router.get('/sectors', getSectorSummary);

// Dedicated quick search endpoint (properties, sectors, owners)
router.get('/search', searchOffices);

// Purge dummy/test properties
router.delete('/purge/test-data', purgeTestData);

// Export all properties to Excel / CSV endpoint
router.get('/export', exportOfficesCSV);

// Bulk import properties from Excel / CSV endpoint
router.post('/bulk-import', bulkImportOffices);

// Renew property listing (+60 days)
router.put('/:id/renew', renewOffice);
router.post('/:id/renew', renewOffice);

// Duplicate property endpoint
router.post('/:id/duplicate', duplicateOffice);

// Update property endpoint
router.put('/:id', updateOffice);

// Create new property endpoint
router.post('/', createOffice);

// Delete single property endpoint
router.delete('/:id', deleteOffice);

// Single property detail by id, propertyId, or slug
router.get('/:id', getOfficeById);

// Filter & search endpoint
router.get('/', getOffices);

export default router;

