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

/**
 * Safely delete a physical file from VPS disk storage
 * - Guards against directory traversal
 * - Never deletes templates or sample assets
 * - Works for images, videos, and documents
 * @param {string} fileUrl - Public URL path (e.g. '/uploads/prop-img-123.webp' or '/uploads/videos/prop-video-123.mp4')
 * @returns {Promise<boolean>} True if file was unlinked, false otherwise
 */
export const deleteFileFromStorage = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return false;

  // Never delete external URLs, base64 data, or sample templates
  if (
    fileUrl.startsWith('http://') ||
    fileUrl.startsWith('https://') ||
    fileUrl.startsWith('data:') ||
    fileUrl.includes('sample-office') ||
    fileUrl.includes('/images/')
  ) {
    return false;
  }

  const cleanUrl = fileUrl.trim().split('?')[0].split('#')[0];
  if (!cleanUrl.startsWith('/uploads/') && !cleanUrl.startsWith('uploads/')) {
    return false;
  }

  try {
    const relativeToUploads = cleanUrl.replace(/^\/?uploads\//, '');
    const normalized = path.normalize(relativeToUploads);

    // Prevent path traversal attacks
    if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
      console.warn('[Storage Service] Blocked path traversal attempt in deleteFileFromStorage:', cleanUrl);
      return false;
    }

    const physicalPath = path.join(UPLOAD_DIR, normalized);

    if (fs.existsSync(physicalPath)) {
      await fs.promises.unlink(physicalPath);
      console.log(`[Storage Service] Safely unlinked file from VPS disk: ${physicalPath}`);
      return true;
    }
  } catch (err) {
    console.warn(`[Storage Service] Could not unlink file: ${fileUrl}`, err?.message);
  }
  return false;
};

/**
 * Extract all local uploaded file URLs from a property object
 * @param {object} doc - Property document or update payload
 * @returns {Set<string>} Set of local upload URLs
 */
export const extractUploadUrls = (doc) => {
  const urls = new Set();
  if (!doc || typeof doc !== 'object') return urls;

  const addIfLocalUpload = (url) => {
    if (typeof url === 'string') {
      const clean = url.trim().split('?')[0].split('#')[0];
      if (
        (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) &&
        !clean.includes('sample-office') &&
        !clean.includes('/images/')
      ) {
        urls.add(clean.startsWith('/') ? clean : `/${clean}`);
      }
    }
  };

  // 1. images array
  if (Array.isArray(doc.images)) {
    for (const item of doc.images) {
      if (typeof item === 'string') {
        addIfLocalUpload(item);
      } else if (item && typeof item === 'object' && item.url) {
        addIfLocalUpload(item.url);
      }
    }
  }

  // 2. imageUrl & thumbnail
  addIfLocalUpload(doc.imageUrl);
  addIfLocalUpload(doc.thumbnail);

  // 3. videoUrl
  addIfLocalUpload(doc.videoUrl);

  // 4. documents array
  if (Array.isArray(doc.documents)) {
    for (const item of doc.documents) {
      if (typeof item === 'string') {
        addIfLocalUpload(item);
      } else if (item && typeof item === 'object' && item.url) {
        addIfLocalUpload(item.url);
      }
    }
  }

  return urls;
};

/**
 * Delete a file from disk ONLY IF no other property in MongoDB is referencing it
 * (Protects duplicated properties or shared media from breaking)
 * @param {string} fileUrl
 * @param {import('mongoose').Model} OfficeModel
 * @param {string|import('mongoose').Types.ObjectId} currentDocId
 */
export const deleteFileIfNotInUse = async (fileUrl, OfficeModel, currentDocId = null) => {
  if (!fileUrl) return false;

  try {
    const filter = {
      $or: [
        { 'images.url': fileUrl },
        { images: fileUrl },
        { thumbnail: fileUrl },
        { imageUrl: fileUrl },
        { videoUrl: fileUrl },
        { 'documents.url': fileUrl }
      ]
    };

    if (currentDocId) {
      filter._id = { $ne: currentDocId };
    }

    const inUse = await OfficeModel.exists(filter);
    if (!inUse) {
      return await deleteFileFromStorage(fileUrl);
    } else {
      console.log(`[Storage Service] Media file ${fileUrl} is still used by another property. Kept safely on disk.`);
    }
  } catch (err) {
    console.warn(`[Storage Service] Failed to verify file reference for ${fileUrl}:`, err?.message);
  }
  return false;
};

/**
 * Clean up all media files for a deleted property from VPS disk
 * @param {object} propertyDoc
 * @param {import('mongoose').Model} OfficeModel
 */
export const cleanupPropertyFilesOnDelete = async (propertyDoc, OfficeModel) => {
  if (!propertyDoc) return;
  const urls = extractUploadUrls(propertyDoc);
  if (urls.size === 0) return;

  console.log(`[Storage Service] Cleaning up ${urls.size} media file(s) for deleted property ${propertyDoc.propertyId || propertyDoc._id}`);
  for (const url of urls) {
    await deleteFileIfNotInUse(url, OfficeModel, propertyDoc._id);
  }
};

/**
 * Clean up orphaned media when a property is edited/updated
 * (E.g. user removed 2 images or replaced the video)
 * @param {object} oldPropertyDoc - Previous DB document before update
 * @param {object} newPropertyDoc - Newly updated document or payload
 * @param {import('mongoose').Model} OfficeModel
 */
export const cleanupOrphanedMediaOnUpdate = async (oldPropertyDoc, newPropertyDoc, OfficeModel) => {
  if (!oldPropertyDoc) return;
  const oldUrls = extractUploadUrls(oldPropertyDoc);
  if (oldUrls.size === 0) return;

  const newUrls = extractUploadUrls(newPropertyDoc);
  const removedUrls = [...oldUrls].filter((url) => !newUrls.has(url));

  if (removedUrls.length > 0) {
    console.log(`[Storage Service] Found ${removedUrls.length} orphaned media file(s) removed during property update.`);
    for (const url of removedUrls) {
      await deleteFileIfNotInUse(url, OfficeModel, oldPropertyDoc._id);
    }
  }
};

