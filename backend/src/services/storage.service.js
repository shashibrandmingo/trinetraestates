import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Physical uploads folder on VPS disk: backend/uploads
export const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Auto-create uploads directory on startup
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Save base64 string directly to physical file on VPS disk with automatic Sharp image optimization
 * - Resizes images to max 1400px width/height (maintains aspect ratio, never enlarges smaller images)
 * - Auto-orients image based on EXIF data (fixes rotated phone camera photos)
 * - Converts to optimized next-gen WebP format at 80% quality (~85-90% file size reduction)
 * - Falls back safely to raw file save if sharp encounters any non-standard format
 * @param {string} base64Data - Data URI format: "data:image/jpeg;base64,..."
 * @param {string} prefix - Filename prefix (e.g. 'prop-img')
 * @returns {Promise<string>} Public relative URL path (e.g. '/uploads/prop-img-1726189999-a1b2c3.webp')
 */
export const saveBase64ToFile = async (base64Data, prefix = 'img') => {
  if (!base64Data || typeof base64Data !== 'string') return base64Data;
  if (!base64Data.startsWith('data:')) return base64Data; // Already an uploaded URL

  try {
    const commaIdx = base64Data.indexOf(',');
    if (commaIdx === -1) return base64Data;

    const header = base64Data.substring(0, commaIdx).toLowerCase();
    const base64Body = base64Data.substring(commaIdx + 1);
    if (!base64Body) return base64Data;

    const dataBuffer = Buffer.from(base64Body, 'base64');

    let ext = 'jpg';
    if (header.includes('png')) ext = 'png';
    else if (header.includes('webp')) ext = 'webp';
    else if (header.includes('jpeg') || header.includes('jpg')) ext = 'jpg';
    else if (header.includes('pdf')) ext = 'pdf';
    else if (header.includes('mp4') || header.includes('video')) ext = 'mp4';
    else if (header.includes('svg')) ext = 'svg';

    if (!fs.existsSync(UPLOAD_DIR)) {
      await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
    }

    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

    if (isImage) {
      try {
        const outputFilename = `${prefix}-${Date.now()}-${randomSuffix}.webp`;
        const outputPath = path.join(UPLOAD_DIR, outputFilename);

        await sharp(dataBuffer)
          .rotate() // Auto-orient based on EXIF (prevents sideways mobile uploads)
          .resize({
            width: 1400,
            height: 1400,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 80, effort: 4 })
          .toFile(outputPath);

        return `/uploads/${outputFilename}`;
      } catch (sharpErr) {
        console.warn('[Storage Service] Sharp optimization fallback to raw:', sharpErr?.message);
        const filename = `${prefix}-${Date.now()}-${randomSuffix}.${ext}`;
        const filePath = path.join(UPLOAD_DIR, filename);
        await fs.promises.writeFile(filePath, dataBuffer);
        return `/uploads/${filename}`;
      }
    } else {
      // Non-image files (PDFs, Videos, SVGs, etc.)
      const filename = `${prefix}-${Date.now()}-${randomSuffix}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);
      await fs.promises.writeFile(filePath, dataBuffer);
      return `/uploads/${filename}`;
    }
  } catch (err) {
    console.error('[Storage Service Error] Failed to save file to VPS disk:', err);
    return base64Data;
  }
};

/**
 * Automatically process property media arrays and save any base64 files to VPS disk
 */
export const processMediaPayload = async (data) => {
  if (!data) return data;
  const processed = { ...data };

  // 1. Process property images
  if (Array.isArray(processed.images)) {
    processed.images = await Promise.all(
      processed.images.map(async (img, idx) => {
        if (typeof img === 'string' && img.startsWith('data:')) {
          const savedUrl = await saveBase64ToFile(img, `prop-img-${idx}`);
          return {
            url: savedUrl,
            isCover: idx === 0
          };
        }
        if (img && typeof img === 'object' && img.url && img.url.startsWith('data:')) {
          const savedUrl = await saveBase64ToFile(img.url, `prop-img-${idx}`);
          return {
            ...img,
            url: savedUrl
          };
        }
        return img;
      })
    );
  }

  // 2. Process documents
  if (Array.isArray(processed.documents)) {
    processed.documents = await Promise.all(
      processed.documents.map(async (doc, idx) => {
        if (doc && typeof doc === 'object' && doc.url && doc.url.startsWith('data:')) {
          const savedUrl = await saveBase64ToFile(doc.url, `prop-doc-${idx}`);
          return {
            ...doc,
            url: savedUrl
          };
        }
        return doc;
      })
    );
  }

  return processed;
};
