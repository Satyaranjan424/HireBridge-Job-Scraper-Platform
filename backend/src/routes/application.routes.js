import { Router } from 'express';
import {
  applyToJob,
  listApplicants,
  listBookmarks,
  listMyApplications,
  saveBookmark,
  updateApplicationStatus,
} from '../controllers/application.controller.js';
import { requireAuth, requireRole } from '../middlewares/requireAuth.js';

export const applicationRouter = Router();

applicationRouter.post('/applications', requireAuth, requireRole('STUDENT'), applyToJob);
applicationRouter.get('/applications/me', requireAuth, requireRole('STUDENT'), listMyApplications);
applicationRouter.get('/applications', requireAuth, requireRole('STUDENT'), listMyApplications);
applicationRouter.post('/bookmarks', requireAuth, requireRole('STUDENT'), saveBookmark);
applicationRouter.get('/bookmarks', requireAuth, requireRole('STUDENT'), listBookmarks);
applicationRouter.post('/bookmark', requireAuth, requireRole('STUDENT'), saveBookmark);
applicationRouter.get('/bookmark', requireAuth, requireRole('STUDENT'), listBookmarks);
applicationRouter.post('/jobs/:jobId/apply', requireAuth, requireRole('STUDENT'), (req, _res, next) => {
  req.body = { ...req.body, jobId: req.params.jobId };
  next();
}, applyToJob);
applicationRouter.get('/manager/jobs/:jobId/applicants', requireAuth, requireRole('HIRING_MANAGER'), listApplicants);
applicationRouter.get('/jobs/:jobId/applicants', requireAuth, requireRole('HIRING_MANAGER'), listApplicants);
applicationRouter.patch(
  '/manager/applications/:applicationId/status',
  requireAuth,
  requireRole('HIRING_MANAGER'),
  updateApplicationStatus,
);
