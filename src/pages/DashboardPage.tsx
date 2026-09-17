import { useState, useEffect } from 'react'
import { dashboardApi, type DashboardData } from '../lib'

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface DashboardPageProps {
  onNavigate?: (view: View) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [dashData, setDashData] = useState<DashboardData | null>(null)

  useEffect(() => {
    dashboardApi.getDashboardData()
      .then(data => {
        if (data) setDashData(data)
      })
      .catch(() => {
        // Backend offline or local simulation fallback
      })
  }, [])

  const handleNav = (view: View) => {
    if (onNavigate) {
      onNavigate(view)
    }
  }

  const stats = dashData?.stats || [
    { label: 'Placement readiness', value: '92%', delta: '+8% this month', good: true, to: 'readiness' as View },
    { label: 'ATS resume score', value: '87/100', delta: 'Strong keyword fit', good: true, to: 'resume' as View },
    { label: 'Mock interview score', value: '94%', delta: 'Behavioral & STAR ready', good: true, to: 'interview' as View },
  ]

  return (
    <div className="page-stack">
      {/* Top 3 KPI Cards */}
      <section className="stats-grid" style={{ marginTop: 0 }}>
        {stats.map(({ label, value, delta, good, to }) => (
          <article
            key={label}
            className="card"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNav(to as View)}
          >
            <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {label}
            </p>
            <div className="kpi-value">{value}</div>
            <span className={good ? 'kpi-delta' : 'pill'}>↑ {delta}</span>
          </article>
        ))}
      </section>

      {/* Weekly Progress + Learning Progress */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div>
              <h3 style={{ margin: 0 }}>Weekly Readiness Trajectory</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                4-week historical progression across all 6 specialist agents
              </p>
            </div>
            <span className="pill green">+19 pts</span>
          </div>
          <div className="chart-bars">
            {[
              { w: 'Week 1', v: 72, label: '72%' },
              { w: 'Week 2', v: 78, label: '78%' },
              { w: 'Week 3', v: 84, label: '84%' },
              { w: 'Week 4 (Current)', v: 92, label: '92%' },
            ].map(({ w, v, label }) => (
              <div key={w} className="bar-item">
                <div className="bar-track">
                  <i style={{ height: `${v}%` }} title={`${w}: ${label}`} />
                </div>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Skill Mastery Progress</h3>
            <button className="btn-ghost btn-sm" onClick={() => handleNav('roadmap')}>
              Roadmap →
            </button>
          </div>
          <div className="meter-list" style={{ marginTop: '8px' }}>
            {[
              ['Python, OOP & Flask', 92],
              ['Data Structures & Algorithms', 84],
              ['SQL Query Optimization', 86],
              ['System Design & Caching', 68],
              ['STAR Behavioral Storytelling', 94],
            ].map(([label, value]) => (
              <div key={String(label)} className="stack-row">
                <div className="stack-label-row">
                  <span>{String(label)}</span>
                  <strong>{Number(value)}%</strong>
                </div>
                <div className="meter">
                  <i style={{ width: `${Number(value)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Upcoming SDE Interviews + Priority Focus Lane */}
      <section className="panel-grid">
        <article className="card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Upcoming Placement Rounds</h3>
            <span className="badge badge-accent">Campus Drive</span>
          </div>
          <ul className="list">
            <li>
              <div>
                <strong>Microsoft On-Campus Drive</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Software Development Engineer (SDE I)
                </p>
              </div>
              <button
                className="badge badge-green"
                style={{ border: 'none', cursor: 'pointer' }}
                onClick={() => handleNav('interview')}
              >
                Mock Today
              </button>
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => handleNav('interview')}>
              <div>
                <strong>Amazon SDE Internship Round</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  DSA &amp; Leadership Principles
                </p>
              </div>
              <span className="badge badge-amber">Tomorrow</span>
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => handleNav('interview')}>
              <div>
                <strong>Flipkart / Swiggy Backend Evaluation</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Python, Flask &amp; Database Architecture
                </p>
              </div>
              <span className="pill">In 4 days</span>
            </li>
          </ul>
        </article>

        <article className="card">
          <div className="section-title">
            <h3 style={{ margin: 0 }}>Immediate Focus Lane</h3>
            <button className="btn-ghost btn-sm" onClick={() => handleNav('resume')}>
              Fix Gaps →
            </button>
          </div>
          <ul className="list">
            <li style={{ cursor: 'pointer' }} onClick={() => handleNav('resume')}>
              <div>
                <strong>Resume ATS Metrics</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Quantify 2 project bullet points
                </p>
              </div>
              <span className="pill green">Ready to apply</span>
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => handleNav('interview')}>
              <div>
                <strong>System Design Fundamentals</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Complete Redis caching scenario
                </p>
              </div>
              <span className="pill amber">Needs polish</span>
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => handleNav('github')}>
              <div>
                <strong>GitHub Portfolio READMEs</strong>
                <p style={{ fontSize: '0.72rem', margin: '2px 0 0', color: 'var(--text-3)' }}>
                  Add demo GIF &amp; architecture diagram
                </p>
              </div>
              <span className="pill">Next priority</span>
            </li>
          </ul>
        </article>
      </section>
    </div>
  )
}
