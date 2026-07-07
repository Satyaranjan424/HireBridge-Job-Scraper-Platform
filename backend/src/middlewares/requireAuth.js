import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/auth.js';

export async function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.hirebridge_token;

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, 'Invalid or expired token'));
  }
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const allowed = allowedRoles.flat().map((role) => String(role).toUpperCase());
    const userRole = String(req.user.role).toUpperCase();

    if (!allowed.includes(userRole)) {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }

    return next();
  };
}

export const verifyToken = requireAuth;
export const authorize = requireRole;
