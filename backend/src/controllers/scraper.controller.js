import { sendSuccess } from '../utils/apiResponse.js';
import { searchPlatformJobs } from '../services/scraper.service.js';
import { scraperSearchSchema } from '../validators/job.validators.js';

export async function scrapeJobs(req, res, next) {
  try {
    const { keyword, location, platforms } = scraperSearchSchema.parse(req.query.platforms
      ? { ...req.query, platforms: String(req.query.platforms).split(',').map((item) => item.trim().toUpperCase()) }
      : req.query);

    const result = await searchPlatformJobs({ keyword, location, platforms });
    sendSuccess(res, {
      message: 'Internal HireBridge jobs are returned from the database. External platforms are opened through their official job-search pages.',
      data: { source: 'platform-search', ...result },
    });
  } catch (error) {
    next(error);
  }
}
