import { z } from 'zod';

const applicationBaseSchema = z
  .object({
    jobId: z.string().cuid().optional(),
    externalKey: z.string().trim().max(180).optional(),
    title: z.string().trim().min(2).max(140).optional(),
    company: z.string().trim().min(2).max(120).optional(),
    location: z.string().trim().min(2).max(100).optional(),
    source: z.enum(['INTERNAL', 'LINKEDIN', 'NAUKRI', 'INTERNSHALA', 'UNSTOP']).optional(),
    applyUrl: z.string().trim().url().optional().or(z.literal('')),
    resumeUrl: z.string().trim().url().optional().or(z.literal('')),
    coverLetter: z.string().trim().max(2000).optional().or(z.literal('')),
  });

export const applySchema = applicationBaseSchema
  .refine((data) => data.jobId || data.externalKey, {
    message: 'Either jobId or externalKey is required',
    path: ['jobId'],
  })
  .refine((data) => data.jobId || (data.title && data.company && data.location && data.source), {
    message: 'External applications need title, company, location, and source',
    path: ['title'],
  });

export const bookmarkSchema = applicationBaseSchema.pick({
  jobId: true,
  externalKey: true,
  title: true,
  company: true,
  location: true,
  source: true,
  applyUrl: true,
}).refine((data) => data.jobId || data.externalKey, {
  message: 'Either jobId or externalKey is required',
  path: ['jobId'],
});

export const applicationStatusSchema = z.object({
  status: z.enum(['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'WITHDRAWN']),
});
