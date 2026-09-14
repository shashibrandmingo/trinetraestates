import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { saveBase64ToFile } from '../services/storage.service.js';
import { VIDEO_UPLOAD_DIR, processAndOptimizeVideo } from '../services/video.service.js';

const router = Router();

// Multer storage for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    cb(null, `raw-video-${Date.now()}-${randomSuffix}${ext}`);
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 250 * 1024 * 1024 }, // 250MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.originalname.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, MOV, WebM, AVI, MKV) are allowed'));
    }
  }
});

/**
 * POST /api/upload
 * Accepts base64 image/file data and writes it directly to the VPS disk (with Sharp auto-optimization)
 */
router.post('/', async (req, res) => {
  try {
    const { file, prefix = 'media' } = req.body;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file data provided'
      });
    }

    const savedUrl = await saveBase64ToFile(file, prefix);
    res.status(200).json({
      success: true,
      url: savedUrl,
      message: 'File saved and optimized successfully on VPS disk'
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save file to VPS disk'
    });
  }
});

/**
 * POST /api/upload/video
 * Upload video file to VPS with optional FFmpeg auto-compression
 */
router.post('/video', (req, res) => {
  videoUpload.single('video')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Video upload failed'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    try {
      const rawPath = req.file.path;
      const randomSuffix = crypto.randomBytes(4).toString('hex');
      const targetFilename = `prop-video-${Date.now()}-${randomSuffix}.mp4`;

      const { filename, isOptimized } = await processAndOptimizeVideo(rawPath, targetFilename);

      return res.status(200).json({
        success: true,
        url: `/uploads/videos/${filename}`,
        originalName: req.file.originalname,
        size: req.file.size,
        isOptimized,
        message: isOptimized
          ? 'Video uploaded and compressed with FFmpeg successfully'
          : 'Video uploaded successfully to VPS disk'
      });
    } catch (processError) {
      console.error('Video processing error:', processError);
      return res.status(500).json({
        success: false,
        message: 'Failed to process video on VPS'
      });
    }
  });
});

export default router;
