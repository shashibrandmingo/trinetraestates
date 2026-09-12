import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve uploaded images, videos & documents directly from VPS local storage
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Centralized API routes mounting
app.use('/api', apiRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server after DB connection
// trigger restart
const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[Server] Backend listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const handleShutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
};

startServer();
