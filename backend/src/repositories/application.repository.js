import { prisma } from '../config/prisma.js';

export const applicationRepository = {
  create(data) {
    return prisma.application.create({ data });
  },

  findByStudent(studentId) {
    return prisma.application.findMany({
      where: { studentId },
      orderBy: { appliedAt: 'desc' },
      include: { job: true },
    });
  },

  findApplicantsForJob(jobId) {
    return prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          orderBy: { appliedAt: 'desc' },
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                headline: true,
                skills: true,
                resumeUrl: true,
                location: true,
              },
            },
          },
        },
      },
    });
  },

  findApplicationForManager(applicationId) {
    return prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });
  },

  updateStatus(id, status) {
    return prisma.application.update({ where: { id }, data: { status } });
  },

  upsertBookmark({ where, create }) {
    return prisma.bookmark.upsert({ where, update: {}, create });
  },

  findBookmarks(studentId) {
    return prisma.bookmark.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: { job: true },
    });
  },
};
