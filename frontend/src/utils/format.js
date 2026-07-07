export function asList(value) {
  if (Array.isArray(value)) return value;
  return value ? String(value).split(',').map((item) => item.trim()).filter(Boolean) : [];
}

export function toInputList(value) {
  return asList(value).join(', ');
}

export function normalizeJobPayload(job) {
  const description = job.description?.trim();
  return {
    ...job,
    description: description && description.length >= 20
      ? description
      : `${job.title || 'This role'} at ${job.company || 'the company'} is open for motivated candidates with relevant skills and strong ownership.`,
    requirements: asList(job.requirements),
  };
}

export function normalizeExternalJob(job) {
  return {
    externalKey: job.externalKey || `${job.source}:${job.title}:${job.company}:${job.location}`.toLowerCase(),
    title: job.title,
    company: job.company,
    location: job.location,
    source: job.source || 'LINKEDIN',
    applyUrl: job.applyUrl,
  };
}

export function completion(profile, role) {
  const fields = role === 'HIRING_MANAGER'
    ? ['name', 'email', 'phone', 'headline', 'location', 'bio', 'companyName', 'companySite']
    : ['name', 'email', 'phone', 'headline', 'location', 'bio', 'skills', 'resumeUrl'];
  const done = fields.filter((field) => {
    const value = profile?.[field];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;
  return Math.round((done / fields.length) * 100);
}
