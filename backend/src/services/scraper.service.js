import { JOB_SOURCES } from '../constants/roles.js';
import { jobRepository } from '../repositories/job.repository.js';

const platformHosts = {
  [JOB_SOURCES.LINKEDIN]: 'https://www.linkedin.com/jobs/search/',
  [JOB_SOURCES.NAUKRI]: 'https://www.naukri.com/jobs-in-',
  [JOB_SOURCES.INTERNSHALA]: 'https://internshala.com/jobs/',
  [JOB_SOURCES.UNSTOP]: 'https://unstop.com/jobs',
};

function buildPlatformSearch(platform, keyword, location) {
  const encodedKeyword = encodeURIComponent(keyword);
  const encodedLocation = encodeURIComponent(location);
  const links = {
    [JOB_SOURCES.LINKEDIN]: `${platformHosts[JOB_SOURCES.LINKEDIN]}?keywords=${encodedKeyword}&location=${encodedLocation}`,
    [JOB_SOURCES.NAUKRI]: `${platformHosts[JOB_SOURCES.NAUKRI]}${encodedLocation}?k=${encodedKeyword}`,
    [JOB_SOURCES.INTERNSHALA]: `${platformHosts[JOB_SOURCES.INTERNSHALA]}${encodedKeyword}-jobs-in-${encodedLocation}/`,
    [JOB_SOURCES.UNSTOP]: `${platformHosts[JOB_SOURCES.UNSTOP]}?searchTerm=${encodedKeyword}&location=${encodedLocation}`,
  };

  return {
    platform,
    label: platform.replace('_', ' '),
    url: links[platform],
  };
}

function mockExternalJobs(keyword, location, platforms) {
  return platforms.map((platform, index) => ({
    id: `${platform.toLowerCase()}-${keyword.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    externalKey: `${platform}:${keyword}:${location}:${index}`.toLowerCase(),
    title: `${keyword} ${index % 2 === 0 ? 'Associate' : 'Intern'}`,
    company: ['TalentWorks', 'CampusLabs', 'SkillForge', 'LaunchGrid'][index % 4],
    location,
    description: `Curated ${platform} lead for ${keyword} roles. Open the source link to verify current availability and apply on the platform.`,
    requirements: ['Communication', 'Problem solving', keyword],
    employmentType: index % 2 === 0 ? 'Full-time' : 'Internship',
    salaryRange: 'Platform disclosed',
    experience: index % 2 === 0 ? '0-2 years' : 'Fresher',
    source: platform,
    applyUrl: buildPlatformSearch(platform, keyword, location).url,
    status: 'OPEN',
    platform,
  }));
}

export async function searchPlatformJobs({ keyword, location, platforms }) {
  const internalJobs = await jobRepository.findInternalMatches({
    status: 'OPEN',
    source: 'INTERNAL',
    OR: [
      { title: { contains: keyword, mode: 'insensitive' } },
      { company: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
    ],
    ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
  });

  const normalizedLocation = location || 'Remote';
  return {
    jobs: [
      ...internalJobs.map((job) => ({ ...job, platform: 'HireBridge', requirements: job.requirements ?? [] })),
      ...mockExternalJobs(keyword, normalizedLocation, platforms),
    ],
    platforms: platforms.map((platform) => buildPlatformSearch(platform, keyword, normalizedLocation)),
  };
}
