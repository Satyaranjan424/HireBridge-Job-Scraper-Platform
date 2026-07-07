import { navigate } from '../routes/router';

export default function Landing() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="landing">
      <header className="public-header">
        <div className="public-actions">
          <button onClick={() => navigate('/login')}>Login</button>
          <button className="primary" onClick={() => navigate('/register')}>Register</button>
        </div>
        <nav className="public-nav">
          <button onClick={() => scrollTo('home')}>Home</button>
          <button onClick={() => scrollTo('about')}>About</button>
          <button onClick={() => scrollTo('features')}>Features</button>
          <button onClick={() => scrollTo('contact')}>Contact</button>
        </nav>
        <button className="brand-link" onClick={() => navigate('/')}>HireBridge</button>
      </header>
      <section className="landing-hero" id="home">
        <div>
          <span className="eyebrow">Student careers and hiring pipelines</span>
          <h1>HireBridge</h1>
          <p>Discover jobs, track applications, save opportunities, and manage applicants in one clean role-based workspace.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate('/register')}>Get Started</button>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
        <div className="hero-board" aria-label="HireBridge preview">
          <article><span>Applied Jobs</span><strong>12</strong></article>
          <article><span>Open Jobs</span><strong>18</strong></article>
          <article><span>Applicants</span><strong>42</strong></article>
          <article><span>Saved Jobs</span><strong>8</strong></article>
        </div>
      </section>
      <section className="flow-band" id="about">
        <article><h2>About</h2><p>HireBridge is a focused placement workspace for students, recruiters, and hiring teams. The platform keeps job discovery, application tracking, applicant review, and profile management in one role-based experience.</p></article>
        <article><h2>Flow</h2><p>Students move through Dashboard, Jobs, Applications, Bookmarks, and Profile. Hiring managers move through Dashboard, My Jobs, Applicants, and Profile.</p></article>
      </section>
      <section className="feature-band" id="features">
        <article><h3>Role Based Access</h3><p>JWT-protected student and hiring manager areas keep each workflow separate.</p></article>
        <article><h3>Real Data Pages</h3><p>Dashboards read applications, bookmarks, jobs, applicants, and profile completion from the API.</p></article>
        <article><h3>Profile Tools</h3><p>Students can update skills, bio, resume, and image while managers can maintain company details.</p></article>
      </section>
      <section className="contact-section" id="contact">
        <div>
          <span className="eyebrow">Contact</span>
          <h2>Let us help you bridge the next opportunity.</h2>
          <p>This demo form is readonly-safe: it captures the message visually without sending external email.</p>
          <div className="contact-facts">
            <span>support@hirebridge.local</span>
            <span>Bangalore, India</span>
            <span>Mon-Fri, 10 AM - 6 PM</span>
          </div>
        </div>
        <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
          <input readOnly value="Satya" aria-label="Name" />
          <input readOnly value="student@example.com" aria-label="Email" />
          <select readOnly value="Product demo" aria-label="Topic" onChange={() => {}}>
            <option>Product demo</option>
          </select>
          <textarea readOnly value="I want to understand how HireBridge can help students and hiring managers collaborate better." aria-label="Message" />
          <button className="primary" type="button">Message Preview</button>
        </form>
      </section>
      <footer className="public-footer">
        <strong>HireBridge</strong>
        <span>Built for JWT auth, RBAC, real job data, and practical career workflows.</span>
        <span>© 2026 HireBridge</span>
      </footer>
    </main>
  );
}
