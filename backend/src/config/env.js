import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().trim().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().trim().min(24, 'JWT_SECRET must be at least 24 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(errors)}`);
}

export const env = {
  NODE_ENV: parsedEnv.data.NODE_ENV,
  PORT: parsedEnv.data.PORT,
  CLIENT_ORIGIN: parsedEnv.data.CLIENT_ORIGIN,
  DATABASE_URL: parsedEnv.data.DATABASE_URL,
  JWT_SECRET: parsedEnv.data.JWT_SECRET,
  JWT_EXPIRES_IN: parsedEnv.data.JWT_EXPIRES_IN,
};
