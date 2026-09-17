import { useState, useEffect } from 'react'
import { profileApi } from '../lib'
import { useResume } from '../context'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'AT'
}

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'

interface ProfilePageProps {
  onNavigate?: (view: View) => void
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { state, updateProfile } = useResume()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(state.candidateName)
  const [targetRole, setTargetRole] = useState(state.targetRole)
  const [college, setCollege] = useState(state.college)
  const [degree, setDegree] = useState(state.degree)
  const [branch, setBranch] = useState(state.branch)
  const [gradYear, setGradYear] = useState(state.graduationYear)
  const [bio, setBio] = useState(
    `Aspiring ${state.targetRole} with strong foundations in Python, Java, SQL, and Flask. Passionate about building high-performance backend systems and data-driven intelligent applications.`,
  )
  const [githubHandle, setGithubHandle] = useState('github.com/aravind-t')
  const [email, setEmail] = useState('aravind.t@vitstudent.ac.in')

  useEffect(() => {
    profileApi.getProfile()
      .then(p => {
        if (p) {
          if (p.full_name) setFullName(p.full_name)
          if (p.college) setCollege(p.college)
          if (p.degree) setDegree(p.degree)
          if (p.branch) setBranch(p.branch)
          if (p.graduation_year) setGradYear(String(p.graduation_year))
          if (p.target_role) setTargetRole(p.target_role)
          if (p.bio) setBio(p.bio)
          if (p.github_handle) setGithubHandle(p.github_handle)
          if (p.email) setEmail(p.email)
        }
      })
      .catch(() => {
        // Backend offline or local default
      })
  }, [])

  const handleToggleEdit = async () => {
    if (isEditing) {
      updateProfile({
        candidateName: fullName,
        college,
        degree,
        branch,
        graduationYear: gradYear,
        targetRole,
      })

      try {
        await profileApi.updateProfile({
          full_name: fullName,
          college,
          degree,
          branch,
          graduation_year: parseInt(gradYear, 10) || 2026,
          target_role: targetRole,
          bio,
          github_handle: githubHandle,
        })
      } catch (err) {
        console.warn('Backend profile update offline, saved locally:', err)
      }
    }
    setIsEditing(!isEditing)
  }

  const verifiedSkills = state.skills.map(s => ({
    name: s.name,
    resumeClaim: s.resumeClaim || 'Intermediate',
    demonstrated: s.demonstrated || (s.status === 'verified' ? 'Strong' : 'Intermediate'),
    status: s.status || 'verified',
    score: s.score || 88,
  }))

  const projects = state.projects.map(p => ({
    title: p.title,
    stack: p.stack,
    summary: p.summary,
    link: p.link || `github.com/aravind-t/${p.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    badge: p.badge || 'Featured Project',
  }))

  return (
    <div className="page-stack">
      {/* Profile Header Card */}
      <section className="panel-grid">
        <article className="card wide">
          <div className="section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="avatar" style={{ width: 52, height: 52, fontSize: '18px', fontWeight: 700 }}>
                {getInitials(fullName)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.04em' }}>
                    {fullName}
                  </h2>
                  <span className="pill green">Open for Placements</span>
                </div>
                <p style={{ fontSize: '0.8rem', margin: '4px 0 0', color: 'var(--text-2)' }}>
                  {targetRole} · {degree} in {branch} · Class of {gradYear}
                </p>
                <p style={{ fontSize: '0.74rem', margin: '2px 0 0', color: 'var(--accent)', fontWeight: 600 }}>
                  {college}
                </p>
              </div>
            </div>

            <button
              className={`btn ${isEditing ? '' : 'btn-secondary'} btn-sm`}
              onClick={handleToggleEdit}
            >
              {isEditing ? 'Save Changes ✓' : 'Edit Profile ✎'}
            </button>
          </div>

          {isEditing ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                Full Name
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                Target Role
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                College / University
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                Degree
                <input
                  type="text"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                Graduation Year
                <input
                  type="text"
                  value={gradYear}
                  onChange={e => setGradYear(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                Specialization / Branch
                <input
                  type="text"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600, gridColumn: '1 / -1' }}>
                Bio &amp; Summary
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={2}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)', fontFamily: 'inherit', fontSize: '13px' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                Email Address
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: 'var(--text-3)', fontWeight: 600 }}>
                GitHub Profile Handle
                <input
                  type="text"
                  value={githubHandle}
                  onChange={e => setGithubHandle(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                />
              </label>
            </div>
          ) : (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-2)', lineHeight: 1.6, marginTop: 14, maxWidth: '640px' }}>
              {bio}
            </p>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-3)' }}>
              📧 <strong style={{ color: 'var(--text-1)', fontWeight: 500 }}>{email}</strong>
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-3)' }}>
              🐙 <strong style={{ color: 'var(--text-1)', fontWeight: 500 }}>{githubHandle}</strong>
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-3)' }}>
              🎓 <strong style={{ color: 'var(--text-1)', fontWeight: 500 }}>GPA: 8.9 / 10.0</strong>
            </span>
          </div>
        </article>

        {/* Profile Completeness Card */}
        <article className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-title">
              <h3 style={{ margin: 0 }}>Profile Signal</h3>
              <span className="badge badge-green">{state.readinessScore}% Complete</span>
            </div>
            <div className="meter" style={{ height: '7px', margin: '10px 0 8px' }}>
              <i style={{ width: `${state.readinessScore}%` }} />
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-2)', margin: 0 }}>
              Profile health synced with active ATS score ({state.atsScore}/100).
            </p>
          </div>

          <div className="mini-panel" style={{ marginTop: '14px' }}>
            <p>Final Step to 100%</p>
            <strong style={{ fontSize: '0.78rem', color: 'var(--text-1)' }}>
              Complete ML Machine Learning Verification Assessment (15 mins)
            </strong>
            <div style={{ marginTop: '8px' }}>
              <button className="btn btn-sm" onClick={() => onNavigate?.('interview')}>
                Take Assessment →
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Verified Skills Matrix */}
      <section className="card">
        <div className="section-title">
          <div>
            <h3 style={{ margin: 0 }}>Verified Technical Skills Matrix</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
              Skills validated through automated resume parsing and assessment verification
            </p>
          </div>
          <button className="btn-ghost btn-sm" onClick={() => onNavigate?.('readiness')}>
            View Placement Readiness →
          </button>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Skill Domain</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Resume Claim</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Verified Level</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Proficiency</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-3)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.06em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {verifiedSkills.map(s => (
                <tr key={s.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-1)' }}>{s.name}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-2)' }}>{s.resumeClaim}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-1)' }}>{s.demonstrated}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="meter" style={{ width: 60 }}><i style={{ width: `${s.score}%` }} /></div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600 }}>{s.score}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`status ${s.status}`}>
                      {s.status === 'verified' ? '✓ Verified' : s.status === 'developing' ? 'Developing' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Featured Projects Portfolio */}
      <section className="panel-grid">
        {projects.map(p => (
          <article key={p.title} className="card">
            <div className="section-title">
              <div>
                <strong style={{ fontSize: '0.94rem', color: 'var(--text-1)' }}>{p.title}</strong>
                <p style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 0' }}>
                  {p.stack}
                </p>
              </div>
              <span className="badge badge-accent">{p.badge}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.55, margin: '8px 0 14px' }}>
              {p.summary}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>{p.link}</span>
              <button className="btn-ghost btn-sm" onClick={() => onNavigate?.('github')}>
                Audit Repo →
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
