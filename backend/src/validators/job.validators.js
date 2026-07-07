import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().trim().min(3).max(140),
  company: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(100),
  description: z.string().trim().min(20).max(5000),
  requirements: z.array(z.string().trim().min(1).max(140)).max(20).optional(),
  employmentType: z.string().trim().min(2).max(60).default('Full-time'),
  salaryRange: z.string().trim().max(80).optional().or(z.literal('')),
  experience: z.string().trim().max(80).optional().or(z.literal('')),
  applyUrl: z.string().trim().url().optional().or(z.literal('')),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});

export const jobUpdateSchema = jobSchema.partial();

export const jobSearchSchema = z.object({
  keyword: z.string().trim().max(100).optional().default(''),
  location: z.string().trim().max(100).optional().default(''),
  source: z.enum(['ALL', 'INTERNAL', 'LINKEDIN', 'NAUKRI', 'INTERNSHALA', 'UNSTOP']).optional().default('ALL'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export const scraperSearchSchema = z.object({
  keyword: z.string().trim().min(1).max(100),
  location: z.string().trim().max(100).optional().default('Remote'),
  platforms: z
    .array(z.enum(['LINKEDIN', 'NAUKRI', 'INTERNSHALA', 'UNSTOP']))
    .optional()
    .default(['LINKEDIN', 'NAUKRI', 'INTERNSHALA', 'UNSTOP']),
});
