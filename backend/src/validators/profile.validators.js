import { z } from 'zod';

const fileOrUrl = z.string().trim().refine((value) => {
  if (!value) return true;
  return value.startsWith('data:') || z.string().url().safeParse(value).success;
}, 'Must be a valid URL or uploaded file');

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  headline: z.string().trim().max(140).optional().or(z.literal('')),
  avatarUrl: fileOrUrl.optional().or(z.literal('')),
  bio: z.string().trim().max(900, 'Bio must be 900 characters or less').optional().or(z.literal('')),
  skills: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  resumeUrl: fileOrUrl.optional().or(z.literal('')),
  companyName: z.string().trim().max(120).optional().or(z.literal('')),
  companySite: z.string().trim().url().optional().or(z.literal('')),
  location: z.string().trim().max(100).optional().or(z.literal('')),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});
