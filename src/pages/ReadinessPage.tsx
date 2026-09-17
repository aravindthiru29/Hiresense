import { useState } from 'react'

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface ReadinessPageProps {
  onNavigate?: (view: View) => void
}

export function ReadinessPage({ onNavigate }: ReadinessPageProps) {
  const [checkedActions, setCheckedActions] = useState<number[]>([1])

  const toggleAction = (id: number) => {
    setCheckedActions(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
  }

  const pillars = [
    { label: 'Resume ATS Alignment', value: 92, status: 'Strong', good: true },
    { label: 'DSA & Algorithmic Problem Solving', value: 84, status: 'Target Met', good: true },
    { label: 'System Design & Scalability', value: 78, status: 'Needs Polish', good: false },
    { label: 'Project Architecture & Depth', value: 88, status: 'Strong', good: true },
    { label: 'Behavioral & STAR Communication', value: 94, status: 'Interview Ready', good: true },
  ]

  const benchmarks = [
    { company: 'Tier-1 Tech (Google, Microsoft, Amazon SDE)', readiness: 88, status: 'Interview Ready', gap: 'Sharpen distributed caching trade-offs' },
    { company: 'High-Growth Tech Unicorns & AI Startups', readiness: 94, status: 'Exceptional Fit', gap: 'Showcase edge latency optimizations' },
    { company: 'Enterprise Cloud & Fintech Engineering', readiness: 91, status: 'Strong Match', gap: 'Highlight SQL transaction consistency' },
  ]

  const actions = [
    { id: 1, title: 'Complete Python & DSA Practice Round', sub: 'Dynamic Programming and Tree traversals', to: 'interview' as View },
    { id: 2, title: 'Review Smart Crop Project Bullet Rewrites', sub: 'Add classification precision & API latency metrics', to: 'resume' as View },
    { id: 3, title: 'Practice Distributed Rate Limiter System Case', sub: 'Token Bucket vs Leaky Bucket algorithms with Redis', to: 'roadmap' as View },
    { id: 4, title: 'Add Architecture Decision Record to GitHub Repo', sub: 'Document choice of PyTorch in recommendation engine', to: 'github' as View },
  ]

  return (
    <div className="page-stack">
      {/* Top Banner */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Placement Diagnostic Engine</p>
              <h3 style={{ margin: 0, fontSize: '19px' }}>Campus &amp; Off-Campus Placement Readiness</h3>
            </div>
            <span className="kpi-value" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>92%</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-2)', maxWidth: '600px', lineHeight: 1.6 }}>
            Overall candidate signal evaluated across 5 core competencies for <strong>Software Developer</strong> and <strong>AI/ML Engineering</strong> roles.
          </p>

          <div className="metric-list" style={{ marginTop: '16px' }}>
            {pillars.map(({ label, value, status, good }) => (
              <div key={label} className="metric-row" style={{ padding: '10px 0' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-1)' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className={`pill${good ? ' green' : ' amber'}`} style={{ fontSize: '0.68rem' }}>
                    {status}
                  </span>
                  <div className="meter" style={{ width: 90 }}><i style={{ width: `${value}%` }} /></div>
                  <strong style={{ minWidth: 36, textAlign: 'right', fontSize: '0.84rem' }}>{value}%</strong>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Priority Actions Checklist */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Priority Checklist</h3>
              <span className="badge badge-accent">Sprint Goals</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginBottom: '12px' }}>
              High-leverage tasks to push overall readiness past <strong>95%</strong>:
            </p>

            <ul className="list">
              {actions.map(a => {
                const isChecked = checkedActions.includes(a.id)
                return (
                  <li key={a.id} style={{ alignItems: 'flex-start', gap: '10px', padding: '10px 0' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAction(a.id)}
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{
                        fontSize: '0.82rem',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        color: 'var(--text-1)',
                      }}>
                        {a.title}
                      </strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                        {a.sub}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-sm" style={{ width: '100%' }} onClick={() => onNavigate?.('roadmap')}>
              View 4-Week Placement Roadmap →
            </button>
          </div>
        </article>
      </section>

      {/* Target Company Readiness Benchmarks */}
      <section className="card">
        <div className="section-title">
          <div>
            <h3 style={{ margin: 0 }}>Company-Specific Readiness Benchmarks</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              Calculated matching score against historical interview and recruitment bars
            </p>
          </div>
          <span className="badge badge-green">3 Tracks Evaluated</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', marginTop: '14px' }}>
          {benchmarks.map((b) => (
            <div
              key={b.company}
              style={{
                background: 'var(--bg-inset)',
                padding: '16px',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-1)' }}>{b.company}</strong>
                  <span className="pill green" style={{ fontWeight: 700 }}>{b.readiness}% Match</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, margin: '6px 0 8px' }}>
                  Status: {b.status}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', margin: 0 }}>
                  <strong>Key Gap:</strong> {b.gap}
                </p>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                <div className="meter" style={{ height: '5px' }}>
                  <i style={{ width: `${b.readiness}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths and Gaps */}
      <section className="panel-grid">
        <article className="card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Verified Core Strengths</h3>
            <span className="pill green">Top Tier</span>
          </div>
          <ul className="list">
            <li>
              <div>
                <strong>Python &amp; ML Pipeline Architecture</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>Clean model deployment via Flask and OpenCV</p>
              </div>
              <span className="badge badge-green">Strong</span>
            </li>
            <li>
              <div>
                <strong>SQL &amp; Database Optimization</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>Validated relational modeling &amp; query indexing</p>
              </div>
              <span className="badge badge-green">Verified</span>
            </li>
            <li>
              <div>
                <strong>Behavioral STAR Storytelling</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>94% clear ownership communication</p>
              </div>
              <span className="badge badge-green">Ready</span>
            </li>
          </ul>
        </article>

        <article className="card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Targeted Improvement Lane</h3>
            <span className="badge badge-amber">Action Needed</span>
          </div>
          <ul className="list">
            <li>
              <div>
                <strong>Distributed System Caching</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>Practice Redis eviction &amp; caching strategies</p>
              </div>
              <button className="btn-ghost btn-sm" onClick={() => onNavigate?.('roadmap')}>
                Sprint 3 →
              </button>
            </li>
            <li>
              <div>
                <strong>Resume Metric Quantification</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>Update 2 bullet points in Smart Crop project</p>
              </div>
              <button className="btn-ghost btn-sm" onClick={() => onNavigate?.('resume')}>
                Polish →
              </button>
            </li>
            <li>
              <div>
                <strong>GitHub ADR Documentation</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>Add trade-offs writeup to recsys repo</p>
              </div>
              <button className="btn-ghost btn-sm" onClick={() => onNavigate?.('github')}>
                View →
              </button>
            </li>
          </ul>
        </article>
      </section>
    </div>
  )
}
