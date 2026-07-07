import { ApiError } from '../utils/apiError.js';
import { jobRepository } from '../repositories/job.repository.js';

export function normalizeJob(job) {
  return {
    ...job,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    applicantCount: job._count?.applications ?? undefined,
  };
}

export async function searchJobs({ keyword, location, source, page, limit }) {
  const where = {
    status: 'OPEN',
    ...(source !== 'ALL' ? { source } : {}),
    ...(keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { company: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
  };

  const [jobs, total] = await jobRepository.findOpenJobs(where, { page, limit });
  return {
    jobs: jobs.map(normalizeJob),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  };
}

export function listManagerJobs(managerId) {
  return jobRepository.findByManager(managerId).then((jobs) => jobs.map(normalizeJob));
}

export function createManagerJob(managerId, payload) {
  return jobRepository
    .create({
      ...payload,
      requirements: payload.requirements ?? [],
      source: 'INTERNAL',
      managerId,
    })
    .then(normalizeJob);
}

export async function updateManagerJob(managerId, jobId, payload) {
  const existing = await jobRepository.findById(jobId);
  if (!existing || existing.managerId !== managerId) {
    throw new ApiError(404, 'Job not found');
  }

  const job = await jobRepository.update(jobId, {
    ...payload,
    requirements: payload.requirements ?? undefined,
  });
  return normalizeJob(job);
}

export async function deleteManagerJob(managerId, jobId) {
  const existing = await jobRepository.findById(jobId);
  if (!existing || existing.managerId !== managerId) {
    throw new ApiError(404, 'Job not found');
  }

  await jobRepository.delete(jobId);
}

export function closeManagerJob(managerId, jobId) {
  return updateManagerJob(managerId, jobId, { status: 'CLOSED' });
}
