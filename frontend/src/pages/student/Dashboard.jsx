import { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { listApplications, listBookmarks, listJobs } from '../../api/jobApi';
import { completion } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { navigate } from '../../routes/router';
import { BarChart, DonutChart } from '../../components/ui/SimpleChart';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ jobs: [], applications: [], bookmarks: [] });

  useEffect(() => {
    Promise.all([listJobs({ limit: 3 }), listApplications(), listBookmarks()])
      .then(([jobData, appData, bookmarkData]) => setData({
        jobs: jobData.jobs ?? [],
        applications: appData.applications ?? [],
        bookmarks: bookmarkData.bookmarks ?? [],
      }))
      .catch(() => {});
  }, []);

  const reviewing = data.applications.filter((item) => item.status === 'REVIEWING').length;
  const shortlisted = data.applications.filter((item) => item.status === 'SHORTLISTED').length;
  const statusData = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED'].map((status) => ({
    label: status,
    value: data.applications.filter((item) => item.status === status).length,
    tone: status.toLowerCase(),
  }));
  const activityData = [
    { label: 'Applications', value: data.applications.length },
    { label: 'Bookmarks', value: data.bookmarks.length },
    { label: 'Recommended Jobs', value: data.jobs.length },
  ];

  return (
    <StudentLayout active="dashboard" title="Dashboard">
      <section className="welcome-panel">
        <div><h2>Hello, {user.name}</h2><p>Find your next opportunity today.</p></div>
        <strong>{completion(user, user.role)}% Profile</strong>
      </section>
      <div className="metrics-grid">
        <article><span>Applied Jobs</span><strong>{data.applications.length}</strong></article>
        <article><span>Saved Jobs</span><strong>{data.bookmarks.length}</strong></article>
        <article><span>Open Applications</span><strong>{reviewing}</strong></article>
        <article><span>Interview Calls</span><strong>{shortlisted}</strong></article>
      </div>
      <div className="two-column">
        <BarChart title="Activity Graph" data={activityData} />
        <DonutChart title="Application Status" data={statusData} />
      </div>
      <div className="two-column">
        <section className="panel"><h3>Recent Applications</h3>{data.applications.slice(0, 3).map((item) => <p key={item.id}>{item.company} <span>{item.status}</span></p>)}</section>
        <section className="panel"><h3>Recommended Jobs</h3>{data.jobs.map((job) => <p key={job.id}>{job.title} <span>{job.company}</span></p>)}<button onClick={() => navigate('/student/jobs')}>View All</button></section>
      </div>
    </StudentLayout>
  );
}
