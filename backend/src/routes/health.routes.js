import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    service: 'hirebridge-api',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});
