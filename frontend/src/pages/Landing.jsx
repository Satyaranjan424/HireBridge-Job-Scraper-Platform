import { navigate } from '../routes/router';
import '../styles/Landing.css';

export default function Landing() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="hb-landing">
      <header className="hb-header">
        <div className="hb-header-inner">
          <button className="hb-brand" onClick={() => navigate('/')}>
            <span className="hb-dot" />HireBridge
          </button>
          <nav className="hb-nav">
            <button onClick={() => scrollTo('home')}>Home</button>
            <button onClick={() => scrollTo('about')}>About</button>
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('contact')}>Contact</button>
          </nav>
          <div className="hb-actions">
            <button className="hb-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="hb-btn primary" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </header>

      <section className="hb-hero" id="home">
        <div className="hb-hero-side student">
          <span className="hb-eyebrow">For students</span>
          <h1>Find the role<br />you're ready for.</h1>
          <p className="hb-lede">Search open jobs, track every application, and bookmark the ones worth a second look — all from one dashboard.</p>
          <button className="hb-btn" style={{ background: 'var(--mint)', color: '#fff', width: 'fit-content' }} onClick={() => navigate('/register')}>
            Start applying
          </button>
        </div>

        <div className="hb-seam">
          <svg viewBox="0 0 220 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 60 C 90 130, 90 290, 40 360" stroke="#C4D4C9" strokeWidth="1.5" strokeDasharray="4 6" />
            <path d="M180 60 C 130 130, 130 290, 180 360" stroke="#2C3742" strokeWidth="1.5" strokeDasharray="4 6" />
            <circle cx="40" cy="60" r="14" fill="#2F6E4F" />
            <text x="40" y="65" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="#fff">S</text>
            <circle cx="180" cy="360" r="14" fill="#E8A33D" />
            <text x="180" y="365" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="#12181F">H</text>
            <path d="M40 60 Q 110 210 180 360" stroke="#E8A33D" strokeWidth="2" fill="none" opacity="0.5" />
            <circle className="hb-seam-pulse" cx="110" cy="210" r="6" fill="#E8A33D" />
          </svg>
          <button className="hb-seam-cta" style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/register')}>
            Join the bridge →
          </button>
        </div>

        <div className="hb-hero-side manager">
          <span className="hb-eyebrow">For hiring managers</span>
          <h1>Meet candidates<br />worth hiring.</h1>
          <p className="hb-lede">Post roles, review applicants against real profiles, and manage your company's presence in one workspace.</p>
          <button className="hb-btn gold" style={{ width: 'fit-content' }} onClick={() => navigate('/register')}>
            Post a job
          </button>
        </div>
      </section>

      <section className="hb-lanes" id="about">
        <div className="hb-lanes-head">
          <span className="hb-eyebrow">How it flows</span>
          <h2>Two lanes, one bridge.</h2>
          <p>Students and hiring managers each move through a purpose-built path — HireBridge keeps both in sync without mixing the workflows.</p>
        </div>

        <div className="hb-lane student">
          <span className="hb-lane-label">Student</span>
          <div className="hb-lane-steps">
            <span className="hb-step">Dashboard</span><span className="hb-arrow">→</span>
            <span className="hb-step">Jobs</span><span className="hb-arrow">→</span>
            <span className="hb-step">Applications</span><span className="hb-arrow">→</span>
            <span className="hb-step">Bookmarks</span><span className="hb-arrow">→</span>
            <span className="hb-step">Profile</span>
          </div>
        </div>
        <div className="hb-lane manager">
          <span className="hb-lane-label">Hiring manager</span>
          <div className="hb-lane-steps">
            <span className="hb-step">Dashboard</span><span className="hb-arrow">→</span>
            <span className="hb-step">My Jobs</span><span className="hb-arrow">→</span>
            <span className="hb-step">Applicants</span><span className="hb-arrow">→</span>
            <span className="hb-step">Profile</span>
          </div>
        </div>
      </section>

      <section className="hb-features" id="features">
        <div className="hb-features-head">
          <span className="hb-eyebrow" style={{ color: 'var(--mint-deep)' }}>Built for both sides</span>
          <h2>What makes it work.</h2>
          <p>Every page reads from live data — nothing here is a mockup.</p>
        </div>
        <div className="hb-feature-grid">
          <article className="hb-feature-card">
            <div className="hb-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3>Role-based access</h3>
            <p>JWT-protected areas keep student and hiring-manager workflows completely separate.</p>
          </article>
          <article className="hb-feature-card">
            <div className="hb-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12181F" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>
            </div>
            <h3>Real data, not mockups</h3>
            <p>Dashboards read applications, bookmarks, jobs, and applicants straight from the API.</p>
          </article>
          <article className="hb-feature-card">
            <div className="hb-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
            </div>
            <h3>Profile tools</h3>
            <p>Students maintain skills, bio, resume, and photo; managers keep company details current.</p>
          </article>
          <article className="hb-feature-card">
            <div className="hb-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
            <h3>Aggregated job listings</h3>
            <p>A scraper pipeline pulls fresh postings from multiple sources so students search one board instead of ten tabs.</p>
          </article>
          <article className="hb-feature-card">
            <div className="hb-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <h3>Application tracking</h3>
            <p>Every application updates in real time — applied, under review, shortlisted, or closed — with no manual refresh needed.</p>
          </article>
          <article className="hb-feature-card">
            <div className="hb-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
            </div>
            <h3>Applicant management</h3>
            <p>Hiring managers filter applicants by skills and status, then move candidates through the pipeline from one panel.</p>
          </article>
        </div>
      </section>

      <section className="hb-contact" id="contact">
        <div>
          <span className="hb-eyebrow" style={{ color: 'var(--gold)' }}>Contact</span>
          <h2>Let's bridge your next opportunity.</h2>
          <p className="hb-lede">Have a question about HireBridge? Send us a message and we'll get back to you.</p>
          <div className="hb-contact-facts">
            <span>Bhubaneswar, Odisha, India</span>
            <span>support@hirebridge.com</span>
            <span>Mon–Fri, 10 AM – 6 PM</span>
          </div>
        </div>
        <form className="hb-form" onSubmit={(event) => event.preventDefault()}>
          <input type="text" placeholder="Your name" aria-label="Name" />
          <input type="email" placeholder="Your email address" aria-label="Email" />
          <select defaultValue="" aria-label="Topic">
            <option value="" disabled>Select a topic</option>
            <option value="student">I'm a student</option>
            <option value="hiring">I'm hiring</option>
            <option value="support">General support</option>
          </select>
          <textarea placeholder="How can we help?" aria-label="Message" />
          <button className="hb-btn gold" type="submit">Send message</button>
        </form>
      </section>

      <footer className="hb-footer">
        <strong>HireBridge</strong>
        <span>Where student ambition meets the right opportunity.</span>
        <span>© 2026 HireBridge</span>
      </footer>
    </main>
  );
}