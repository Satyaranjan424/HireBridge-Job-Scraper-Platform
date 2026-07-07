import { prisma } from '../config/prisma.js';

export const userRepository = {
  create(data) {
    return prisma.user.create({ data });
  },

  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id, options = {}) {
    return prisma.user.findUnique({ where: { id }, ...options });
  },

  update(id, data) {
    return prisma.user.update({ where: { id }, data });
  },
};
