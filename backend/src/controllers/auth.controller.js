import { sanitizeUser } from '../utils/sanitizeUser.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import { loginSchema, signupSchema } from '../validators/auth.validators.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function signup(req, res, next) {
  try {
    const payload = signupSchema.parse(req.body);
    const { token, user } = await registerUser(payload);

    res.cookie('hirebridge_token', token, cookieOptions);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Signup successful',
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const { token, user } = await loginUser(payload);

    res.cookie('hirebridge_token', token, cookieOptions);
    return sendSuccess(res, {
      message: 'Login successful',
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
}

export function logout(_req, res) {
  res.clearCookie('hirebridge_token', cookieOptions);
  return sendSuccess(res, { message: 'Logout successful' });
}

export function getCurrentUser(req, res) {
  return sendSuccess(res, { message: 'Authenticated user loaded', data: { user: sanitizeUser(req.user) } });
}
