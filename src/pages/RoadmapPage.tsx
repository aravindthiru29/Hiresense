import { useState, useEffect } from 'react'
import { roadmapApi } from '../lib'

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface RoadmapPageProps {
  onNavigate?: (view: View) => void
}

export function RoadmapPage({ onNavigate }: RoadmapPageProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([
    'w1-1',
    'w1-2',
    'w2-1',
  ])

  useEffect(() => {
    roadmapApi.getRoadmap()
      .then(data => {
        if (data && data.sprints) {
          const completedCodes: string[] = []
          data.sprints.forEach(s => {
            s.tasks?.forEach(t => {
              if (t.is_completed) {
                completedCodes.push(t.task_code)
              }
            })
          })
          if (completedCodes.length > 0) {
            setCompletedTasks(completedCodes)
          }
        }
      })
      .catch(() => {
        // Backend offline or local default
      })
  }, [])

  const toggleTask = (id: string) => {
    const isNowCompleted = !completedTasks.includes(id)
    setCompletedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id],
    )
    const numericId = parseInt(id.replace(/[^0-9]/g, ''), 10) || 1
    roadmapApi.toggleTask(numericId, isNowCompleted).catch(() => {
      // Offline fallback
    })
  }

  const sprints = [
    {
      week: 'Week 1',
      title: 'Resume ATS & Project Architecture Polish',
      status: 'Completed',
      statusClass: 'green',
      tasks: [
        { id: 'w1-1', text: 'Run ATS audit on Aravind_T_Resume.pdf for Software Developer role' },
        { id: 'w1-2', text: 'Quantify Smart Crop Monitoring metrics (92.4% accuracy, sub-250ms latency)' },
        { id: 'w1-3', text: 'Add collaborative-filtering and indexing bullets to recommendation project' },
      ],
      deliverable: 'Delivered: 87/100 ATS resume ready for campus drives',
    },
    {
      week: 'Week 2 (Active)',
      title: 'Core DSA & Algorithmic Problem Solving Sprint',
      status: 'In Progress',
      statusClass: 'accent',
      tasks: [
        { id: 'w2-1', text: 'Solve 15 Tree & Graph traversal problems in Python/Java' },
        { id: 'w2-2', text: 'Master Dynamic Programming state transitions (Knapsack & Subsequence patterns)' },
        { id: 'w2-3', text: 'Complete timed 45-min coding round simulation in Mock Interview coach' },
      ],
      deliverable: 'Target: 88%+ Technical Problem-Solving readiness score',
    },
    {
      week: 'Week 3',
      title: 'System Design & Scalable Backend Architecture',
      status: 'Upcoming',
      statusClass: 'amber',
      tasks: [
        { id: 'w3-1', text: 'Design Distributed Rate Limiter with Redis token bucket algorithm' },
        { id: 'w3-2', text: 'Review database indexing B-Tree mechanics and SQL query execution plans' },
        { id: 'w3-3', text: 'Document Architecture Decision Record (ADR) in GitHub recsys repo' },
      ],
      deliverable: 'Target: Pass Tier-1 SDE system architecture rounds',
    },
    {
      week: 'Week 4',
      title: 'Mock Interview Marathon & High-Priority Applications',
      status: 'Planned',
      statusClass: '',
      tasks: [
        { id: 'w4-1', text: 'Conduct 3 full-length FAANG/Tier-1 behavioral STAR mock interviews' },
        { id: 'w4-2', text: 'Submit 10 tailored applications to Microsoft, Amazon, and top AI unicorns' },
        { id: 'w4-3', text: 'Export finalized Placement Readiness Dossier & verified skills sheet' },
      ],
      deliverable: 'Target: Secure initial technical screen invitations',
    },
  ]

  const totalTasks = sprints.reduce((acc, s) => acc + s.tasks.length, 0)
  const progressPct = Math.round((completedTasks.length / totalTasks) * 100)

  return (
    <div className="page-stack">
      {/* Top Banner */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Sprint Execution Engine</p>
              <h3 style={{ margin: 0, fontSize: '19px' }}>4-Week Placement Readiness Roadmap</h3>
            </div>
            <div className="pill-row" style={{ margin: 0 }}>
              <span className="pill green">● Week 2 Active</span>
              <span className="pill">Campus Drive: 24 Days Left</span>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-2)', maxWidth: '620px', lineHeight: 1.6 }}>
            Structured 4-week preparation trajectory taking your profile from <strong>prepared</strong> to <strong>placed</strong>. Each sprint addresses automated screening and technical interview rounds.
          </p>

          <div style={{ marginTop: '16px' }}>
            <div className="stack-label-row">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-1)', fontWeight: 600 }}>Overall Roadmap Completion</span>
              <strong style={{ fontSize: '0.84rem', color: 'var(--accent)' }}>{progressPct}% ({completedTasks.length}/{totalTasks} Tasks Done)</strong>
            </div>
            <div className="meter" style={{ height: '7px', marginTop: '6px' }}>
              <i style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </article>

        {/* Quick Launch Card */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>This Week&apos;s Focus</h3>
              <span className="badge badge-accent">Sprint 02</span>
            </div>
            <strong style={{ fontSize: '0.94rem', display: 'block', color: 'var(--text-1)', margin: '6px 0 4px' }}>
              DSA &amp; Timed Problem Solving
            </strong>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', margin: 0 }}>
              Complete the Dynamic Programming drill to raise your technical problem-solving index above 88%.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn btn-sm" onClick={() => onNavigate?.('interview')}>
              Practice in Mock Coach →
            </button>
            <button className="btn-secondary btn-sm" onClick={() => onNavigate?.('resume')}>
              Review Resume ATS
            </button>
          </div>
        </article>
      </section>

      {/* 4-Week Detailed Timeline */}
      <section className="card">
        <div className="section-title">
          <div>
            <h3 style={{ margin: 0 }}>Sprint Timeline &amp; Task Deliverables</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              Check off tasks as you complete them to automatically advance your placement readiness
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          {sprints.map(sprint => (
            <div
              key={sprint.week}
              style={{
                background: 'var(--bg-inset)',
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--accent)' }}>{sprint.week}</strong>
                  <span style={{ color: 'var(--text-disabled)' }}>—</span>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-1)' }}>{sprint.title}</strong>
                </div>
                <span className={`pill${sprint.statusClass ? ` ${sprint.statusClass}` : ''}`} style={{ fontWeight: 700 }}>
                  {sprint.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
                {sprint.tasks.map(task => {
                  const isDone = completedTasks.includes(task.id)
                  return (
                    <label
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.82rem',
                        color: isDone ? 'var(--text-3)' : 'var(--text-1)',
                        textDecoration: isDone ? 'line-through' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleTask(task.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                      />
                      <span>{task.text}</span>
                    </label>
                  )
                })}
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
                  {sprint.deliverable}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 600 }}>
                  {sprint.tasks.filter(t => completedTasks.includes(t.id)).length} / {sprint.tasks.length} Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
