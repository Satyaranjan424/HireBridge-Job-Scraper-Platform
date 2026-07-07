import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { authRouter } from './routes/auth.routes.js';
import { applicationRouter } from './routes/application.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { jobRouter } from './routes/job.routes.js';
import { profileRouter } from './routes/profile.routes.js';
import { roleRouter } from './routes/role.routes.js';
import { scraperRouter } from './routes/scraper.routes.js';
import { env } from './config/env.js';

export const app = express();

const allowedOrigins = new Set(
  env.CLIENT_ORIGIN.split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
);
const devOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, '');
      if (!origin || allowedOrigins.has(normalizedOrigin) || devOriginPattern.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/role-check', roleRouter);
app.use('/api', profileRouter);
app.use('/api', jobRouter);
app.use('/api', scraperRouter);
app.use('/api', applicationRouter);

app.use(notFound);
app.use(errorHandler);
