import { useEffect, useState } from 'react';
import HiringManagerLayout from '../../layouts/HiringManagerLayout';
import { listMyJobs } from '../../api/jobApi';
import { useAuth } from '../../context/AuthContext';
import { navigate } from '../../routes/router';
import { BarChart, DonutChart } from '../../components/ui/SimpleChart';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => { listMyJobs().then((data) => setJobs(data.jobs ?? [])).catch(() => {}); }, []);

  const open = jobs.filter((job) => job.status === 'OPEN').length;
  const applicants = jobs.reduce((sum, job) => sum + (job.applicantCount ?? 0), 0);
  const pipelineData = jobs.slice(0, 5).map((job) => ({ label: job.title, value: job.applicantCount ?? 0 }));
  const statusData = [
    { label: 'Open', value: open, tone: 'open' },
    { label: 'Closed', value: jobs.length - open, tone: 'closed' },
  ];

  return (
    <HiringManagerLayout active="dashboard" title="Dashboard">
      <section className="welcome-panel">
        <div><h2>{user.companyName || user.name}</h2><p>Overview of hiring activity and open roles.</p></div>
        <button className="primary" onClick={() => navigate('/manager/my-jobs')}>Create Job</button>
      </section>
      <div className="metrics-grid">
        <article><span>Total Jobs</span><strong>{jobs.length}</strong></article>
        <article><span>Active Jobs</span><strong>{open}</strong></article>
        <article><span>Closed Jobs</span><strong>{jobs.length - open}</strong></article>
        <article><span>Applications Received</span><strong>{applicants}</strong></article>
      </div>
      <div className="two-column">
        <BarChart title="Applicants per Job" data={pipelineData.length ? pipelineData : [{ label: 'No applicants', value: 0 }]} />
        <DonutChart title="Job Status" data={statusData} />
      </div>
      <div className="two-column">
        <section className="panel"><h3>Recent Jobs</h3>{jobs.slice(0, 4).map((job) => <p key={job.id}>{job.title} <span>{job.applicantCount ?? 0} Applicants</span></p>)}</section>
        <section className="panel"><h3>Quick Actions</h3><button onClick={() => navigate('/manager/my-jobs')}>Manage Jobs</button><button onClick={() => navigate('/manager/applicants')}>View Applicants</button></section>
      </div>
    </HiringManagerLayout>
  );
}
