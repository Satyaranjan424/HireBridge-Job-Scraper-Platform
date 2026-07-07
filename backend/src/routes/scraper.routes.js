import { Router } from 'express';
import { scrapeJobs } from '../controllers/scraper.controller.js';
import { requireAuth, requireRole } from '../middlewares/requireAuth.js';

export const scraperRouter = Router();

scraperRouter.get('/scrape/jobs', requireAuth, requireRole('STUDENT'), scrapeJobs);
scraperRouter.get('/jobs/search/external', requireAuth, requireRole('STUDENT'), scrapeJobs);
