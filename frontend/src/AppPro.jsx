/* eslint-disable */
import { useEffect, useMemo, useState } from 'react';
import './AppPro.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const PAGE_SIZE = 6;
const sources = ['ALL', 'INTERNAL', 'LINKEDIN', 'NAUKRI', 'INTERNSHALA', 'UNSTOP'];

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

function token() {
  return localStorage.getItem('hirebridge_token');
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? 'Request failed');
  return payload.data ?? payload;
}

function list(value) {
  if (Array.isArray(value)) return value;
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
}

function Pill({ children, tone = '' }) {
  return <span className={`hb-pill ${tone}`}>{children}</span>;
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="hb-toast">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss">x</button>
    </div>
  );
}

function Empty({ title, text }) {
  return (
    <section className="hb-empty">
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}

function Skeleton() {
  return (
    <div className="hb-jobs">
      {Array.from({ length: 4 }).map((_, index) => (
        <article className="hb-job hb-skeleton" key={index}>
          <span />
          <strong />
          <p />
          <p />
        </article>
      ))}
    </div>
  );
}

export default function AppPro() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [navOpen, setNavOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [auth, setAuth] = useState({ name: '', email: '', password: '', role: 'STUDENT', companyName: '', headline: '' });
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [profile, setProfile] = useState(null);
  const [filters, setFilters] = useState({ keyword: '', location: '', source: 'ALL', page: 1 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [toast, setToast] = useState('');

  const isManager = user?.role === 'HIRING_MANAGER';
  const isStudent = user?.role === 'STUDENT';
  const nav = useMemo(
    () =>
      isManager
        ? [['dashboard', 'Dashboard'], ['manage', 'Manage Jobs'], ['applicants', 'Applicants'], ['profile', 'Profile']]
        : [['dashboard', 'Dashboard'], ['jobs', 'Jobs'], ['applications', 'Applications'], ['bookmarks', 'Bookmarks'], ['profile', 'Profile']],
    [isManager],
  );

  function notify(message) {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(''), 3500);
  }

  async function loadMe() {
    try {
      if (!token()) return;
      const data = await api('/auth/me');
      setUser(data.user);
      setProfile(data.user);
    } catch {
      localStorage.removeItem('hirebridge_token');
    } finally {
      setBooting(false);
    }
  }

  async function loadStudent(nextFilters = filters) {
    const params = new URLSearchParams({
      keyword: nextFilters.keyword,
      location: nextFilters.location,
      source: nextFilters.source,
      page: String(nextFilters.page),
      limit: String(PAGE_SIZE),
    });
    const [jobData, appData, bookmarkData] = await Promise.all([
      api(`/jobs?${params.toString()}`),
      api('/applications'),
      api('/bookmark'),
    ]);
    setJobs(jobData.jobs ?? []);
    setApplications(appData.applications ?? []);
    setBookmarks(bookmarkData.bookmarks ?? []);
    setPagination(jobData.pagination ?? { page: 1, pages: 1, total: jobData.jobs?.length ?? 0 });
  }

  async function loadManager() {
    const data = await api('/jobs/my');
    setMyJobs(data.jobs ?? []);
    if (!selectedJob && data.jobs?.[0]) setSelectedJob(data.jobs[0]);
  }

  async function refresh(nextFilters = filters) {
    if (!user) return;
    setLoading(true);
    try {
      if (isManager) await loadManager();
      if (isStudent) await loadStudent(nextFilters);
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    refresh();
  }, [user]);

  async function submitAuth(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = authMode === 'login' ? { email: auth.email, password: auth.password } : auth;
      const data = await api(`/auth/${authMode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem('hirebridge_token', data.token);
      setUser(data.user);
      setProfile(data.user);
      setView('dashboard');
      notify(authMode === 'login' ? 'Welcome back.' : 'Account created.');
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('hirebridge_token');
    setUser(null);
    setView('dashboard');
  }

  async function search(event, page = 1) {
    event?.preventDefault();
    const next = { ...filters, page };
    setFilters(next);
    setLoading(true);
    try {
      if (next.source === 'ALL') {
        const params = new URLSearchParams({ keyword: next.keyword || 'graduate', location: next.location || 'Remote' });
        const data = await api(`/scrape/jobs?${params.toString()}`);
        setJobs(data.jobs ?? []);
        setPlatforms(data.platforms ?? []);
        setPagination({ page: 1, pages: 1, total: data.jobs?.length ?? 0 });
      } else {
        await loadStudent(next);
        setPlatforms([]);
      }
      notify('Search results updated.');
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function apply(job) {
    try {
      if (job.source === 'INTERNAL' && job.id) {
        await api(`/jobs/${job.id}/apply`, { method: 'POST', body: JSON.stringify({ coverLetter: '' }) });
      } else {
        await api('/applications', {
          method: 'POST',
          body: JSON.stringify({
            externalKey: job.externalKey,
            title: job.title,
            company: job.company,
            location: job.location,
            source: job.source,
            applyUrl: job.applyUrl,
            resumeUrl: user.resumeUrl,
          }),
        });
      }
      const data = await api('/applications');
      setApplications(data.applications ?? []);
      notify('Application saved to tracker.');
    } catch (error) {
      notify(error.message);
    }
  }

  async function bookmark(job) {
    try {
      await api('/bookmark', {
        method: 'POST',
        body: JSON.stringify({
          jobId: job.source === 'INTERNAL' ? job.id : undefined,
          externalKey: job.externalKey,
          title: job.title,
          company: job.company,
          location: job.location,
          source: job.source,
          applyUrl: job.applyUrl,
        }),
      });
      const data = await api('/bookmark');
      setBookmarks(data.bookmarks ?? []);
      notify('Job saved.');
    } catch (error) {
      notify(error.message);
    }
  }

  async function saveJob(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = { ...jobForm, requirements: list(jobForm.requirements) };
      if (jobForm.id) {
        await api(`/jobs/${jobForm.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        notify('Job updated.');
      } else {
        await api('/jobs', { method: 'POST', body: JSON.stringify(payload) });
        notify('Job posted.');
      }
      setJobForm(emptyJob);
      await loadManager();
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function closeJob(id) {
    await api(`/jobs/${id}/close`, { method: 'PATCH' });
    await loadManager();
    notify('Job closed.');
  }

  async function deleteJob(id) {
    await api(`/jobs/${id}`, { method: 'DELETE' });
    await loadManager();
    notify('Job deleted.');
  }

  async function loadApplicants(job) {
    setSelectedJob(job);
    setView('applicants');
    setLoading(true);
    try {
      const data = await api(`/jobs/${job.id}/applicants`);
      setApplicants(data.applicants ?? []);
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    try {
      const payload = { ...profile, skills: typeof profile.skills === 'string' ? list(profile.skills) : profile.skills };
      const data = await api('/profile', { method: 'PUT', body: JSON.stringify(payload) });
      setUser(data.user);
      setProfile(data.user);
      notify('Profile updated.');
    } catch (error) {
      notify(error.message);
    }
  }

  if (booting) {
    return <main className="hb-loading"><div className="hb-spinner" /><p>Preparing HireBridge</p></main>;
  }

  if (!user) {
    return (
      <main className="hb-auth">
        <Toast message={toast} onClose={() => setToast('')} />
        <section className="hb-auth-hero">
          <div className="hb-auth-copy">
            <Pill>Real job workspace</Pill>
            <h1>HireBridge</h1>
            <p>Search roles, track applications, save opportunities, and manage hiring pipelines from one focused platform.</p>
            <div className="hb-stat-strip">
              <span><strong>4</strong> sources</span>
              <span><strong>JWT</strong> auth</span>
              <span><strong>RBAC</strong> access</span>
            </div>
          </div>
          <form className="hb-auth-card" onSubmit={submitAuth}>
            <div className="hb-segmented">
              <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
              <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button>
            </div>
            {authMode === 'register' && (
              <>
                <input placeholder="Full name" value={auth.name} onChange={(event) => setAuth({ ...auth, name: event.target.value })} />
                <select value={auth.role} onChange={(event) => setAuth({ ...auth, role: event.target.value })}>
                  <option value="STUDENT">Student</option>
                  <option value="HIRING_MANAGER">Hiring Manager</option>
                </select>
                {auth.role === 'HIRING_MANAGER' && <input placeholder="Company name" value={auth.companyName} onChange={(event) => setAuth({ ...auth, companyName: event.target.value })} />}
                <input placeholder="Headline" value={auth.headline} onChange={(event) => setAuth({ ...auth, headline: event.target.value })} />
              </>
            )}
            <input placeholder="Email" value={auth.email} onChange={(event) => setAuth({ ...auth, email: event.target.value })} />
            <input type="password" placeholder="Password" value={auth.password} onChange={(event) => setAuth({ ...auth, password: event.target.value })} />
            <button className="hb-primary" disabled={loading}>{loading ? 'Please wait' : authMode === 'login' ? 'Login' : 'Create account'}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="hb-shell">
      <Toast message={toast} onClose={() => setToast('')} />
      <aside className={navOpen ? 'open' : ''}>
        <h2>HireBridge</h2>
        <Pill tone="dark">{isManager ? 'Hiring Manager' : 'Student'}</Pill>
        <p>{isManager ? user.companyName || 'Hiring team' : user.headline || 'Job seeker'}</p>
        <nav>
          {nav.map(([key, label]) => (
            <button key={key} className={view === key ? 'active' : ''} onClick={() => { setView(key); setNavOpen(false); }}>{label}</button>
          ))}
        </nav>
        <button className="hb-ghost" onClick={logout}>Logout</button>
      </aside>

      <section className="hb-workspace">
        <header className="hb-topbar">
          <button className="hb-menu" onClick={() => setNavOpen((value) => !value)}>Menu</button>
          <div>
            <Pill>{isManager ? 'Recruiting' : 'Job hunting'}</Pill>
            <h1>{titleFor(view, isManager)}</h1>
          </div>
          <div className="hb-user-chip"><span>{user.name}</span><strong>{user.email}</strong></div>
        </header>

        {view === 'dashboard' && <Dashboard isManager={isManager} user={user} jobs={isManager ? myJobs : jobs} applications={applications} bookmarks={bookmarks} onStart={() => setView(isManager ? 'manage' : 'jobs')} />}
        {isStudent && view === 'jobs' && <Jobs filters={filters} setFilters={setFilters} jobs={jobs} platforms={platforms} loading={loading} pagination={pagination} onSearch={search} onApply={apply} onBookmark={bookmark} selectedJob={selectedJob} setSelectedJob={setSelectedJob} />}
        {isStudent && view === 'applications' && <Applications applications={applications} />}
        {isStudent && view === 'bookmarks' && <Bookmarks bookmarks={bookmarks} onApply={apply} />}
        {isManager && view === 'manage' && <ManageJobs jobForm={jobForm} setJobForm={setJobForm} jobs={myJobs} loading={loading} onSave={saveJob} onApplicants={loadApplicants} onClose={closeJob} onDelete={deleteJob} />}
        {isManager && view === 'applicants' && <Applicants jobs={myJobs} selectedJob={selectedJob} applicants={applicants} loading={loading} onSelect={loadApplicants} />}
        {view === 'profile' && <Profile profile={profile} setProfile={setProfile} role={user.role} onSubmit={saveProfile} />}
      </section>
    </main>
  );
}

function titleFor(view, isManager) {
  return {
    dashboard: isManager ? 'Hiring command center' : 'Your job hunt cockpit',
    jobs: 'Find the right role',
    applications: 'Application tracker',
    bookmarks: 'Saved opportunities',
    manage: 'Manage jobs',
    applicants: 'Applicant pipeline',
    profile: 'Professional profile',
  }[view];
}

function Dashboard({ isManager, user, jobs, applications, bookmarks, onStart }) {
  const openJobs = jobs.filter((job) => job.status !== 'CLOSED').length;
  const applicants = jobs.reduce((sum, job) => sum + (job.applicantCount ?? 0), 0);
  const stats = isManager
    ? [['Open jobs', openJobs], ['Applicants', applicants], ['Closed jobs', jobs.length - openJobs]]
    : [['Matching roles', jobs.length], ['Applications', applications.length], ['Bookmarks', bookmarks.length]];

  return (
    <section className="hb-dashboard">
      <div className="hb-hero-panel">
        <Pill>{isManager ? 'Recruiting workspace' : 'Student workspace'}</Pill>
        <h2>{isManager ? user.companyName || user.name : `Welcome, ${user.name}`}</h2>
        <p>{isManager ? 'Post roles, review candidates, and manage your hiring pipeline.' : 'Search across internal and partner job sources, then keep every opportunity organized.'}</p>
        <button className="hb-primary" onClick={onStart}>{isManager ? 'Post or manage jobs' : 'Search jobs'}</button>
      </div>
      <div className="hb-metrics">
        {stats.map(([label, value]) => <article className="hb-metric" key={label}><span>{label}</span><strong>{value}</strong></article>)}
      </div>
    </section>
  );
}

function Jobs({ filters, setFilters, jobs, platforms, loading, pagination, onSearch, onApply, onBookmark, selectedJob, setSelectedJob }) {
  return (
    <>
      <form className="hb-search" onSubmit={onSearch}>
        <input value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} placeholder="Keyword, skill, company" />
        <input value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Location or remote" />
        <select value={filters.source} onChange={(event) => setFilters({ ...filters, source: event.target.value })}>
          {sources.map((source) => <option key={source}>{source}</option>)}
        </select>
        <button className="hb-primary" disabled={loading}>Search</button>
      </form>
      {loading ? <Skeleton /> : <JobGrid jobs={jobs} onApply={onApply} onBookmark={onBookmark} onDetails={setSelectedJob} />}
      {pagination.pages > 1 && <div className="hb-pagination"><button disabled={pagination.page <= 1} onClick={() => onSearch(null, pagination.page - 1)}>Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button disabled={pagination.page >= pagination.pages} onClick={() => onSearch(null, pagination.page + 1)}>Next</button></div>}
      {platforms.length > 0 && <section className="hb-platforms"><h3>Verify live postings on source platforms</h3><div>{platforms.map((link) => <a key={link.platform} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}</div></section>}
      <JobDrawer job={selectedJob} onClose={() => setSelectedJob(null)} onApply={onApply} onBookmark={onBookmark} />
    </>
  );
}

function JobGrid({ jobs, onApply, onBookmark, onDetails }) {
  if (!jobs.length) return <Empty title="No jobs found" text="Try a broader keyword or location, then search again." />;
  return (
    <div className="hb-jobs">
      {jobs.map((job) => (
        <article className="hb-job" key={job.id || job.externalKey}>
          <div className="hb-job-top"><Pill tone={job.source === 'INTERNAL' ? '' : 'blue'}>{job.source}</Pill><span>{job.employmentType || 'Role'}</span></div>
          <h3>{job.title}</h3>
          <p>{job.company} - {job.location}</p>
          <p>{job.experience || 'Experience flexible'} | {job.salaryRange || 'Salary undisclosed'}</p>
          <div className="hb-tags">{list(job.requirements).slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div>
          <div className="hb-actions"><button onClick={() => onDetails(job)}>Details</button><button onClick={() => onBookmark(job)}>Save</button><button className="hb-primary" onClick={() => onApply(job)}>Apply</button></div>
        </article>
      ))}
    </div>
  );
}

function JobDrawer({ job, onClose, onApply, onBookmark }) {
  if (!job) return null;
  return (
    <div className="hb-drawer-bg" onClick={onClose}>
      <aside className="hb-drawer" onClick={(event) => event.stopPropagation()}>
        <button className="hb-drawer-close" onClick={onClose}>Close</button>
        <Pill>{job.source}</Pill>
        <h2>{job.title}</h2>
        <p>{job.company} - {job.location}</p>
        <div className="hb-detail-grid"><span>{job.employmentType || 'Role'}</span><span>{job.experience || 'Experience flexible'}</span><span>{job.salaryRange || 'Salary undisclosed'}</span></div>
        <h3>Description</h3>
        <p>{job.description}</p>
        <h3>Requirements</h3>
        <div className="hb-tags">{list(job.requirements).map((item) => <span key={item}>{item}</span>)}</div>
        <div className="hb-actions"><button onClick={() => onBookmark(job)}>Save</button><button className="hb-primary" onClick={() => onApply(job)}>Apply</button>{job.applyUrl && <a href={job.applyUrl} target="_blank" rel="noreferrer">Open source</a>}</div>
      </aside>
    </div>
  );
}

function Applications({ applications }) {
  if (!applications.length) return <Empty title="No applications yet" text="Apply to roles from the jobs page and they will appear here." />;
  return <div className="hb-timeline">{applications.map((item) => <article className="hb-timeline-item" key={item.id}><Pill tone="blue">{item.status}</Pill><h3>{item.title}</h3><p>{item.company} - {item.location}</p><span>Applied {new Date(item.appliedAt).toLocaleDateString()}</span></article>)}</div>;
}

function Bookmarks({ bookmarks, onApply }) {
  if (!bookmarks.length) return <Empty title="No saved jobs" text="Bookmark roles to build a shortlist before applying." />;
  return <div className="hb-jobs">{bookmarks.map((item) => <article className="hb-job" key={item.id}><Pill>{item.source}</Pill><h3>{item.title}</h3><p>{item.company} - {item.location}</p><button className="hb-primary" onClick={() => onApply(item)}>Apply</button></article>)}</div>;
}

function ManageJobs({ jobForm, setJobForm, jobs, loading, onSave, onApplicants, onClose, onDelete }) {
  return (
    <div className="hb-split">
      <form className="hb-panel hb-form" onSubmit={onSave}>
        <h3>{jobForm.id ? 'Edit job' : 'Post a job'}</h3>
        {['title', 'company', 'location', 'employmentType', 'experience', 'salaryRange', 'applyUrl'].map((field) => <input key={field} placeholder={field} value={jobForm[field] ?? ''} onChange={(event) => setJobForm({ ...jobForm, [field]: event.target.value })} />)}
        <textarea placeholder="Description" value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} />
        <input placeholder="Requirements, comma separated" value={jobForm.requirements} onChange={(event) => setJobForm({ ...jobForm, requirements: event.target.value })} />
        <button className="hb-primary" disabled={loading}>{jobForm.id ? 'Update job' : 'Post job'}</button>
      </form>
      <div className="hb-jobs compact">
        {jobs.length ? jobs.map((job) => <article className="hb-job" key={job.id}><div className="hb-job-top"><Pill tone={job.status === 'OPEN' ? '' : 'red'}>{job.status}</Pill><span>{job.applicantCount ?? 0} applicants</span></div><h3>{job.title}</h3><p>{job.company} - {job.location}</p><div className="hb-actions"><button onClick={() => setJobForm({ ...job, requirements: list(job.requirements).join(', ') })}>Edit</button><button onClick={() => onApplicants(job)}>Applicants</button><button onClick={() => onClose(job.id)}>Close</button><button className="hb-danger" onClick={() => onDelete(job.id)}>Delete</button></div></article>) : <Empty title="No jobs posted" text="Create the first opening to start receiving applicants." />}
      </div>
    </div>
  );
}

function Applicants({ jobs, selectedJob, applicants, loading, onSelect }) {
  return (
    <div className="hb-split">
      <div className="hb-panel hb-stack">
        <h3>Posted jobs</h3>
        {jobs.map((job) => <button className="hb-list-button" key={job.id} onClick={() => onSelect(job)}><span>{job.title}</span><strong>{job.applicantCount ?? 0}</strong></button>)}
      </div>
      <div>
        <h3>{selectedJob?.title ?? 'Applicants'}</h3>
        {loading ? <Skeleton /> : applicants.length ? <div className="hb-jobs compact">{applicants.map((item) => <article className="hb-job" key={item.id}><Pill>{item.status}</Pill><h3>{item.student.name}</h3><p>{item.student.email}</p><p>{item.student.headline || 'Candidate profile'}</p><div className="hb-tags">{list(item.student.skills).slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}</div>{item.student.resumeUrl && <a href={item.student.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}</article>)}</div> : <Empty title="No applicants yet" text="Applicants will appear here after students apply." />}
      </div>
    </div>
  );
}

function Profile({ profile, setProfile, role, onSubmit }) {
  if (!profile) return null;
  const skills = Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills ?? '';
  return (
    <form className="hb-panel hb-form hb-profile" onSubmit={onSubmit}>
      <h3>Profile</h3>
      {['name', 'phone', 'headline', 'location', 'avatarUrl'].map((field) => <input key={field} placeholder={field} value={profile[field] ?? ''} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} />)}
      <textarea placeholder="Bio" value={profile.bio ?? ''} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
      {role === 'STUDENT' ? <><input placeholder="Skills, comma separated" value={skills} onChange={(event) => setProfile({ ...profile, skills: event.target.value })} /><input placeholder="Resume URL" value={profile.resumeUrl ?? ''} onChange={(event) => setProfile({ ...profile, resumeUrl: event.target.value })} /></> : <><input placeholder="Company name" value={profile.companyName ?? ''} onChange={(event) => setProfile({ ...profile, companyName: event.target.value })} /><input placeholder="Company site" value={profile.companySite ?? ''} onChange={(event) => setProfile({ ...profile, companySite: event.target.value })} /></>}
      <button className="hb-primary">Save profile</button>
    </form>
  );
}
