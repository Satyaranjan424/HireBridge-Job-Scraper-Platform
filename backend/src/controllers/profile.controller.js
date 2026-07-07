import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { sanitizeUser } from '../utils/sanitizeUser.js';
import { changePasswordSchema, updateProfileSchema } from '../validators/profile.validators.js';

export async function getMyProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: {
            postedJobs: true,
            applications: true,
            bookmarks: true,
          },
        },
      },
    });

    sendSuccess(res, {
      message: 'Profile loaded',
      data: { user: { ...sanitizeUser(user), bio: user.bio, _count: user._count } },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const payload = updateProfileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...payload,
        resumeUrl: req.user.role === 'STUDENT' ? payload.resumeUrl : undefined,
        skills: payload.skills ?? undefined,
        companyName: req.user.role === 'HIRING_MANAGER' ? payload.companyName : undefined,
        companySite: req.user.role === 'HIRING_MANAGER' ? payload.companySite : undefined,
      },
    });

    sendSuccess(res, {
      message: 'Profile updated successfully',
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

export async function changeMyPassword(req, res, next) {
  try {
    const payload = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isPasswordValid = await bcrypt.compare(payload.currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(payload.newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    sendSuccess(res, { message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function deactivateMyAccount(req, res, next) {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { isVerified: false },
    });

    sendSuccess(res, {
      message: 'Account deactivation placeholder completed',
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    next(error);
  }
}
