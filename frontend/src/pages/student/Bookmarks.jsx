import { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import EmptyState from '../../components/common/EmptyState';
import JobCard from '../../components/jobs/JobCard';
import { applyToJob, listBookmarks } from '../../api/jobApi';
import { normalizeExternalJob } from '../../utils/format';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => { listBookmarks().then((data) => setBookmarks(data.bookmarks ?? [])).catch(() => {}); }, []);

  async function apply(job) {
    await applyToJob(job.jobId ? { jobId: job.jobId } : normalizeExternalJob(job));
  }

  return (
    <StudentLayout active="bookmarks" title="Bookmarks">
      <div className="section-toolbar"><input placeholder="Search saved jobs" /><select><option>Newest saved</option><option>Company</option></select></div>
      {bookmarks.length ? <div className="job-grid">{bookmarks.map((job) => <JobCard key={job.id} job={job} onApply={apply} onBookmark={() => {}} />)}</div> : <EmptyState title="No saved jobs" text="Bookmark roles from the jobs page to build your shortlist." />}
    </StudentLayout>
  );
}
