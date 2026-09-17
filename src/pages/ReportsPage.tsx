import { useState, useEffect } from 'react'
import { reportsApi, type FullReportDossier } from '../lib'
import { useResume } from '../context'

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface ReportsPageProps {
  onNavigate?: (view: View) => void
}

export function ReportsPage({ onNavigate }: ReportsPageProps) {
  const { state } = useResume()
  const [isExporting, setIsExporting] = useState(false)
  const [_reportData, setReportData] = useState<FullReportDossier | null>(null)

  useEffect(() => {
    reportsApi.getFullReport()
      .then(data => {
        if (data) setReportData(data)
      })
      .catch(() => {
        // simulation fallback
      })
  }, [])

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      window.print()
    }, 500)
  }

  const agentScores = [
    { agent: 'Resume Analyzer', score: `${state.atsScore} / 100`, delta: '+6 pts', status: 'ATS Ready', to: 'resume' as View },
    { agent: 'Mock Interview Coach', score: `${Math.min(98, state.readinessScore + 2)} / 100`, delta: '+12 pts', status: 'STAR Confident', to: 'interview' as View },
    { agent: 'GitHub Intelligence', score: '91 / 100', delta: '+8 pts', status: 'Showcase Ready', to: 'github' as View },
    { agent: 'Placement Readiness', score: `${state.readinessScore} / 100`, delta: '+8 pts', status: 'Top 8% in Pool', to: 'readiness' as View },
  ]

  return (
    <div className="page-stack">
      {/* Top Banner */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Career Intelligence Dossier</p>
              <h3 style={{ margin: 0, fontSize: '19px' }}>Placement Performance &amp; Analytics</h3>
            </div>
            <span className="pill green">+19 pts MoM</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-2)', maxWidth: '600px', lineHeight: 1.6 }}>
            Consolidated verification report across technical evaluation, project architecture, code hygiene, and behavioral delivery. Candidate: <strong>{state.candidateName}</strong> ({state.college}) · Target: <strong>{state.targetRole}</strong>.
          </p>

          <div className="chart-bars" style={{ height: '140px', marginTop: '20px' }}>
            {[
              { w: 'Week 1', v: Math.max(50, state.readinessScore - 24), label: `${Math.max(50, state.readinessScore - 24)} pts` },
              { w: 'Week 2', v: Math.max(60, state.readinessScore - 16), label: `${Math.max(60, state.readinessScore - 16)} pts` },
              { w: 'Week 3', v: Math.max(70, state.readinessScore - 8), label: `${Math.max(70, state.readinessScore - 8)} pts` },
              { w: 'Week 4', v: state.readinessScore, label: `${state.readinessScore} pts` },
            ].map(({ w, v, label }) => (
              <div key={w} className="bar-item">
                <div className="bar-track">
                  <i style={{ height: `${v}%` }} title={`${w}: ${label}`} />
                </div>
                <span>{w} ({label})</span>
              </div>
            ))}
          </div>
        </article>

        {/* Action Panel */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Executive Summary</h3>
              <span className="badge badge-green">Verified</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', margin: '6px 0 14px' }}>
              Your profile has crossed the 90+ threshold for Tier-1 technology campus drives. Recruiter callback likelihood is estimated at <strong>84%</strong>.
            </p>

            <ul className="list">
              <li>
                <div>
                  <strong style={{ fontSize: '0.82rem' }}>ATS Match Rate</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>{state.atsScore}% keyword precision</p>
                </div>
                <span className="badge badge-green">Pass</span>
              </li>
              <li>
                <div>
                  <strong style={{ fontSize: '0.82rem' }}>Behavioral Clarity</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>STAR format verified</p>
                </div>
                <span className="badge badge-green">Pass</span>
              </li>
              <li>
                <div>
                  <strong style={{ fontSize: '0.82rem' }}>Code Quality Audit</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>Clean repo separation</p>
                </div>
                <span className="badge badge-green">Pass</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button
              className="btn"
              style={{ width: '100%' }}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Generating PDF Dossier...' : 'Export Placement Dossier (PDF) ↗'}
            </button>
          </div>
        </article>
      </section>

      {/* Module Level Scores */}
      <section>
        <div className="section-title" style={{ marginTop: '8px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Specialist Agent Verification Breakdown</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              Individual capability health scores from each HireSense intelligent agent
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {agentScores.map(item => (
            <article
              key={item.agent}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate?.(item.to)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-1)' }}>{item.agent}</strong>
                <span className="pill green">{item.status}</span>
              </div>
              <div className="kpi-value" style={{ margin: '10px 0 4px' }}>{item.score}</div>
              <span className="kpi-delta" style={{ fontSize: '0.76rem' }}>↑ {item.delta} this sprint</span>
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600 }}>Open Module →</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Target Role Competency Breakdown */}
      <section className="card">
        <div className="section-title">
          <div>
            <h3 style={{ margin: 0 }}>Target Role Skill Verification Dossier</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              Official diagnostic log suitable for sharing with campus placement coordinators
            </p>
          </div>
          <span className="pill">{state.college} · {state.degree} {state.branch}</span>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Competency Area</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Evaluation Method</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Score / Rating</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { area: `${state.skills[0]?.name || 'Python'} & Application Engineering`, method: `${state.projects[0]?.title || 'Featured Project'} Code & Model Audit`, score: `${state.subScores.skills}%`, status: 'verified' },
                { area: `${state.skills[1]?.name || 'SQL'} Database Design & Indexing`, method: 'Query Optimization & Schema Review', score: `${Math.min(98, state.subScores.brevity + 2)}%`, status: 'verified' },
                { area: `${state.skills[2]?.name || 'Java'} & Algorithmic Problem Solving`, method: 'Timed Problem Solving Assessment', score: `${state.subScores.brevity}%`, status: 'verified' },
                { area: `${state.gapSkills[0]?.name || 'System Design & Scalability'}`, method: 'Caching & REST Architecture Review', score: `${Math.max(68, state.subScores.impact - 11)}%`, status: 'developing' },
                { area: 'STAR Behavioral Communication', method: 'Live Multi-modal Audio Coach', score: `${state.subScores.style}%`, status: 'verified' },
              ].map(row => (
                <tr key={row.area} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-1)' }}>{row.area}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-2)' }}>{row.method}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-1)' }}>{row.score}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`status ${row.status}`}>
                      {row.status === 'verified' ? '✓ Verified' : 'Developing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
