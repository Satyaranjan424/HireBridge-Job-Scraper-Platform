import { Router } from 'express';
import {
  changeMyPassword,
  deactivateMyAccount,
  getMyProfile,
  updateMyProfile,
} from '../controllers/profile.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

export const profileRouter = Router();

profileRouter.get('/profile', requireAuth, getMyProfile);
profileRouter.patch('/profile', requireAuth, updateMyProfile);
profileRouter.put('/profile', requireAuth, updateMyProfile);
profileRouter.patch('/profile/password', requireAuth, changeMyPassword);
profileRouter.patch('/profile/deactivate', requireAuth, deactivateMyAccount);
