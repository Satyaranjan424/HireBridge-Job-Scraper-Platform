import { sendSuccess } from '../utils/apiResponse.js';
import {
  closeManagerJob,
  createManagerJob,
  deleteManagerJob,
  listManagerJobs,
  searchJobs,
  updateManagerJob,
} from '../services/job.service.js';
import { jobSchema, jobSearchSchema, jobUpdateSchema } from '../validators/job.validators.js';

export async function listJobs(req, res, next) {
  try {
    const query = jobSearchSchema.parse(req.query);
    const result = await searchJobs(query);
    sendSuccess(res, { message: 'Jobs loaded', data: result });
  } catch (error) {
    next(error);
  }
}

export async function listMyJobs(req, res, next) {
  try {
    const jobs = await listManagerJobs(req.user.id);
    sendSuccess(res, { message: 'Manager jobs loaded', data: { jobs } });
  } catch (error) {
    next(error);
  }
}

export async function createJob(req, res, next) {
  try {
    const payload = jobSchema.parse(req.body);
    const job = await createManagerJob(req.user.id, payload);
    sendSuccess(res, { statusCode: 201, message: 'Job posted successfully', data: { job } });
  } catch (error) {
    next(error);
  }
}

export async function updateJob(req, res, next) {
  try {
    const payload = jobUpdateSchema.parse(req.body);
    const job = await updateManagerJob(req.user.id, req.params.jobId, payload);
    sendSuccess(res, { message: 'Job updated successfully', data: { job } });
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(req, res, next) {
  try {
    await deleteManagerJob(req.user.id, req.params.jobId);
    sendSuccess(res, { message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function closeJob(req, res, next) {
  try {
    const job = await closeManagerJob(req.user.id, req.params.jobId);
    sendSuccess(res, { message: 'Job closed successfully', data: { job } });
  } catch (error) {
    next(error);
  }
}
