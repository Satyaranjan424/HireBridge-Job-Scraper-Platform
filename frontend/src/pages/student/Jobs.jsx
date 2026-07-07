/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import JobCard from '../../components/jobs/JobCard';
import EmptyState from '../../components/common/EmptyState';
import { applyToJob, listApplications, listBookmarks, listJobs, saveBookmark, searchExternalJobs } from '../../api/jobApi';
import { normalizeExternalJob } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/ui/Toast';

export default function StudentJobs() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ keyword: '', location: '', source: 'ALL', experience: '', employmentType: '', salary: '', sort: 'Newest', page: 1, limit: 8 });
  const [jobs, setJobs] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(next = filters) {
    setLoading(true);
    try {
      const data = next.source === 'ALL' && (next.keyword || next.location)
        ? await searchExternalJobs(next)
        : await listJobs(next);
      setJobs(data.jobs ?? []);
      setPlatforms(data.platforms ?? []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function apply(job) {
    try {
      const payload = job.source === 'INTERNAL' && job.id
        ? { jobId: job.id, resumeUrl: user.resumeUrl, coverLetter: `I am interested in ${job.title}.` }
        : { ...normalizeExternalJob(job), resumeUrl: user.resumeUrl };
      await applyToJob(payload);
      await listApplications();
      setMessage('Application saved.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function bookmark(job) {
    try {
      const payload = job.source === 'INTERNAL' && job.id ? { jobId: job.id, ...job } : normalizeExternalJob(job);
      await saveBookmark(payload);
      await listBookmarks();
      setMessage('Job bookmarked.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <StudentLayout active="jobs" title="Jobs">
      <Toast message={message} onClose={() => setMessage('')} />
      <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); load({ ...filters, page: 1 }); }}>
        <input placeholder="Search by keyword" value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} />
        <input placeholder="Location" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} />
        <select value={filters.source} onChange={(event) => setFilters({ ...filters, source: event.target.value })}>
          {['ALL', 'INTERNAL', 'LINKEDIN', 'NAUKRI', 'INTERNSHALA', 'UNSTOP'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <input placeholder="Experience" value={filters.experience} onChange={(event) => setFilters({ ...filters, experience: event.target.value })} />
        <select value={filters.employmentType} onChange={(event) => setFilters({ ...filters, employmentType: event.target.value })}>
          <option value="">Employment Type</option>
          <option>Full-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
        <input placeholder="Salary" value={filters.salary} onChange={(event) => setFilters({ ...filters, salary: event.target.value })} />
        <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
          <option>Newest</option>
          <option>Salary</option>
          <option>Company</option>
        </select>
        <button className="primary" disabled={loading}>{loading ? 'Searching' : 'Search'}</button>
      </form>
      {jobs.length ? <div className="job-grid">{jobs.map((job) => <JobCard key={job.id || job.externalKey} job={job} onApply={apply} onBookmark={bookmark} />)}</div> : <EmptyState title="No jobs found" text="Try a broader keyword or search internal jobs." />}
      {platforms.length > 0 && <section className="panel platform-links"><h3>Source Platforms</h3>{platforms.map((link) => <a key={link.platform} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}</section>}
    </StudentLayout>
  );
}
