import { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { listApplications } from '../../api/jobApi';
import EmptyState from '../../components/common/EmptyState';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  useEffect(() => { listApplications().then((data) => setApplications(data.applications ?? [])).catch(() => {}); }, []);
  const stats = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED'].map((status) => [status, applications.filter((item) => item.status === status).length]);

  return (
    <StudentLayout active="applications" title="Applications">
      <div className="metrics-grid">{stats.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>
      {applications.length ? (
        <div className="table-panel"><table><thead><tr><th>Company</th><th>Position</th><th>Status</th><th>Applied Date</th><th>Source</th></tr></thead><tbody>{applications.map((item) => <tr key={item.id}><td>{item.company}</td><td>{item.title}</td><td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td><td>{new Date(item.appliedAt).toLocaleDateString()}</td><td>{item.source}</td></tr>)}</tbody></table></div>
      ) : <EmptyState title="No applications yet" text="Apply to jobs and they will appear here." />}
    </StudentLayout>
  );
}
