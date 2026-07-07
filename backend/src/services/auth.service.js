import bcrypt from 'bcrypt';
import { ApiError } from '../utils/apiError.js';
import { signAccessToken } from '../utils/auth.js';
import { sanitizeUser } from '../utils/sanitizeUser.js';
import { userRepository } from '../repositories/user.repository.js';

export async function registerUser(payload) {
  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await userRepository.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
    role: payload.role,
    companyName: payload.role === 'HIRING_MANAGER' ? payload.companyName : null,
    headline: payload.headline,
  });

  const token = signAccessToken(user);
  return { token, user: sanitizeUser(user) };
}

export async function loginUser(payload) {
  const user = await userRepository.findByEmail(payload.email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signAccessToken(user);
  return { token, user: sanitizeUser(user) };
}
