import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Physical directory for videos: backend/uploads/videos
export const VIDEO_UPLOAD_DIR = path.join(__dirname, '../../uploads/videos');

if (!fs.existsSync(VIDEO_UPLOAD_DIR)) {
  fs.mkdirSync(VIDEO_UPLOAD_DIR, { recursive: true });
}

/**
 * Check if ffmpeg binary is available in the system environment
 * @returns {Promise<boolean>}
 */
export const checkFfmpegAvailable = () => {
  return new Promise((resolve) => {
    try {
      const proc = spawn('ffmpeg', ['-version']);
      proc.on('error', () => resolve(false));
      proc.on('close', (code) => resolve(code === 0));
    } catch {
      resolve(false);
    }
  });
};

/**
 * Optimize video file using FFmpeg
 * - Scales down to 720p HD max (1280px width)
 * - Encodes with H.264 (CRF 26) + AAC audio for 80-85% file size reduction
 * - Adds +faststart movflag for instant web streaming
 * - Graceful fallback: If ffmpeg is not installed on the system, keeps the raw video file intact
 * @param {string} rawFilePath - Path to raw uploaded video
 * @param {string} targetFilename - Final filename
 * @returns {Promise<{ filename: string, isOptimized: boolean }>}
 */
export const processAndOptimizeVideo = async (rawFilePath, targetFilename) => {
  const hasFfmpeg = await checkFfmpegAvailable();

  if (!hasFfmpeg) {
    console.log('[Video Service] FFmpeg is not installed on this system. Keeping original video file.');
    console.log('[Video Service] TIP: On your Ubuntu VPS, run "sudo apt install -y ffmpeg" to enable auto-compression.');
    return {
      filename: path.basename(rawFilePath),
      isOptimized: false
    };
  }

  const optimizedPath = path.join(VIDEO_UPLOAD_DIR, targetFilename);

  return new Promise((resolve) => {
    console.log(`[Video Service] Starting FFmpeg optimization for: ${rawFilePath}`);

    const ffmpegArgs = [
      '-y',
      '-i', rawFilePath,
      '-c:v', 'libx264',
      '-crf', '26',
      '-preset', 'fast',
      '-vf', "scale='min(1280,iw)':-2",
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      optimizedPath
    ];

    const proc = spawn('ffmpeg', ffmpegArgs);

    proc.on('error', (err) => {
      console.warn('[Video Service] FFmpeg execution error, falling back to raw video:', err.message);
      resolve({ filename: path.basename(rawFilePath), isOptimized: false });
    });

    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(optimizedPath)) {
        try {
          const rawSize = fs.statSync(rawFilePath).size;
          const optSize = fs.statSync(optimizedPath).size;
          const savedPct = Math.round(((rawSize - optSize) / rawSize) * 100);
          console.log(`[Video Service] Optimization completed! Raw: ${(rawSize / 1048576).toFixed(1)}MB -> Optimized: ${(optSize / 1048576).toFixed(1)}MB (Saved ${savedPct}%)`);
          
          // Delete heavy uncompressed raw file
          fs.unlinkSync(rawFilePath);
        } catch (_) {}

        resolve({ filename: targetFilename, isOptimized: true });
      } else {
        console.warn(`[Video Service] FFmpeg exited with code ${code}. Keeping original video.`);
        resolve({ filename: path.basename(rawFilePath), isOptimized: false });
      }
    });
  });
};
