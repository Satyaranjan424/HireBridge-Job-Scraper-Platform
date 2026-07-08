import { navigate } from '../routes/router';

export default function Landing() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="hb-landing">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .hb-landing {
          --paper: #EAF0EC;
          --paper-deep: #DCE7DF;
          --paper-line: #C4D4C9;
          --ink: #12181F;
          --ink-soft: #1B232C;
          --ink-line: #2C3742;
          --gold: #E8A33D;
          --gold-deep: #C97F1E;
          --mint: #2F6E4F;
          --mint-deep: #234F39;
          --text-dark: #16201B;
          --text-light: #F3F1E8;
          --muted-dark: #4B5A50;
          --muted-light: #A9B4AC;
          --font-display: 'Inter', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'Inter', sans-serif;

          font-family: var(--font-body);
          font-size: 16px;
          color: var(--text-dark);
          background: var(--paper);
          overflow-x: hidden;
        }
        .hb-landing * { box-sizing: border-box; }
        .hb-landing h1, .hb-landing h2, .hb-landing h3 {
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .hb-landing p { margin: 0; line-height: 1.65; font-size: 16px; }
        .hb-landing button { font-family: var(--font-body); cursor: pointer; border: none; }
        .hb-landing button:focus-visible,
        .hb-landing a:focus-visible { outline: 2px solid var(--gold-deep); outline-offset: 3px; }

        /* ---------- Header ---------- */
        .hb-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(234, 240, 236, 0.86);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--paper-line);
        }
        .hb-header-inner {
          max-width: 1160px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0px 0px;
        }
        .hb-brand {
          background: none; font-family: var(--font-display);
          font-weight: 800; font-size: 19px; color: var(--text-dark);
          display: flex; align-items: center; gap: 8px;
        }
        .hb-brand .hb-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }
        .hb-nav { display: flex; gap: 24px; }
        .hb-nav button {
          background: none; color: var(--muted-dark); font-size: 15px; font-weight: 500;
          padding: 6px 2px; border-bottom: 1px solid transparent; transition: color .2s, border-color .2s;
        }
        .hb-nav button:hover { color: var(--text-dark); border-color: var(--gold); }
        .hb-actions { display: flex; gap: 10px; }
        .hb-btn {
          padding: 9px 18px; border-radius: 8px; font-size: 15px; font-weight: 600;
          background: transparent; color: var(--text-dark); border: 1px solid var(--ink-line);
          transition: transform .15s, background .2s;
        }
        .hb-btn:hover { transform: translateY(-1px); }
        .hb-btn.primary { background: var(--ink); color: var(--text-light); border-color: var(--ink); }
        .hb-btn.primary:hover { background: var(--ink-soft); }
        .hb-btn.gold { background: var(--gold); color: var(--ink); border-color: var(--gold); }
        .hb-btn.gold:hover { background: var(--gold-deep); }

        /* ---------- Hero: the bridge seam ---------- */
        .hb-hero {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 640px;
        }
        .hb-hero-side {
          position: relative;
          padding: 0px clamp(24px, 6vw, 72px) 130px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .hb-hero-side.student { background: var(--paper); }
        .hb-hero-side.manager {
          background: var(--ink); color: var(--text-light);
        }
        .hb-eyebrow {
          font-size: 13px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--mint-deep); margin-bottom: 14px; display: block;
        }
        .hb-hero-side.manager .hb-eyebrow { color: var(--gold); }
        .hb-hero-side h1 { font-size: clamp(32px, 3.6vw, 46px); line-height: 1.1; margin-bottom: 18px; }
        .hb-hero-side p.hb-lede { font-size: 17px; color: var(--muted-dark); max-width: 40ch; margin-bottom: 28px; }
        .hb-hero-side.manager p.hb-lede { color: var(--muted-light); }

        /* the seam + bridge graphic */
        .hb-seam {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 220px; transform: translateX(-50%);
          display: flex; align-items: center; justify-content: center;
          pointer-events: none; z-index: 5;
        }
        .hb-seam svg { width: 100%; height: auto; }
        .hb-seam-pulse {
          animation: hb-pulse 2.6s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes hb-pulse {
          0%, 100% { opacity: 0.55; r: 5; }
          50% { opacity: 1; r: 7.5; }
        }
        .hb-seam-cta {
          position: absolute; bottom: 56px; left: 50%; transform: translateX(-50%);
          background: var(--gold); color: var(--ink); border-radius: 999px;
          padding: 13px 26px; font-weight: 600; font-size: 14px;
          box-shadow: 0 10px 30px rgba(232, 163, 61, 0.35);
          display: flex; align-items: center; gap: 8px; pointer-events: all;
          transition: transform .18s;
        }
        .hb-seam-cta:hover { transform: translateX(-50%) translateY(-2px); }

        @media (max-width: 860px) {
          .hb-hero { grid-template-columns: 1fr; }
          .hb-seam { display: none; }
          .hb-hero-side { padding: 56px 22px; }
        }

        /* ---------- Flow band: two lanes ---------- */
        .hb-lanes {
          padding: 84px clamp(20px, 6vw, 72px);
          background: var(--paper-deep);
        }
        .hb-lanes-head { max-width: 56ch; margin-bottom: 48px; }
        .hb-lanes-head span.hb-eyebrow { color: var(--mint-deep); }
        .hb-lanes-head h2 { font-size: clamp(26px, 2.8vw, 34px); margin-bottom: 10px; }
        .hb-lanes-head p { color: var(--muted-dark); font-size: 16px; }
        .hb-lane { display: flex; align-items: center; gap: 0; margin-bottom: 20px; flex-wrap: wrap; }
        .hb-lane-label {
          font-size: 14px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.04em;
          width: 168px; flex-shrink: 0; color: var(--text-dark);
        }
        .hb-lane.manager .hb-lane-label { color: var(--ink); }
        .hb-lane-steps { display: flex; align-items: center; flex-wrap: wrap; gap: 0; }
        .hb-step {
          font-size: 14.5px; font-weight: 600; padding: 10px 16px; border-radius: 8px;
          background: var(--paper); border: 1px solid var(--paper-line); white-space: nowrap;
        }
        .hb-lane.manager .hb-step { background: var(--ink); color: var(--text-light); border-color: var(--ink-line); }
        .hb-arrow { color: var(--muted-dark); padding: 0 10px; }

        /* ---------- Features ---------- */
        .hb-features {
          padding: 84px clamp(20px, 6vw, 72px);
          background: var(--paper);
        }
        .hb-features-head { max-width: 56ch; margin-bottom: 44px; }
        .hb-features-head h2 { font-size: clamp(26px, 2.8vw, 34px); margin-bottom: 10px; }
        .hb-features-head p { color: var(--muted-dark); font-size: 16px; }
        .hb-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .hb-feature-card {
          background: #fff; border: 1px solid var(--paper-line); border-radius: 14px;
          padding: 28px 24px; transition: transform .18s, box-shadow .18s;
        }
        .hb-feature-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px rgba(18,24,31,0.08); }
        .hb-feature-icon {
          width: 40px; height: 40px; border-radius: 10px; background: var(--mint);
          display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
        }
        .hb-feature-card:nth-child(2) .hb-feature-icon { background: var(--gold); }
        .hb-feature-card:nth-child(3) .hb-feature-icon { background: var(--ink); }
        .hb-feature-card h3 { font-size: 18px; margin-bottom: 8px; }
        .hb-feature-card p { font-size: 15px; color: var(--muted-dark); }
        @media (max-width: 860px) { .hb-feature-grid { grid-template-columns: 1fr; } }

        /* ---------- Contact ---------- */
        .hb-contact {
          padding: 84px clamp(20px, 6vw, 72px);
          background: var(--ink); color: var(--text-light);
          display: grid; grid-template-columns: 1fr 1fr; gap: 56px;
        }
        .hb-contact h2 { font-size: clamp(26px, 2.8vw, 34px); margin: 10px 0 14px; }
        .hb-contact p.hb-lede { color: var(--muted-light); font-size: 16px; max-width: 42ch; margin-bottom: 24px; }
        .hb-contact-facts { display: flex; flex-direction: column; gap: 8px; font-size: 14.5px; font-weight: 600; color: var(--gold); }
        .hb-form {
          background: var(--ink-soft); border: 1px solid var(--ink-line); border-radius: 14px;
          padding: 26px; display: flex; flex-direction: column; gap: 14px;
        }
        .hb-form input, .hb-form select, .hb-form textarea {
          background: var(--ink); border: 1px solid var(--ink-line); border-radius: 8px;
          padding: 12px 14px; color: var(--text-light); font-family: var(--font-body); font-size: 15px;
        }
        .hb-form input::placeholder, .hb-form textarea::placeholder { color: var(--muted-light); }
        .hb-form textarea { min-height: 90px; resize: none; }
        @media (max-width: 860px) { .hb-contact { grid-template-columns: 1fr; } }

        /* ---------- Footer ---------- */
        .hb-footer {
          padding: 32px clamp(20px, 6vw, 72px);
          background: var(--ink); border-top: 1px solid var(--ink-line);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
          color: var(--muted-light); font-size: 14px;
        }
        .hb-footer strong { font-family: var(--font-display); color: var(--text-light); }

        @media (prefers-reduced-motion: reduce) {
          .hb-seam-pulse { animation: none; }
          .hb-btn, .hb-feature-card, .hb-seam-cta { transition: none; }
        }
      `}</style>

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
          <button className="hb-seam-cta" onClick={() => navigate('/register')}>
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
        </div>
      </section>

      <section className="hb-contact" id="contact">
        <div>
          <span className="hb-eyebrow" style={{ color: 'var(--gold)' }}>Contact</span>
          <h2>Let's bridge your next opportunity.</h2>
          <p className="hb-lede">Have a question about HireBridge? Send us a message and we'll get back to you.</p>
          <div className="hb-contact-facts">
            <span>support@hirebridge.local</span>
            <span>Bangalore, India</span>
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
        <span>Built for JWT auth, RBAC, real job data, and practical career workflows.</span>
        <span>© 2026 HireBridge</span>
      </footer>
    </main>
  );
}