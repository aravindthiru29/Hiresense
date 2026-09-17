type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface HomePageProps {
  onNavigate?: (view: View) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const handleNav = (view: View) => {
    if (onNavigate) {
      onNavigate(view)
    }
  }

  const agentLaunchers = [
    {
      key: 'resume' as View,
      label: 'Resume Analyzer',
      tag: '87 ATS Score',
      tagColor: 'green',
      desc: 'AI keyword matching, bullet point impact quantification, and formatting audit.',
      action: 'Open Analyzer →',
      icon: '◎',
    },
    {
      key: 'interview' as View,
      label: 'Mock Interview Coach',
      tag: '94% Ready',
      tagColor: 'green',
      desc: 'Practice Behavioral STAR, Technical DSA, and Project Defense with real-time feedback.',
      action: 'Start Session →',
      icon: '◉',
    },
    {
      key: 'github' as View,
      label: 'GitHub Intelligence',
      tag: '18 Repos Synced',
      tagColor: '',
      desc: 'Repo health audit, README optimization, ADR documentation, and commit velocity.',
      action: 'View Audit →',
      icon: '◐',
    },
    {
      key: 'readiness' as View,
      label: 'Placement Readiness',
      tag: '92% Signal',
      tagColor: 'accent',
      desc: 'Benchmark profile against Google, Microsoft, Amazon, and top AI tech startups.',
      action: 'Check Benchmark →',
      icon: '◑',
    },
    {
      key: 'roadmap' as View,
      label: 'Learning Roadmap',
      tag: 'Week 2 Sprint',
      tagColor: 'amber',
      desc: 'Personalized 4-week placement sprint covering DSA, System Design, and projects.',
      action: 'View Sprints →',
      icon: '▷',
    },
    {
      key: 'reports' as View,
      label: 'Placement Reports',
      tag: '+19 pts MoM',
      tagColor: 'green',
      desc: 'Track weekly skill progression, verified capabilities, and export placement dossier.',
      action: 'View Reports →',
      icon: '≡',
    },
  ]

  return (
    <div className="page-stack">
      {/* Top Welcome Banner & Momentum Card */}
      <section className="panel-grid">
        <article className="card wide" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="section-title">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Career Command Center</p>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.04em' }}>
                Good morning, Aravind.
              </h2>
            </div>
            <div className="pill-row" style={{ margin: 0 }}>
              <span className="pill green">● Active Placement Sprint</span>
              <span className="pill">VIT Vellore · B.Tech AI &amp; DS &apos;26</span>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-2)', maxWidth: '580px', lineHeight: 1.6 }}>
            Your career signal is currently in the <strong>top 8%</strong> of applicants targeting Software Developer and AI Engineering roles. 3 priority actions are recommended before campus drive rounds begin.
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => handleNav('resume')}>
              Optimize Resume (87 ATS) →
            </button>
            <button className="btn btn-secondary" onClick={() => handleNav('interview')}>
              Practice Live Interview
            </button>
            <button className="btn btn-ghost" onClick={() => handleNav('readiness')}>
              View Company Benchmarks
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
          }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Target Role</span>
              <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-1)', marginTop: '2px' }}>Software Developer</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Active Resume</span>
              <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-1)', marginTop: '2px' }}>Aravind_T_Resume.pdf</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Verified Skills</span>
              <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--green)', marginTop: '2px' }}>7 of 9 Verified</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Drive Countdown</span>
              <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--accent)', marginTop: '2px' }}>24 Days Remaining</strong>
            </div>
          </div>
        </article>

        {/* Readiness Highlight Card */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Placement Signal</h3>
              <span className="pill green">+8% this month</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '10px 0 6px' }}>
              <span className="score-large" style={{ margin: 0 }}>92</span>
              <span style={{ fontSize: '1rem', color: 'var(--text-3)' }}>/ 100</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', margin: 0 }}>
              Strong alignment with Tier-1 engineering criteria. Core strength in project architecture and Python/ML engineering.
            </p>
          </div>

          <div className="mini-panel" style={{ marginTop: '16px' }}>
            <p>Next Best Action</p>
            <strong style={{ display: 'block', color: 'var(--text-1)', marginBottom: '4px' }}>
              Sharpen Smart Crop Monitoring project metrics
            </strong>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-2)' }}>
              Resume Analyzer identified 2 bullet points ready for quantified impact stats (+4 ATS pts).
            </span>
            <div style={{ marginTop: '8px' }}>
              <button
                className="text-button underline"
                style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}
                onClick={() => handleNav('resume')}
              >
                Review bullet point rewrite →
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* KPI Stats Grid */}
      <section className="stats-grid" style={{ marginTop: 0 }}>
        {[
          { label: 'ATS Resume Score', value: '87/100', delta: 'Top 10% in pool', good: true, to: 'resume' as View },
          { label: 'Mock Interview Confidence', value: '94%', delta: 'Behavioral & STAR ready', good: true, to: 'interview' as View },
          { label: 'System Design & DSA', value: '78%', delta: '2 practice cases left', good: false, to: 'roadmap' as View },
        ].map(({ label, value, delta, good, to }) => (
          <article
            key={label}
            className="card"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNav(to)}
          >
            <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {label}
            </p>
            <div className="kpi-value">{value}</div>
            <span className={good ? 'kpi-delta' : 'pill amber'} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              {good ? `↑ ${delta}` : `● ${delta}`}
            </span>
          </article>
        ))}
      </section>

      {/* Specialist Agent Launchpad Hub */}
      <section>
        <div className="section-title" style={{ marginTop: '8px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Specialist AI Agents</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              6 integrated intelligent modules feeding your career readiness signal
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {agentLaunchers.map((agent) => (
            <div
              key={agent.key}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                cursor: 'pointer',
              }}
              onClick={() => handleNav(agent.key)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      fontSize: '15px',
                      fontWeight: 700,
                    }}>
                      {agent.icon}
                    </span>
                    <strong style={{ fontSize: '0.94rem', color: 'var(--text-1)' }}>{agent.label}</strong>
                  </div>
                  {agent.tag && (
                    <span className={`pill${agent.tagColor ? ` ${agent.tagColor}` : ''}`} style={{ fontSize: '0.7rem' }}>
                      {agent.tag}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
                  {agent.desc}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600 }}>
                  {agent.action}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-Column Sprint Schedule & Activity */}
      <section className="panel-grid">
        <article className="card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Upcoming Placement Milestones</h3>
            <span className="badge badge-accent">This Week</span>
          </div>
          <ul className="list">
            <li>
              <div>
                <strong>Google SDE 1 Technical Mock</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Algorithms &amp; System Narrative · 45 mins
                </p>
              </div>
              <button
                className="badge badge-green"
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() => handleNav('interview')}
              >
                Join Today
              </button>
            </li>
            <li>
              <div>
                <strong>Resume Polish &amp; GitHub Sync</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Add OpenCV benchmark results to Smart Crop repo
                </p>
              </div>
              <span className="badge badge-amber">Tomorrow</span>
            </li>
            <li>
              <div>
                <strong>Microsoft On-Campus Drive Application</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Target: Software Development Engineer
                </p>
              </div>
              <span className="pill">In 3 days</span>
            </li>
          </ul>
        </article>

        <article className="card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Skills Readiness Balance</h3>
            <button className="btn-ghost btn-sm" onClick={() => handleNav('readiness')}>
              Full Breakdown →
            </button>
          </div>
          <div className="meter-list">
            {[
              { skill: 'Python & Machine Learning', pct: 92, verified: true },
              { skill: 'Data Structures & Algorithms', pct: 84, verified: true },
              { skill: 'SQL & Database Optimization', pct: 86, verified: true },
              { skill: 'System Design & Scalability', pct: 68, verified: false },
            ].map(({ skill, pct, verified }) => (
              <div key={skill} className="stack-row">
                <div className="stack-label-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {skill}
                    {verified && <span style={{ color: 'var(--green)', fontSize: '0.68rem', fontWeight: 700 }}>✓ Verified</span>}
                  </span>
                  <strong>{pct}%</strong>
                </div>
                <div className="meter">
                  <i style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

