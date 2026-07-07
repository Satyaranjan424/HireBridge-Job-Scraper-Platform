import Pill from '../ui/Pill';
import { asList } from '../../utils/format';

export default function JobCard({ job, onApply, onBookmark, onDetails }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <Pill tone={job.source === 'INTERNAL' ? 'green' : 'blue'}>{job.source || 'INTERNAL'}</Pill>
        <span>{job.employmentType || 'Full-time'}</span>
      </div>
      <h3>{job.title}</h3>
      <dl className="job-facts">
        <div><dt>Company</dt><dd>{job.company}</dd></div>
        <div><dt>Location</dt><dd>{job.location}</dd></div>
        <div><dt>Platform</dt><dd>{job.source || 'INTERNAL'}</dd></div>
        <div><dt>Experience</dt><dd>{job.experience || 'Flexible'}</dd></div>
        <div><dt>Salary</dt><dd>{job.salaryRange || 'Undisclosed'}</dd></div>
      </dl>
      <div className="tag-row">{asList(job.requirements).slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="actions">
        {onDetails && <button onClick={() => onDetails(job)}>View Details</button>}
        <button onClick={() => onBookmark(job)}>Bookmark</button>
        <button className="primary" onClick={() => onApply(job)}>Apply</button>
      </div>
    </article>
  );
}
