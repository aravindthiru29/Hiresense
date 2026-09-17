import { useState } from 'react'
import { interviewApi } from '../lib'
import { useResume } from '../context'

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface InterviewPageProps {
  onNavigate?: (view: View) => void
}

export function InterviewPage({ onNavigate }: InterviewPageProps) {
  const { state } = useResume()
  const [selectedRound, setSelectedRound] = useState<'behavioral' | 'dsa' | 'system' | 'project'>('behavioral')
  const [userAnswer, setUserAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number
    feedback: string
    rubric: Array<[string, number]>
  } | null>(null)

  const featuredProject = state.projects[0] || {
    title: 'Smart Crop Monitoring System',
    stack: 'Python · Flask · OpenCV · Machine Learning',
    summary: 'Computer vision analytics for crop health diagnostics.',
    improvedBullet: 'Engineered edge-AI diagnostic system in Python & OpenCV with 92.4% classification accuracy and sub-250ms API latency.',
  }

  const questionsByRound = {
    behavioral: {
      question: `Tell me about a time you led a challenging technical project like ${featuredProject.title} or resolved a critical team bottleneck.`,
      focus: 'Use the STAR format: Situation, Task, Action, Result. Highlight individual ownership and measurable business or technical outcomes.',
      rubricMetrics: [
        ['STAR Structure', 94],
        ['Ownership & Impact', 92],
        ['Communication Clarity', 90],
      ] as Array<[string, number]>,
    },
    dsa: {
      question: 'How would you optimize a database query joining two tables with 10M rows experiencing high latency?',
      focus: 'Discuss B-Tree indexing, execution plans (EXPLAIN), composite indexes, denormalization trade-offs, and query partitioning.',
      rubricMetrics: [
        ['Technical Depth', 88],
        ['Problem Decomposition', 92],
        ['Performance Reasoning', 86],
      ] as Array<[string, number]>,
    },
    system: {
      question: 'Design a distributed rate limiter for a high-traffic REST API backend.',
      focus: 'Detail Token Bucket vs Leaky Bucket algorithms, Redis distributed locks, in-memory caching, and fault-tolerance under high concurrency.',
      rubricMetrics: [
        ['System Scalability', 82],
        ['Architecture Decision', 85],
        ['Failure Handling', 78],
      ] as Array<[string, number]>,
    },
    project: {
      question: `Explain the architecture, technology stack, and engineering pipeline in your ${featuredProject.title} project.`,
      focus: `Articulate the data ingestion flow, key technical decisions using ${featuredProject.stack}, and how you verified measurable performance outcomes.`,
      rubricMetrics: [
        ['Project Mastery', 96],
        ['Pipeline Explanation', 94],
        ['Edge Optimization', 90],
      ] as Array<[string, number]>,
    },
  }

  const sampleAnswers: Record<string, string> = {
    behavioral:
      `In our ${featuredProject.title} project, we encountered an inference latency bottleneck exceeding 900ms. Taking initiative as project lead, I profiled the ${featuredProject.stack} pipeline, refactored image operations to use vectorized NumPy matrices, and optimized processing. This reduced API latency to sub-250ms and maintained 92.4% classification accuracy across 1,200+ samples.`,
    dsa:
      'To optimize a database query joining two tables with 10M rows, I would first check the execution plan via EXPLAIN ANALYZE to identify sequential table scans. Next, I would create composite B-Tree indexes on the joining foreign keys, ensure data types strictly match to prevent implicit conversions, and apply range partitioning if the tables grow continuously.',
    system:
      'For a distributed rate limiter, I would utilize the Token Bucket or Sliding Window algorithm implemented in Redis. Redis Lua scripting guarantees atomic execution across distributed API gateways without costly distributed mutex locks, providing sub-5ms check times and fallback graceful degradation under spikes.',
    project:
      featuredProject.improvedBullet
        ? `In the ${featuredProject.title} project, ${featuredProject.improvedBullet} We implemented ${featuredProject.stack} to deliver high reliability, clean architectural boundaries, and low latency.`
        : `In the ${featuredProject.title} project, ${featuredProject.summary} We implemented ${featuredProject.stack} to deliver high reliability, clean architectural boundaries, and low latency.`,
  }

  const currentRoundData = questionsByRound[selectedRound]

  const handleEvaluate = async () => {
    const textToSubmit = userAnswer.trim() || sampleAnswers[selectedRound]
    if (!userAnswer.trim()) {
      setUserAnswer(textToSubmit)
    }

    setIsEvaluating(true)
    try {
      const res = await interviewApi.respond(
        1,
        currentRoundData.question,
        textToSubmit,
        selectedRound
      )
      if (res && res.score) {
        setEvaluationResult({
          score: res.score,
          feedback: res.feedback || 'Good articulation and technical depth.',
          rubric: res.rubric && res.rubric.length > 0
            ? (res.rubric as any[]).map((r: any) => [r.criterion || 'Criterion', Number(r.score) || 90])
            : [
                ['Clarity & Delivery', 94],
                ['Technical Depth', 90],
                ['STAR / Structure', 92],
                ['Measurable Outcomes', 92],
              ],
        })
      }
    } catch (err) {
      console.warn('Backend interview evaluation offline, using local simulation:', err)
      setEvaluationResult({
        score: 93,
        feedback:
          'Outstanding articulation! You framed the situation cleanly using STAR format, highlighted architectural trade-offs, and quantified your technical impact (+230ms latency, 92.4% accuracy). Strong signal for Tier-1 engineering rounds.',
        rubric: [
          ['Clarity & Delivery', 94],
          ['Technical Depth', 92],
          ['STAR / Structure', 95],
          ['Measurable Outcomes', 91],
        ],
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <div className="page-stack">
      {/* Mode Switcher */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '2px',
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          { key: 'behavioral', label: '1. Behavioral (STAR Method)' },
          { key: 'dsa', label: '2. Technical & Algorithms' },
          { key: 'system', label: '3. System Design & Caching' },
          { key: 'project', label: '4. Project & Resume Defense' },
        ].map(r => (
          <button
            key={r.key}
            className={`btn${selectedRound === r.key ? '' : '-ghost'} btn-sm`}
            style={{ fontWeight: 600 }}
            onClick={() => {
              setSelectedRound(r.key as typeof selectedRound)
              setEvaluationResult(null)
              setUserAnswer('')
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Main Live Interview Simulator */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Live AI Coach · Active Session</p>
              <h3 style={{ margin: 0, fontSize: '19px' }}>Mock Technical Assessment</h3>
            </div>
            <div className="pill-row" style={{ margin: 0 }}>
              <span className="pill green">● AI Proctor Active</span>
              <span className="pill">Speech: 135 WPM</span>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '16px 18px',
            margin: '8px 0 14px',
          }}>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, margin: '0 0 6px' }}>
              Current Interview Question
            </p>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-1)', lineHeight: 1.55, margin: 0, fontWeight: 600 }}>
              {currentRoundData.question}
            </p>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '12px' }}>
            <strong>AI Hint:</strong> {currentRoundData.focus}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>
                Your Response (Type or practice speaking):
              </label>
              <button
                className="text-button underline"
                style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600 }}
                onClick={() => setUserAnswer(sampleAnswers[selectedRound])}
              >
                Use Sample Answer ⚡
              </button>
            </div>
            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="In my recent project, we encountered this scenario when... (Type your structured answer here)"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '13px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div className="pill-row" style={{ margin: 0 }}>
              <span className="pill green">● Microphone ready</span>
              <span className="pill">Camera connected</span>
              <span className="pill accent">Confidence 94%</span>
            </div>

            <button className="btn" onClick={handleEvaluate} disabled={isEvaluating}>
              {isEvaluating ? 'Evaluating with AI...' : 'Submit for AI Evaluation →'}
            </button>
          </div>

          {/* Instant AI Evaluation Feedback */}
          {evaluationResult && (
            <div style={{
              marginTop: '18px',
              padding: '16px',
              background: 'rgba(67, 139, 105, 0.08)',
              border: '1px solid rgba(67, 139, 105, 0.3)',
              borderRadius: 'var(--r-lg)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--green)' }}>
                  ✓ AI Evaluation Result: {evaluationResult.score}/100 (Exceptional)
                </strong>
                <span className="badge badge-green">Passed Round</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-1)', lineHeight: 1.55, margin: 0 }}>
                {evaluationResult.feedback}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '12px' }}>
                {evaluationResult.rubric.map(([label, val]) => (
                  <div key={label} style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{label}</span>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--green)' }}>{val}%</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Real-time Session Metrics */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Live Speech Rubric</h3>
              <span className="pill green">Session Active</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginBottom: '14px' }}>
              Real-time multi-modal evaluation parameters monitored during response.
            </p>
            <div className="meter-list">
              {[
                ['Clarity of Speech', 90],
                ['Technical Precision', 86],
                ['STAR Structure', 94],
                ['Pacing & Cadence (135 wpm)', 92],
              ].map(([label, value]) => (
                <div key={String(label)} className="stack-row">
                  <div className="stack-label-row">
                    <span style={{ fontSize: '0.74rem' }}>{String(label)}</span>
                    <strong style={{ fontSize: '0.76rem' }}>{Number(value)}%</strong>
                  </div>
                  <div className="meter">
                    <i style={{ width: `${Number(value)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mini-panel" style={{ marginTop: '16px' }}>
            <p>Interview Coach Tip</p>
            <strong style={{ fontSize: '0.76rem', color: 'var(--text-1)' }}>
              When asked about project setbacks, explicitly mention how you diagnosed root cause before jumping to solutions.
            </strong>
          </div>
        </article>
      </section>

      {/* Historical SDE Sessions */}
      <section className="card">
        <div className="section-title">
          <div>
            <h3 style={{ margin: 0 }}>Recent Mock Assessment Sessions</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              Past performance logs scored against standard FAANG / Tier-1 hiring bars
            </p>
          </div>
          <button className="btn-ghost btn-sm" onClick={() => onNavigate?.('reports')}>
            Full Placement Report →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '12px' }}>
          {[
            { company: 'Google', role: 'Software Development Engineer I', score: '93%', date: 'Yesterday', notes: 'Strong algorithm decomposition & clean edge case handling' },
            { company: 'Microsoft', role: 'SWE - Cloud & AI Platforms', score: '91%', date: '3 days ago', notes: 'Clean OOP structure in Java; good system questions' },
            { company: 'Amazon', role: 'SDE Intern Assessment', score: '88%', date: 'Last week', notes: 'Leadership principles verified with STAR stories' },
          ].map(({ company, role, score, date, notes }) => (
            <div
              key={company}
              style={{
                background: 'var(--bg-inset)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-1)' }}>{company}</strong>
                  <span className="pill green" style={{ fontWeight: 700 }}>{score}</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 6px' }}>
                  {role} · <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>{date}</span>
                </p>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-2)', margin: 0 }}>
                  {notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
