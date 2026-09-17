import { useState, useEffect, type ChangeEvent } from 'react'
import { resumeApi } from '../lib'

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface AnalyzerPageProps {
  onNavigate?: (view: View) => void
}

export function AnalyzerPage({ onNavigate }: AnalyzerPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bullets' | 'skills' | 'checklist'>('overview')
  const [targetRole, setTargetRole] = useState('Software Developer')
  const [resumeFileName, setResumeFileName] = useState('Aravind_T_Resume.pdf')
  const [resumeFileSize, setResumeFileSize] = useState('2.4 MB')
  const [atsScore, setAtsScore] = useState(87)
  const [subScores, setSubScores] = useState({
    impact: 79,
    skills: 88,
    brevity: 86,
    style: 96,
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [completedFixes, setCompletedFixes] = useState<number[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    resumeApi.getAnalysis()
      .then(analysis => {
        if (analysis) {
          if (analysis.ats_score) setAtsScore(analysis.ats_score)
          if (analysis.filename) setResumeFileName(analysis.filename)
          if (analysis.file_size_formatted) setResumeFileSize(analysis.file_size_formatted)
          if (analysis.role) setTargetRole(analysis.role)
          if (analysis.sub_scores) {
            setSubScores({
              impact: analysis.sub_scores.impact || 79,
              skills: analysis.sub_scores.skills || 88,
              brevity: analysis.sub_scores.brevity || 86,
              style: analysis.sub_scores.style || 96,
            })
          }
        }
      })
      .catch(() => {
        // Backend offline or local simulation fallback
      })
  }, [])

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFileName(file.name)
      setResumeFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`)
      setIsAnalyzing(true)
      try {
        const result = await resumeApi.uploadResume(file)
        if (result) {
          if (result.ats_score) setAtsScore(result.ats_score)
          if (result.filename) setResumeFileName(result.filename)
          if (result.file_size_formatted) setResumeFileSize(result.file_size_formatted)
          if (result.sub_scores) {
            setSubScores({
              impact: result.sub_scores.impact || 79,
              skills: result.sub_scores.skills || 88,
              brevity: result.sub_scores.brevity || 86,
              style: result.sub_scores.style || 96,
            })
          }
        }
      } catch (err) {
        console.warn('Backend upload offline, using local simulation:', err)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleRescan = async () => {
    setIsAnalyzing(true)
    try {
      const analysis = await resumeApi.getAnalysis()
      if (analysis && analysis.ats_score) {
        setAtsScore(analysis.ats_score)
      }
    } catch {
      // simulation
    } finally {
      setTimeout(() => setIsAnalyzing(false), 750)
    }
  }

  const handleCopyBullet = (id: number, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleFix = (id: number) => {
    setCompletedFixes(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      setAtsScore(Math.min(96, 87 + next.length * 2))
      return next
    })
  }

  const bulletOptimizations = [
    {
      id: 1,
      project: 'Smart Crop Monitoring System',
      stack: 'Python · Flask · OpenCV · Machine Learning',
      original: 'Built a crop monitoring dashboard using Python and OpenCV for agricultural diagnostics.',
      improved:
        'Engineered an edge-AI crop health diagnostic system in Python & OpenCV, processing 1,200+ leaf imagery samples with 92.4% disease classification accuracy; deployed via Flask backend with sub-250ms API latency.',
      impact: '+6 ATS points · Quantified metrics & latency added',
      category: 'Impact & Quantification',
    },
    {
      id: 2,
      project: 'Personalized Recommendation Engine',
      stack: 'Python · SQL · PyTorch · Scikit-Learn',
      original: 'Developed a machine learning recommendation algorithm with SQL database backend.',
      improved:
        'Architected a hybrid collaborative-filtering recommendation engine in Python & SQL, elevating relevance CTR by 24.6% across 10,000+ simulated user sessions with optimized indexed queries.',
      impact: '+5 ATS points · Measurable engagement delta & indexing mentioned',
      category: 'Technical Depth',
    },
    {
      id: 3,
      project: 'Campus Placement & Student Performance Portal',
      stack: 'Java · Spring Boot · MySQL · REST APIs',
      original: 'Created student portal for placement preparation and mock exam submissions.',
      improved:
        'Built secure RESTful microservices using Java & Spring Boot to handle concurrent mock assessments for 800+ candidate profiles, enforcing strict role-based access control and ACID transaction integrity.',
      impact: '+4 ATS points · Concurrency, architecture & security keywords',
      category: 'Architecture Keywords',
    },
  ]

  const matchedSkills = [
    { name: 'Python', strength: 'Strong', match: 98 },
    { name: 'SQL & Query Design', strength: 'Strong', match: 94 },
    { name: 'Machine Learning', strength: 'Strong', match: 91 },
    { name: 'Flask / REST APIs', strength: 'Strong', match: 90 },
    { name: 'Java & OOP', strength: 'Good', match: 86 },
    { name: 'Git & Version Control', strength: 'Strong', match: 95 },
    { name: 'Data Structures & Algorithms', strength: 'Good', match: 84 },
    { name: 'OpenCV / Computer Vision', strength: 'Specialized', match: 89 },
  ]

  const gapSkills = [
    { name: 'System Design / Caching (Redis)', impact: 'High', reason: 'Commonly evaluated in Tier-1 SDE rounds' },
    { name: 'Docker / Containerization', impact: 'Medium', reason: 'Shows cloud readiness in modern development' },
    { name: 'CI/CD Pipeline Workflow', impact: 'Medium', reason: 'Strengthens production-grade engineering profile' },
  ]

  const suggestions = [
    {
      id: 1,
      priority: 'High Priority',
      color: 'red',
      title: 'Quantify impact in Project #1 (Smart Crop Monitoring)',
      detail: 'Add precision numbers (e.g. 92% classification accuracy, 1,200+ samples) to stand out to automated parsers.',
    },
    {
      id: 2,
      priority: 'High Priority',
      color: 'red',
      title: 'Explicitly specify System Design & Caching competencies',
      detail: 'Adding Redis or distributed caching mention will raise SDE role compatibility past 90.',
    },
    {
      id: 3,
      priority: 'Medium Priority',
      color: 'amber',
      title: 'Refine professional summary statement',
      detail: 'Align summary directly with "Software Developer with hands-on AI/ML & scalable backend engineering".',
    },
    {
      id: 4,
      priority: 'Low Priority',
      color: 'green',
      title: 'Formatting & Section Header Consistency',
      detail: 'Single-column structure is already 96% ATS-compliant. Keep font standard (DM Sans or Arial).',
    },
  ]

  return (
    <div className="page-stack">
      {/* Top Overview & Active Resume Banner */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Resume Intelligence Engine</p>
              <h3 style={{ fontSize: '20px', margin: 0 }}>Resume Signal &amp; ATS Audit</h3>
            </div>
            <div className="pill-row" style={{ margin: 0 }}>
              <span className="pill green">✓ ATS Ready ({atsScore}/100)</span>
              <span className="pill">PDF · 1-Column Format</span>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-2)', maxWidth: '620px', lineHeight: 1.6 }}>
            Scanned against 450+ campus recruitment rubrics for <strong>{targetRole}</strong>. Your profile demonstrates exceptional project execution and backend fundamentals.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginTop: '16px',
            padding: '12px 16px',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>📄</span>
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-1)' }}>{resumeFileName}</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: 0 }}>
                  {resumeFileSize} · Candidate: Aravind T (VIT Vellore)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                <span>Replace File</span>
                <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
              <button
                className="btn btn-sm"
                onClick={handleRescan}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Scanning Resume...' : 'Re-scan ↺'}
              </button>
            </div>
          </div>

          {/* Interactive Role Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>
              Target Role:
            </span>
            {['Software Developer', 'AI / ML Engineer', 'Backend Developer', 'Data Scientist'].map(role => (
              <button
                key={role}
                className={`pill${targetRole === role ? ' accent' : ''}`}
                style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => setTargetRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </article>

        {/* ATS Score Card with Sub-scores */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>ATS Compatibility</h3>
              <span className="badge badge-green">Top 10%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 4px' }}>
              <span className="score-large" style={{ margin: 0 }}>{atsScore}</span>
              <span style={{ fontSize: '1rem', color: 'var(--text-3)' }}>/ 100</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', margin: 0 }}>
              Applying recommended project metric fixes can lift score to <strong>94+</strong>.
            </p>
          </div>

          <div className="meter-list" style={{ marginTop: '14px' }}>
            {[
              { label: 'Keyword Alignment', value: subScores.skills },
              { label: 'Impact & Quantification', value: subScores.impact },
              { label: 'Technical Depth', value: subScores.brevity },
              { label: 'ATS Format Compliance', value: subScores.style },
            ].map(({ label, value }) => (
              <div key={label} className="stack-row">
                <div className="stack-label-row">
                  <span style={{ fontSize: '0.74rem' }}>{label}</span>
                  <strong style={{ fontSize: '0.76rem' }}>{value}%</strong>
                </div>
                <div className="meter">
                  <i style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mini-panel" style={{ marginTop: '12px', padding: '10px 12px' }}>
            <p style={{ fontSize: '0.68rem' }}>Parser Feedback</p>
            <strong style={{ fontSize: '0.76rem', color: 'var(--text-1)' }}>
              Standard single-column format detected. Zero font parsing errors found.
            </strong>
          </div>
        </article>
      </section>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '2px',
        overflowX: 'auto',
      }}>
        {[
          { key: 'overview', label: 'Overview & Highlights' },
          { key: 'bullets', label: 'Project Bullet Optimizer (AI Rewrite)' },
          { key: 'skills', label: 'Skills & Keyword Match' },
          { key: 'checklist', label: `Actionable Checklist (${completedFixes.length}/${suggestions.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            className={`btn${activeTab === tab.key ? '' : '-ghost'} btn-sm`}
            style={{
              borderRadius: 'var(--r-md) var(--r-md) 0 0',
              borderBottom: 'none',
              fontWeight: 600,
            }}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <section className="panel-grid">
          <article className="card">
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Detected Resume Projects</h3>
              <span className="pill">2 Found</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <div style={{
                background: 'var(--bg-inset)',
                padding: '14px',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-1)' }}>Smart Crop Monitoring System</strong>
                  <span className="pill green" style={{ fontSize: '0.68rem' }}>92% Strength</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 6px' }}>
                  Python · Flask · OpenCV · Machine Learning
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', margin: 0 }}>
                  Computer vision analytics for crop health. Great technical depth, recommended to add clear scale numbers.
                </p>
              </div>

              <div style={{
                background: 'var(--bg-inset)',
                padding: '14px',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-1)' }}>Recommendation Engine</strong>
                  <span className="pill green" style={{ fontSize: '0.68rem' }}>88% Strength</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 6px' }}>
                  Python · SQL · PyTorch · Scikit-Learn
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', margin: 0 }}>
                  Collaborative-filtering recommendation engine. Query performance and relevance metrics stand out positively.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('bullets')}>
                View AI Bullet Rewrites →
              </button>
            </div>
          </article>

          <article className="card">
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Top ATS Recommendations</h3>
              <span className="badge badge-accent">AI Prioritized</span>
            </div>
            <ul className="list">
              {suggestions.map(s => (
                <li key={s.id} style={{ alignItems: 'flex-start' }}>
                  <div>
                    <span className={`badge badge-${s.color === 'red' ? 'amber' : s.color === 'green' ? 'green' : 'accent'}`} style={{ fontSize: '0.66rem', marginBottom: '4px' }}>
                      {s.priority}
                    </span>
                    <strong style={{ display: 'block', fontSize: '0.82rem', marginTop: '2px' }}>
                      {s.title}
                    </strong>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                      {s.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {/* Tab 2: Project Bullet Optimizer */}
      {activeTab === 'bullets' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card" style={{ padding: '16px 20px' }}>
            <p className="eyebrow" style={{ marginBottom: 4 }}>AI Bullet Point Enhancement</p>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Quantified Impact Rewrites</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', margin: '4px 0 0' }}>
              Replace passive bullet points with structured action-verb statements that recruiter ATS systems rank highest.
            </p>
          </div>

          {bulletOptimizations.map((item) => (
            <article key={item.id} className="card">
              <div className="section-title">
                <div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-1)' }}>{item.project}</strong>
                  <p style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 0' }}>
                    {item.stack}
                  </p>
                </div>
                <span className="pill green">{item.impact}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '12px' }}>
                <div style={{
                  background: 'var(--bg-inset)',
                  padding: '14px',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                    Current Resume Bullet
                  </span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginTop: '8px', lineHeight: 1.5 }}>
                    &ldquo;{item.original}&rdquo;
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 500 }}>
                    Missing quantitative scale &amp; latency metrics
                  </span>
                </div>

                <div style={{
                  background: 'rgba(67, 139, 105, 0.06)',
                  padding: '14px',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid rgba(67, 139, 105, 0.28)',
                }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                    ★ AI Optimized Recommendation
                  </span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-1)', marginTop: '8px', lineHeight: 1.5, fontWeight: 500 }}>
                    &ldquo;{item.improved}&rdquo;
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button
                      className={`btn btn-sm ${copiedId === item.id ? 'btn-secondary' : ''}`}
                      onClick={() => handleCopyBullet(item.id, item.improved)}
                    >
                      {copiedId === item.id ? 'Copied! ✓' : 'Copy Bullet'}
                    </button>
                    <span className="badge badge-green" style={{ alignSelf: 'center' }}>
                      Ready to Paste
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Tab 3: Skills Match */}
      {activeTab === 'skills' && (
        <section className="panel-grid">
          <article className="card">
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Detected Skills ({matchedSkills.length})</h3>
              <span className="pill green">Matched for {targetRole}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '14px' }}>
              These skills were extracted directly from your resume and matched against applicant rubrics.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {matchedSkills.map(s => (
                <div
                  key={s.name}
                  style={{
                    background: 'var(--bg-inset)',
                    padding: '10px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <strong style={{ fontSize: '0.82rem', display: 'block', color: 'var(--text-1)' }}>{s.name}</strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--green)', fontWeight: 600 }}>{s.strength}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{s.match}%</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Key Missing Keywords</h3>
              <span className="badge badge-amber">Gap Analysis</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '14px' }}>
              Incorporating these keywords in your project descriptions will significantly raise role matching.
            </p>
            <ul className="list">
              {gapSkills.map(gap => (
                <li key={gap.name} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <strong style={{ fontSize: '0.84rem' }}>{gap.name}</strong>
                    <span className={`pill${gap.impact === 'High' ? ' accent' : ''}`} style={{ fontSize: '0.68rem' }}>
                      {gap.impact} Priority
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: 0 }}>
                    {gap.reason}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mini-panel" style={{ marginTop: '16px' }}>
              <p>Quick Tip</p>
              <strong style={{ fontSize: '0.76rem' }}>
                You already used Redis caching in your coursework. Adding 1 sentence to your portal project will resolve this gap.
              </strong>
            </div>
          </article>
        </section>
      )}

      {/* Tab 4: Checklist */}
      {activeTab === 'checklist' && (
        <article className="card">
          <div className="section-title">
            <div>
              <h3 style={{ margin: 0 }}>Actionable ATS Fixes</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                Check off items as you update your resume file
              </p>
            </div>
            <span className="pill green">{completedFixes.length} of {suggestions.length} Completed</span>
          </div>

          <ul className="list" style={{ marginTop: '12px' }}>
            {suggestions.map(s => {
              const isChecked = completedFixes.includes(s.id)
              return (
                <li
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 10px',
                    opacity: isChecked ? 0.6 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFix(s.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{
                        fontSize: '0.88rem',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        color: 'var(--text-1)',
                      }}>
                        {s.title}
                      </strong>
                      <span className={`badge badge-${s.color === 'red' ? 'amber' : s.color === 'green' ? 'green' : 'accent'}`} style={{ fontSize: '0.66rem' }}>
                        {s.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-3)', margin: '4px 0 0' }}>
                      {s.detail}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={() => alert('Resume updated! New ATS score: 94/100')}>
              Save &amp; Recalculate Score
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate?.('interview')}>
              Practice Resume Defense in Mock Interview →
            </button>
          </div>
        </article>
      )}
    </div>
  )
}
