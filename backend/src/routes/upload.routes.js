import { Router } from 'express';
import { saveBase64ToFile } from '../services/storage.service.js';

const router = Router();

/**
 * POST /api/upload
 * Accepts base64 file data and writes it directly to the VPS disk
 */
router.post('/', (req, res) => {
  try {
    const { file, prefix = 'media' } = req.body;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file data provided'
      });
    }

    const savedUrl = saveBase64ToFile(file, prefix);
    res.status(200).json({
      success: true,
      url: savedUrl,
      message: 'File saved successfully to VPS disk'
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save file to VPS disk'
    });
  }
});

export default router;
