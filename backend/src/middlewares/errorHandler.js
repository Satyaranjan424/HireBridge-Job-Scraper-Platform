import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
      target: error.meta?.target,
    });
  }

  const statusCode = error.statusCode ?? 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message ?? 'Internal server error',
    details: error.details ?? undefined,
  });
}
