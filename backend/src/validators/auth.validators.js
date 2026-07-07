import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Enter a valid email').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['STUDENT', 'HIRING_MANAGER']),
    companyName: z.string().trim().max(120).optional(),
    headline: z.string().trim().max(140).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'HIRING_MANAGER' && !data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['companyName'],
        message: 'Company name is required for hiring managers',
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});
