import { Router } from 'express';
import {
  getOffices,
  getOfficeStats,
  searchOffices,
  createOffice,
  bulkImportOffices,
  exportOfficesCSV,
  deleteOffice,
  updateOffice,
  duplicateOffice,
  purgeTestData,
  getOfficeById
} from '../controllers/office.controller.js';

const router = Router();

// Stats summary endpoint
router.get('/stats', getOfficeStats);

// Dedicated quick search endpoint (properties, sectors, owners)
router.get('/search', searchOffices);

// Purge dummy/test properties
router.delete('/purge/test-data', purgeTestData);

// Export all properties to Excel / CSV endpoint
router.get('/export', exportOfficesCSV);

// Bulk import properties from Excel / CSV endpoint
router.post('/bulk-import', bulkImportOffices);

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

