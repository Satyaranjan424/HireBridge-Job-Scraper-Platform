import { Router } from 'express';
import { getCurrentUser, login, logout, signup } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

export const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/register', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, getCurrentUser);
