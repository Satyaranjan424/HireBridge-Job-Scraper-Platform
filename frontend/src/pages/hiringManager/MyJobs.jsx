/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import HiringManagerLayout from '../../layouts/HiringManagerLayout';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/ui/Toast';
import { closeJob, createJob, deleteJob, listMyJobs, updateJob } from '../../api/jobApi';
import { normalizeJobPayload, toInputList } from '../../utils/format';
import { navigate } from '../../routes/router';

const emptyJob = {
  title: '',
  company: '',
  location: '',
  employmentType: 'Full-time',
  experience: '',
  salaryRange: '',
  description: '',
  requirements: '',
  applyUrl: '',
};

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await listMyJobs();
    setJobs(data.jobs ?? []);
  }

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = normalizeJobPayload(form);
      if (form.id) await updateJob(form.id, payload);
      else await createJob(payload);
      setForm(emptyJob);
      await load();
      setMessage(form.id ? 'Job updated.' : 'Job posted.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function close(id) {
    await closeJob(id);
    await load();
  }

  async function remove(id) {
    await deleteJob(id);
    await load();
  }

  const open = jobs.filter((job) => job.status === 'OPEN').length;
  const applicants = jobs.reduce((sum, job) => sum + (job.applicantCount ?? 0), 0);

  return (
    <HiringManagerLayout active="my-jobs" title="My Jobs">
      <Toast message={message} onClose={() => setMessage('')} />
      <div className="metrics-grid">
        <article><span>Open Jobs</span><strong>{open}</strong></article>
        <article><span>Closed Jobs</span><strong>{jobs.length - open}</strong></article>
        <article><span>Total Applicants</span><strong>{applicants}</strong></article>
      </div>
      <div className="split-layout">
        <form className="panel form-grid" onSubmit={submit}>
          <h3>{form.id ? 'Edit Job' : 'Create Job'}</h3>
          {['title', 'company', 'location', 'employmentType', 'experience', 'salaryRange', 'applyUrl'].map((field) => <input key={field} placeholder={field} value={form[field] ?? ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}
          <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <input placeholder="Requirements, comma separated" value={form.requirements} onChange={(event) => setForm({ ...form, requirements: event.target.value })} />
          <button className="primary" disabled={loading}>{loading ? 'Saving' : form.id ? 'Update Job' : 'Post Job'}</button>
        </form>
        <section>
          <div className="section-toolbar"><input placeholder="Search jobs" /><select><option>All jobs</option><option>Open</option><option>Closed</option></select></div>
          {jobs.length ? <div className="job-grid compact">{jobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-card-top"><span className={`status ${job.status.toLowerCase()}`}>{job.status}</span><span>{job.applicantCount ?? 0} Applicants</span></div>
              <h3>{job.title}</h3>
              <p>{job.company} - {job.location}</p>
              <div className="actions">
                <button onClick={() => setForm({ ...job, requirements: toInputList(job.requirements) })}>Edit</button>
                <button onClick={() => navigate('/manager/applicants', { jobId: job.id })}>Applicants</button>
                <button onClick={() => close(job.id)}>Close Job</button>
                <button className="danger" onClick={() => remove(job.id)}>Delete</button>
              </div>
            </article>
          ))}</div> : <EmptyState title="No jobs posted" text="Create the first opening to start receiving applicants." />}
        </section>
      </div>
    </HiringManagerLayout>
  );
}
