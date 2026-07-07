import { applicationRepository } from '../repositories/application.repository.js';
import { jobRepository } from '../repositories/job.repository.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { applicationStatusSchema, applySchema, bookmarkSchema } from '../validators/application.validators.js';

function getExternalKey(payload) {
  return payload.externalKey || `${payload.source}:${payload.title}:${payload.company}:${payload.location}`.toLowerCase();
}

export async function applyToJob(req, res, next) {
  try {
    const payload = applySchema.parse(req.body);
    let job = null;

    if (payload.jobId) {
      job = await jobRepository.findById(payload.jobId);
      if (!job || job.status !== 'OPEN') {
        throw new ApiError(404, 'Open job not found');
      }
    }

    const application = await applicationRepository.create({
      studentId: req.user.id,
      jobId: payload.jobId,
      externalKey: payload.jobId ? null : getExternalKey(payload),
      title: job?.title ?? payload.title,
      company: job?.company ?? payload.company,
      location: job?.location ?? payload.location,
      source: job?.source ?? payload.source,
      applyUrl: job?.applyUrl ?? payload.applyUrl,
      resumeUrl: payload.resumeUrl || req.user.resumeUrl,
      coverLetter: payload.coverLetter,
    });

    sendSuccess(res, { statusCode: 201, message: 'Application saved successfully', data: { application } });
  } catch (error) {
    next(error);
  }
}

export async function listMyApplications(req, res, next) {
  try {
    const applications = await applicationRepository.findByStudent(req.user.id);
    sendSuccess(res, { message: 'Applications loaded', data: { applications } });
  } catch (error) {
    next(error);
  }
}

export async function listApplicants(req, res, next) {
  try {
    const job = await applicationRepository.findApplicantsForJob(req.params.jobId);

    if (!job || job.managerId !== req.user.id) {
      throw new ApiError(404, 'Job not found');
    }

    sendSuccess(res, { message: 'Applicants loaded', data: { job, applicants: job.applications } });
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = applicationStatusSchema.parse(req.body);
    const application = await applicationRepository.findApplicationForManager(req.params.applicationId);

    if (!application?.job || application.job.managerId !== req.user.id) {
      throw new ApiError(404, 'Application not found');
    }

    const updated = await applicationRepository.updateStatus(req.params.applicationId, status);
    sendSuccess(res, { message: 'Application status updated', data: { application: updated } });
  } catch (error) {
    next(error);
  }
}

export async function saveBookmark(req, res, next) {
  try {
    const payload = bookmarkSchema.parse(req.body);
    const bookmark = await applicationRepository.upsertBookmark({
      where: payload.jobId
        ? { studentId_jobId: { studentId: req.user.id, jobId: payload.jobId } }
        : { studentId_externalKey: { studentId: req.user.id, externalKey: getExternalKey(payload) } },
      create: {
        studentId: req.user.id,
        jobId: payload.jobId,
        externalKey: payload.jobId ? null : getExternalKey(payload),
        title: payload.title,
        company: payload.company,
        location: payload.location,
        source: payload.source,
        applyUrl: payload.applyUrl,
      },
    });
    sendSuccess(res, { statusCode: 201, message: 'Job bookmarked', data: { bookmark } });
  } catch (error) {
    next(error);
  }
}

export async function listBookmarks(req, res, next) {
  try {
    const bookmarks = await applicationRepository.findBookmarks(req.user.id);
    sendSuccess(res, { message: 'Bookmarks loaded', data: { bookmarks } });
  } catch (error) {
    next(error);
  }
}
