import { prisma } from '../config/prisma.js';

export const jobRepository = {
  findOpenJobs(where, { page, limit }) {
    return Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { applications: true } } },
      }),
      prisma.job.count({ where }),
    ]);
  },

  findInternalMatches(where, take = 12) {
    return prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
    });
  },

  findById(id) {
    return prisma.job.findUnique({ where: { id } });
  },

  findByManager(managerId) {
    return prisma.job.findMany({
      where: { managerId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    });
  },

  create(data) {
    return prisma.job.create({ data });
  },

  update(id, data) {
    return prisma.job.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.job.delete({ where: { id } });
  },
};
