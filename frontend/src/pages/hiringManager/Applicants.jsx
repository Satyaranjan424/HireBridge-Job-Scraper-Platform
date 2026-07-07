import { useEffect, useState } from 'react';
import HiringManagerLayout from '../../layouts/HiringManagerLayout';
import EmptyState from '../../components/common/EmptyState';
import { listApplicants, listMyJobs } from '../../api/jobApi';
import { asList } from '../../utils/format';

export default function Applicants() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState('');
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    listMyJobs().then((data) => {
      const nextJobs = data.jobs ?? [];
      setJobs(nextJobs);
      if (nextJobs[0]) selectJob(nextJobs[0].id);
    }).catch(() => {});
  }, []);

  async function selectJob(id) {
    setSelected(id);
    const data = await listApplicants(id);
    setApplicants(data.applicants ?? []);
  }

  return (
    <HiringManagerLayout active="applicants" title="Applicants">
      <section className="panel">
        <label>Select Job</label>
        <select value={selected} onChange={(event) => selectJob(event.target.value)}>
          {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
        </select>
      </section>
      {applicants.length ? (
        <div className="table-panel"><table><thead><tr><th>Student</th><th>Email</th><th>Resume</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead><tbody>{applicants.map((item) => <tr key={item.id}><td><strong>{item.student.name}</strong><span>{asList(item.student.skills).slice(0, 3).join(', ')}</span></td><td>{item.student.email}</td><td>{item.student.resumeUrl ? <a href={item.student.resumeUrl} target="_blank" rel="noreferrer">View Resume</a> : 'Not added'}</td><td>{new Date(item.appliedAt).toLocaleDateString()}</td><td>{item.status}</td><td><button>Shortlist</button><button>Reject</button><button>Later</button></td></tr>)}</tbody></table></div>
      ) : <EmptyState title="No applicants yet" text="Applicants will appear here after students apply to this job." />}
    </HiringManagerLayout>
  );
}
