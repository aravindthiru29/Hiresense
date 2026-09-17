type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface GithubPageProps {
  onNavigate?: (view: View) => void
}

export function GithubPage({ onNavigate }: GithubPageProps) {
  const metrics = [
    { label: 'Architecture & Clean Code', value: '9.2/10', good: true, desc: 'Layered service structure & separation of concerns' },
    { label: 'Documentation & READMEs', value: '8.8/10', good: true, desc: 'Installation guides and architecture diagrams present' },
    { label: 'Test Coverage & CI/CD', value: '8.4/10', good: true, desc: 'PyTest and GitHub Actions workflow active in 2 repos' },
    { label: 'Commit Consistency', value: '8.9/10', good: true, desc: '420+ commits across last 12 months with clean messages' },
  ]

  const auditedRepos = [
    {
      name: 'smart-crop-ai',
      stars: 14,
      forks: 3,
      lang: 'Python · Flask · OpenCV',
      health: '94/100',
      badge: 'Tier-1 Candidate',
      highlights: 'Dockerized microservice, OpenCV edge processing, automated PyTest suite.',
      aiFeedback: 'Add an animated demo GIF to README to boost recruiter engagement by 35%.',
    },
    {
      name: 'recsys-engine',
      stars: 9,
      forks: 2,
      lang: 'Python · SQL · PyTorch',
      health: '89/100',
      badge: 'High Signal',
      highlights: 'Collaborative-filtering algorithm, indexed SQL queries, FastAPI endpoints.',
      aiFeedback: 'Document Architecture Decision Record (ADR #01: Choice of PyTorch over LightFM).',
    },
    {
      name: 'dsa-patterns-python',
      stars: 22,
      forks: 6,
      lang: 'Python · Algorithms',
      health: '96/100',
      badge: 'Verified DSA',
      highlights: '150+ curated algorithm implementations with time/space complexity analysis.',
      aiFeedback: 'Pin this repository to the top of your public profile for tech screeners.',
    },
  ]

  return (
    <div className="page-stack">
      {/* Top Banner */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Portfolio Intelligence Engine</p>
              <h3 style={{ margin: 0, fontSize: '19px' }}>GitHub Profile Signal Audit</h3>
            </div>
            <div className="pill-row" style={{ margin: 0 }}>
              <span className="pill green">✓ @aravind-t Synced</span>
              <span className="pill">18 Repositories Analyzed</span>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-2)', maxWidth: '600px', lineHeight: 1.6 }}>
            Recruiters evaluate public GitHub repositories to verify code readability, modularity, and engineering hygiene. Your profile is rated in the <strong>top 9%</strong> of student applicants.
          </p>

          <div className="metric-list" style={{ marginTop: '16px' }}>
            {metrics.map(({ label, value, good, desc }) => (
              <div key={label} className="metric-row" style={{ padding: '10px 0' }}>
                <div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--text-1)' }}>{label}</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>{desc}</p>
                </div>
                <strong style={{ color: good ? 'var(--green)' : 'var(--amber)', fontSize: '0.94rem' }}>
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </article>

        {/* AI Recommendations */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Portfolio Upgrades</h3>
              <span className="badge badge-accent">Action Items</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '14px' }}>
              3 strategic adjustments to turn repository views into technical interview invitations:
            </p>

            <ul className="list">
              <li>
                <div>
                  <strong style={{ fontSize: '0.82rem' }}>Pin top 3 core projects</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                    smart-crop-ai, recsys-engine, dsa-patterns
                  </p>
                </div>
                <span className="badge badge-green">Recommended</span>
              </li>
              <li>
                <div>
                  <strong style={{ fontSize: '0.82rem' }}>Add Architecture Decision Records</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                    Explains engineering trade-offs like senior engineers
                  </p>
                </div>
                <span className="badge badge-amber">High Value</span>
              </li>
              <li>
                <div>
                  <strong style={{ fontSize: '0.82rem' }}>Add CI status badges &amp; demo GIFs</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                    Proves immediate functionality without cloning
                  </p>
                </div>
                <span className="pill">Visual Impact</span>
              </li>
            </ul>
          </div>

          <div className="mini-panel" style={{ marginTop: '16px' }}>
            <p>AI Strategy</p>
            <strong style={{ fontSize: '0.76rem', color: 'var(--text-1)' }}>
              Interviewers spend an average of 45 seconds on applicant GitHubs. Visual diagrams and test badges win quick approval.
            </strong>
          </div>
        </article>
      </section>

      {/* Audited Repositories */}
      <section>
        <div className="section-title" style={{ marginTop: '4px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Audited Showcase Repositories</h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              Detailed code health scores and tailored improvement recommendations
            </p>
          </div>
          <button className="btn-ghost btn-sm" onClick={() => onNavigate?.('resume')}>
            Sync with Resume →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {auditedRepos.map((repo) => (
            <article key={repo.name} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.94rem', color: 'var(--text-1)' }}>{repo.name}</strong>
                    <p style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 0' }}>
                      {repo.lang}
                    </p>
                  </div>
                  <span className="badge badge-green">{repo.health}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', margin: '8px 0', fontSize: '0.74rem', color: 'var(--text-3)' }}>
                  <span>★ {repo.stars} stars</span>
                  <span>⑂ {repo.forks} forks</span>
                  <span className="pill" style={{ fontSize: '0.66rem' }}>{repo.badge}</span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5, margin: '6px 0 10px' }}>
                  {repo.highlights}
                </p>
              </div>

              <div style={{
                background: 'var(--bg-inset)',
                padding: '10px 12px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                marginTop: '10px',
              }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                  AI Recommendation:
                </span>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-1)', margin: '2px 0 0' }}>
                  {repo.aiFeedback}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
