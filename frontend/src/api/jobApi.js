import { api } from './axios';

export function listJobs(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  return api(`/jobs?${params.toString()}`);
}

export function searchExternalJobs({ keyword, location }) {
  const params = new URLSearchParams({
    keyword: keyword || 'graduate',
    location: location || 'Remote',
  });
  return api(`/scrape/jobs?${params.toString()}`);
}

export function listMyJobs() {
  return api('/manager/jobs');
}

export function createJob(payload) {
  return api('/manager/jobs', { method: 'POST', body: payload });
}

export function updateJob(id, payload) {
  return api(`/manager/jobs/${id}`, { method: 'PATCH', body: payload });
}

export function closeJob(id) {
  return api(`/manager/jobs/${id}/close`, { method: 'PATCH' });
}

export function deleteJob(id) {
  return api(`/manager/jobs/${id}`, { method: 'DELETE' });
}

export function applyToJob(payload) {
  return api('/applications', { method: 'POST', body: payload });
}

export function listApplications() {
  return api('/applications');
}

export function saveBookmark(payload) {
  return api('/bookmarks', { method: 'POST', body: payload });
}

export function listBookmarks() {
  return api('/bookmarks');
}

export function listApplicants(jobId) {
  return api(`/manager/jobs/${jobId}/applicants`);
}
