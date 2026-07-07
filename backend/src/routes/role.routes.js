import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/requireAuth.js';

export const roleRouter = Router();

roleRouter.get('/student', requireAuth, requireRole('STUDENT'), (_req, res) => {
  res.json({ success: true, message: 'Student route access granted' });
});

roleRouter.get('/hiring-manager', requireAuth, requireRole('HIRING_MANAGER'), (_req, res) => {
  res.json({ success: true, message: 'Hiring manager route access granted' });
});
