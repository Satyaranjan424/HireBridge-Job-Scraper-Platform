import { Router } from 'express';
import { closeJob, createJob, deleteJob, listJobs, listMyJobs, updateJob } from '../controllers/job.controller.js';
import { requireAuth, requireRole } from '../middlewares/requireAuth.js';

export const jobRouter = Router();

jobRouter.get('/jobs', requireAuth, listJobs);
jobRouter.get('/jobs/search', requireAuth, listJobs);
jobRouter.get('/manager/jobs', requireAuth, requireRole('HIRING_MANAGER'), listMyJobs);
jobRouter.post('/manager/jobs', requireAuth, requireRole('HIRING_MANAGER'), createJob);
jobRouter.patch('/manager/jobs/:jobId', requireAuth, requireRole('HIRING_MANAGER'), updateJob);
jobRouter.patch('/manager/jobs/:jobId/close', requireAuth, requireRole('HIRING_MANAGER'), closeJob);
jobRouter.delete('/manager/jobs/:jobId', requireAuth, requireRole('HIRING_MANAGER'), deleteJob);
jobRouter.get('/jobs/my', requireAuth, requireRole('HIRING_MANAGER'), listMyJobs);
jobRouter.post('/jobs', requireAuth, requireRole('HIRING_MANAGER'), createJob);
jobRouter.put('/jobs/:jobId', requireAuth, requireRole('HIRING_MANAGER'), updateJob);
jobRouter.patch('/jobs/:jobId', requireAuth, requireRole('HIRING_MANAGER'), updateJob);
jobRouter.patch('/jobs/:jobId/close', requireAuth, requireRole('HIRING_MANAGER'), closeJob);
jobRouter.delete('/jobs/:jobId', requireAuth, requireRole('HIRING_MANAGER'), deleteJob);
