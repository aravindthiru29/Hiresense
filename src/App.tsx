import { useState, type ChangeEvent } from 'react'
import { HomePage } from './pages/HomePage'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { AnalyzerPage } from './pages/AnalyzerPage'
import { InterviewPage } from './pages/InterviewPage'
import { GithubPage } from './pages/GithubPage'
import { ReadinessPage } from './pages/ReadinessPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { ReportsPage } from './pages/ReportsPage'
import { ProfilePage } from './pages/ProfilePage'
import { useResume } from './context'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'AT'
}

type View = 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile'
type AuthScreen = 'landing' | 'login' | 'signup' | 'onboarding' | 'upload' | 'analyzing' | 'analysis' | 'assessment' | 'skill-profile' | View

const navItems: Array<{ key: View; label: string; icon: string }> = [
  { key: 'home', label: 'Home', icon: '⊞' },
  { key: 'dashboard', label: 'Dashboard', icon: '◈' },
  { key: 'resume', label: 'Resume', icon: '◎' },
  { key: 'interview', label: 'Interview', icon: '◉' },
  { key: 'github', label: 'GitHub', icon: '◐' },
  { key: 'readiness', label: 'Readiness', icon: '◑' },
  { key: 'roadmap', label: 'Roadmap', icon: '▷' },
  { key: 'reports', label: 'Reports', icon: '≡' },
  { key: 'profile', label: 'Profile', icon: '◷' },
]

const pageTitles: Record<View, string> = {
  home: 'Home',
  dashboard: 'Dashboard',
  resume: 'Resume Analyzer',
  interview: 'Interview Coach',
  github: 'GitHub Intelligence',
  readiness: 'Placement Readiness',
  roadmap: 'Learning Roadmap',
  reports: 'Reports',
  profile: 'Profile',
}

const roleOptions = [
  'Software Developer',
  'Data Analyst',
  'Data Scientist',
  'AI / ML Engineer',
  'Backend Developer',
  'Cloud Engineer',
  'Other',
]

const skillOptions = [
  'Python',
  'Java',
  'JavaScript',
  'SQL',
  'DSA',
  'OOP',
  'Machine Learning',
  'Data Analytics',
  'Flask',
  'React',
  'Cloud',
  'Git',
  'Communication',
]

const assessmentQuestions = [
  'What is the difference between a list and a tuple in Python?',
  'You mentioned a machine learning project. Why did you choose the algorithm used in that project?',
  'Explain how a request flows through your Flask application.',
  'Solve a small array problem: how would you find the second largest number in an unsorted list?',
  'Explain your project as if you were speaking to an interviewer.',
  'How would you improve application performance if a database query became a bottleneck?',
  'What trade-offs matter most when choosing between SQL and NoSQL for a product feature?',
  'Describe how you would debug a failed API call in a production environment.',
  'What is the most important thing you learned from your recent project?',
  'How would you explain your resume story in a concise technical interview response?',
]

function App() {
  const { state: resumeState, uploadResume } = useResume()
  const [screen, setScreen] = useState<AuthScreen>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [fullName, setFullName] = useState(resumeState.candidateName)
  const [college, setCollege] = useState(resumeState.college)
  const [degree, setDegree] = useState(resumeState.degree)
  const [branch, setBranch] = useState(resumeState.branch)
  const [graduationYear, setGraduationYear] = useState(resumeState.graduationYear)
  const [targetRole, setTargetRole] = useState(resumeState.targetRole)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Java', 'SQL', 'Flask', 'Machine Learning'])
  const [resumeName, setResumeName] = useState(resumeState.resumeFileName)
  const [resumeSize, setResumeSize] = useState(resumeState.resumeFileSize)
  const [resumeUploaded, setResumeUploaded] = useState(resumeState.resumeUploaded)
  const [assessmentIndex, setAssessmentIndex] = useState(0)
  const [assessmentAnswer, setAssessmentAnswer] = useState('')

  const goToDashboard = () => {
    setIsAuthenticated(true)
    setScreen('dashboard')
  }

  const handlePrimaryCta = () => {
    setIsAuthenticated(true)
    setScreen('home')
  }

  const handleLandingNavigate = (view: View) => {
    setIsAuthenticated(true)
    setScreen(view)
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(current =>
      current.includes(skill) ? current.filter(item => item !== skill) : [...current, skill],
    )
  }

  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeName(file.name)
      setResumeSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`)
      setResumeUploaded(true)
      await uploadResume(file)
      setScreen('upload')
    }
  }

  const handleAnalyzeResume = () => {
    setScreen('analyzing')
    setTimeout(() => {
      setScreen('analysis')
    }, 1800)
  }

  const handleAssessmentSubmit = () => {
    if (assessmentIndex < assessmentQuestions.length - 1) {
      setAssessmentIndex(index => index + 1)
      setAssessmentAnswer('')
      return
    }

    setScreen('skill-profile')
  }

  if (screen === 'landing') {
    return (
      <div className="hireSense-shell landing-mode">
        <SiteHeader
          isAuthenticated={isAuthenticated}
          activeScreen="landing"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <LandingPage
          onEnter={handlePrimaryCta}
          onNavigate={view => handleLandingNavigate(view)}
        />
      </div>
    )
  }

  if (screen === 'login') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="login"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <AuthScreen
          variant="login"
          onCreateAccount={() => setScreen('signup')}
          onSignIn={goToDashboard}
        />
      </div>
    )
  }

  if (screen === 'signup') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="signup"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <AuthScreen
          variant="signup"
          onCreateAccount={() => setScreen('onboarding')}
          onSignIn={() => setScreen('login')}
        />
      </div>
    )
  }

  if (screen === 'onboarding') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="onboarding"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <OnboardingFlow
          step={onboardingStep}
          fullName={fullName}
          setFullName={setFullName}
          college={college}
          setCollege={setCollege}
          degree={degree}
          setDegree={setDegree}
          branch={branch}
          setBranch={setBranch}
          graduationYear={graduationYear}
          setGraduationYear={setGraduationYear}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          selectedSkills={selectedSkills}
          toggleSkill={toggleSkill}
          onContinue={() => {
            if (onboardingStep < 3) {
              setOnboardingStep(step => step + 1)
            } else {
              setScreen('upload')
            }
          }}
        />
      </div>
    )
  }

  if (screen === 'upload') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="upload"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <ResumeUploadScreen
          resumeName={resumeName}
          resumeSize={resumeSize}
          resumeUploaded={resumeUploaded}
          onUpload={handleResumeUpload}
          onAnalyze={handleAnalyzeResume}
          onSkip={() => setScreen('dashboard')}
        />
      </div>
    )
  }

  if (screen === 'analyzing') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="analysis"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <AnalysisLoadingScreen />
      </div>
    )
  }

  if (screen === 'analysis') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="analysis"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <ResumeAnalysisScreen
          fullName={fullName}
          degree={degree}
          branch={branch}
          targetRole={targetRole}
          onContinue={() => setScreen('assessment')}
        />
      </div>
    )
  }

  if (screen === 'assessment') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="assessment"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <AssessmentScreen
          currentQuestion={assessmentQuestions[assessmentIndex]}
          currentIndex={assessmentIndex}
          total={assessmentQuestions.length}
          answer={assessmentAnswer}
          setAnswer={setAssessmentAnswer}
          onSubmit={handleAssessmentSubmit}
        />
      </div>
    )
  }

  if (screen === 'skill-profile') {
    return (
      <div className="hireSense-shell auth-mode">
        <SiteHeader
          isAuthenticated={false}
          activeScreen="skill-profile"
          onOpenLogin={() => setScreen('login')}
          onOpenSignup={() => setScreen('signup')}
          onNavigate={view => setScreen(view)}
          onHome={() => setScreen('landing')}
        />
        <ProfileSummaryScreen
          onContinue={() => {
            setIsAuthenticated(true)
            setScreen('dashboard')
          }}
        />
      </div>
    )
  }

  return (
    <div className="workspace-shell">
      <WorkspaceNav view={screen as View} onNavigate={value => setScreen(value)} />

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-breadcrumb" onClick={() => setScreen('home')} style={{ cursor: 'pointer' }}>HireSense</span>
            <span className="topbar-sep">/</span>
            <h1>{pageTitles[screen as View]}</h1>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setScreen('landing')}>
            Landing Page ↗
          </button>
        </header>

        <div className="page-body">
          {screen === 'home' && <HomePage onNavigate={setScreen} />}
          {screen === 'dashboard' && <DashboardPage onNavigate={setScreen} />}
          {screen === 'resume' && <AnalyzerPage onNavigate={setScreen} />}
          {screen === 'interview' && <InterviewPage onNavigate={setScreen} />}
          {screen === 'github' && <GithubPage onNavigate={setScreen} />}
          {screen === 'readiness' && <ReadinessPage onNavigate={setScreen} />}
          {screen === 'roadmap' && <RoadmapPage onNavigate={setScreen} />}
          {screen === 'reports' && <ReportsPage onNavigate={setScreen} />}
          {screen === 'profile' && <ProfilePage onNavigate={setScreen} />}
        </div>
      </main>
    </div>
  )
}

function SiteHeader({
  isAuthenticated,
  activeScreen,
  onOpenLogin,
  onOpenSignup,
  onNavigate,
  onHome,
}: {
  isAuthenticated: boolean
  activeScreen: string
  onOpenLogin?: () => void
  onOpenSignup?: () => void
  onNavigate: (view: View) => void
  onHome: () => void
}) {
  if (!isAuthenticated) {
    return (
      <header className="top-level-header">
        <div className="header-brand" onClick={onHome} style={{ cursor: 'pointer' }}>
          <span className="workspace-brand-mark">✦</span>
          <span>HireSense</span>
        </div>

        <nav className="top-nav" aria-label="Top navigation">
          <button className={activeScreen === 'landing' ? 'active' : ''} onClick={onHome}>Home</button>
          <button onClick={() => onNavigate('dashboard')}>Features</button>
          <button onClick={() => onNavigate('roadmap')}>How it works</button>
        </nav>

        <div className="header-actions">
          <button className="header-link" onClick={onOpenLogin || (() => onNavigate('home'))}>Sign In</button>
          <button className="header-cta" onClick={onOpenSignup || (() => onNavigate('home'))}>Open Workspace →</button>
        </div>
      </header>
    )
  }

  const { state: navState } = useResume()
  const navInitials = getInitials(navState.candidateName)

  return (
    <header className="workspace-nav">
      <button className="workspace-brand" onClick={() => onNavigate('home')}>
        <span className="workspace-brand-mark">✦</span>
        <span>HireSense</span>
      </button>

      <nav className="agent-nav" aria-label="AI agents">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`agent-nav-item${activeScreen === item.key ? ' active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.key === 'home' ? 'Home' : item.label === 'Resume' ? 'Resume Analyzer' : item.label === 'Interview' ? 'Mock Interview' : item.label}
          </button>
        ))}
      </nav>

      <div className="workspace-actions">
        <div className="readiness-chip" onClick={() => onNavigate('readiness')} style={{ cursor: 'pointer' }} title="View Placement Readiness">
          <span>●</span> {navState.readinessScore}% ready
        </div>
        <button className="workspace-avatar" onClick={() => onNavigate('profile')} aria-label="Open profile">{navInitials}</button>
      </div>
    </header>
  )
}

function WorkspaceNav({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  const { state: navState } = useResume()
  const navInitials = getInitials(navState.candidateName)

  return (
    <header className="workspace-nav">
      <button className="workspace-brand" onClick={() => onNavigate('home')}>
        <span className="workspace-brand-mark">✦</span>
        <span>HireSense</span>
      </button>

      <nav className="agent-nav" aria-label="AI agents">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`agent-nav-item${view === item.key ? ' active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.key === 'home' ? 'Home' : item.label === 'Resume' ? 'Resume Analyzer' : item.label === 'Interview' ? 'Mock Interview' : item.label}
          </button>
        ))}
      </nav>

      <div className="workspace-actions">
        <div className="readiness-chip" onClick={() => onNavigate('readiness')} style={{ cursor: 'pointer' }} title="View Placement Readiness">
          <span>●</span> {navState.readinessScore}% ready
        </div>
        <button className="workspace-avatar" onClick={() => onNavigate('profile')} aria-label="Open profile">{navInitials}</button>
      </div>
    </header>
  )
}

function AuthScreen({ variant, onCreateAccount, onSignIn }: { variant: 'login' | 'signup'; onCreateAccount: () => void; onSignIn: () => void }) {
  return (
    <section className="auth-layout">
      <div className="auth-visual">
        <div className="auth-brand-row">
          <span className="workspace-brand-mark">✦</span>
          <span>HireSense AI</span>
        </div>
        <h1>{variant === 'login' ? 'Welcome back.' : 'Build your career signal.'}</h1>
        <p>
          {variant === 'login'
            ? 'Continue building your placement readiness with a clearer view of your skills, gaps, and next actions.'
            : 'Create a profile that starts with your resume, validates your strengths, and builds a guided career plan.'}
        </p>
        <div className="mini-visual-card">
          <div className="mini-signal">
            <span>Resume signal</span>
            <strong>82</strong>
            <small>/100</small>
          </div>
          <div className="mini-bars">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h2>{variant === 'login' ? 'Welcome back.' : 'Create account'}</h2>
          <p>
            {variant === 'login'
              ? 'Continue building your placement readiness.'
              : 'Start with your resume and turn your experience into a clearer path forward.'}
          </p>

          {variant === 'signup' && (
            <div className="auth-grid two-col">
              <label className="field">
                <span>Full Name</span>
                <input type="text" placeholder="Aravind T" />
              </label>
              <label className="field">
                <span>Email</span>
                <input type="email" placeholder="you@example.com" />
              </label>
            </div>
          )}

          <label className="field">
            <span>{variant === 'login' ? 'Email' : 'Email'}</span>
            <input type="email" placeholder="you@example.com" />
          </label>

          {variant === 'signup' && (
            <div className="auth-grid two-col">
              <label className="field">
                <span>Password</span>
                <input type="password" placeholder="••••••••" />
              </label>
              <label className="field">
                <span>Confirm Password</span>
                <input type="password" placeholder="••••••••" />
              </label>
            </div>
          )}

          {variant === 'login' && (
            <label className="field">
              <span>Password</span>
              <input type="password" placeholder="••••••••" />
            </label>
          )}

          {variant === 'signup' && (
            <div className="auth-grid two-col">
              <label className="field">
                <span>College</span>
                <input type="text" placeholder="VIT Vellore" />
              </label>
              <label className="field">
                <span>Graduation Year</span>
                <input type="text" placeholder="2026" />
              </label>
            </div>
          )}

          {variant === 'login' && (
            <div className="auth-row between">
              <label className="checkbox-wrap">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <button className="text-button">Forgot password?</button>
            </div>
          )}

          <button className="primary-action" onClick={variant === 'login' ? onSignIn : onCreateAccount}>
            {variant === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>

          <div className="divider-row">
            <span /> <em>OR</em> <span />
          </div>

          <button className="google-button">Continue with Google</button>

          <p className="auth-toggle">
            {variant === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button className="text-button underline" onClick={variant === 'login' ? onCreateAccount : onSignIn}>
              {variant === 'login' ? 'Create account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}

function OnboardingFlow({
  step,
  fullName,
  setFullName,
  college,
  setCollege,
  degree,
  setDegree,
  branch,
  setBranch,
  graduationYear,
  setGraduationYear,
  targetRole,
  setTargetRole,
  selectedSkills,
  toggleSkill,
  onContinue,
}: {
  step: number
  fullName: string
  setFullName: (value: string) => void
  college: string
  setCollege: (value: string) => void
  degree: string
  setDegree: (value: string) => void
  branch: string
  setBranch: (value: string) => void
  graduationYear: string
  setGraduationYear: (value: string) => void
  targetRole: string
  setTargetRole: (value: string) => void
  selectedSkills: string[]
  toggleSkill: (skill: string) => void
  onContinue: () => void
}) {
  return (
    <section className="onboarding-shell">
      <div className="onboarding-card wide">
        <div className="progress-row">
          <span>01 / 03</span>
          <div className="progress-track"><i style={{ width: `${(step / 3) * 100}%` }} /></div>
        </div>

        {step === 1 && (
          <>
            <h2>Tell us about yourself</h2>
            <div className="auth-grid two-col">
              <label className="field">
                <span>Full Name</span>
                <input value={fullName} onChange={e => setFullName(e.target.value)} />
              </label>
              <label className="field">
                <span>College</span>
                <input value={college} onChange={e => setCollege(e.target.value)} />
              </label>
            </div>
            <div className="auth-grid two-col">
              <label className="field">
                <span>Degree</span>
                <input value={degree} onChange={e => setDegree(e.target.value)} />
              </label>
              <label className="field">
                <span>Branch</span>
                <input value={branch} onChange={e => setBranch(e.target.value)} />
              </label>
            </div>
            <label className="field">
              <span>Graduation Year</span>
              <input value={graduationYear} onChange={e => setGraduationYear(e.target.value)} />
            </label>
            <button className="primary-action" onClick={onContinue}>Continue →</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Where are you heading?</h2>
            <p className="sub-text">Target Role</p>
            <div className="role-grid">
              {roleOptions.map(option => (
                <button
                  key={option}
                  className={`role-option ${targetRole === option ? 'selected' : ''}`}
                  onClick={() => setTargetRole(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="primary-action" onClick={onContinue}>Continue →</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2>What do you already know?</h2>
            <div className="chip-grid">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  className={`chip ${selectedSkills.includes(skill) ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
            <button className="ghost-button" onClick={() => toggleSkill('I\'m not sure yet')}>
              I&apos;m not sure yet
            </button>
            <button className="primary-action" onClick={onContinue}>Continue →</button>
          </>
        )}
      </div>
    </section>
  )
}

function ResumeUploadScreen({
  resumeName,
  resumeSize,
  resumeUploaded,
  onUpload,
  onAnalyze,
  onSkip,
}: {
  resumeName: string
  resumeSize: string
  resumeUploaded: boolean
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onAnalyze: () => void
  onSkip: () => void
}) {
  return (
    <section className="auth-layout resume-layout">
      <div className="resume-copy">
        <p className="eyebrow">Start here</p>
        <h1>Let&apos;s understand your starting point.</h1>
        <p className="lead">Upload your resume and HireSense will build your initial career profile.</p>

        <div className="upload-panel">
          <label className="upload-area">
            <input type="file" accept=".pdf,.doc,.docx" onChange={onUpload} />
            <span className="upload-icon">↑</span>
            <strong>Drop your resume here</strong>
            <small>or browse from your computer</small>
            <em>PDF / DOCX · Max 10 MB</em>
          </label>
          <div className="upload-actions">
            <button className="primary-action" onClick={onAnalyze}>
              Choose Resume
            </button>
            <button className="ghost-button" onClick={onSkip}>Skip for now</button>
          </div>
        </div>
      </div>

      {resumeUploaded && (
        <div className="resume-preview-card">
          <div className="file-tag-row">
            <span className="file-badge">Resume</span>
            <small>{resumeName}</small>
          </div>
          <div className="preview-document">
            <div className="preview-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-body">
              <h3>{resumeName}</h3>
              <p>{resumeSize}</p>
              <div className="status-pill">✓ Resume uploaded</div>
            </div>
          </div>
          <div className="resume-panel-actions">
            <button className="primary-action" onClick={onAnalyze}>Analyze My Resume →</button>
            <button className="secondary-action">Replace Resume</button>
          </div>
        </div>
      )}
    </section>
  )
}

function AnalysisLoadingScreen() {
  const stages = [
    'Resume uploaded',
    'Document parsing',
    'Education extraction',
    'Experience extraction',
    'Skill detection',
    'Project detection',
    'Role identification',
    'Initial career profile',
  ]

  return (
    <section className="analysis-shell">
      <div className="analysis-card">
        <p className="eyebrow coral">AI processing</p>
        <h2>Reading your career signal...</h2>
        <p>HireSense is analyzing your resume to understand your current profile before we verify what you can demonstrate.</p>
        <div className="analysis-steps">
          {stages.map((stage, index) => (
            <div key={stage} className={`step-row ${index < 5 ? 'done' : index === 5 ? 'active' : ''}`}>
              <span className="step-status">{index < 5 ? '✓' : index === 5 ? '●' : '○'}</span>
              <span>{stage}</span>
            </div>
          ))}
        </div>
        <div className="loading-bar">
          <i />
        </div>
      </div>
    </section>
  )
}

function ResumeAnalysisScreen({
  fullName: _fullName,
  degree: _degree,
  branch: _branch,
  targetRole: _targetRole,
  onContinue,
}: {
  fullName: string
  degree: string
  branch: string
  targetRole: string
  onContinue: () => void
}) {
  const { state } = useResume()
  const detectedSkills = state.skills.map(s => s.name)
  const projects = state.projects.map(project => ({
    name: project.title,
    stack: project.stack,
    description: project.summary,
  }))

  return (
    <section className="resume-analysis-shell">
      <div className="analysis-header-row">
        <div>
          <p className="eyebrow">Initial profile</p>
          <h2>Your initial career profile</h2>
        </div>
        <span className="profile-pill">{state.targetRole}</span>
      </div>

      <div className="profile-summary-card">
        <div>
          <h3>{state.candidateName}</h3>
          <p>{state.degree} • {state.branch}</p>
        </div>
        <div className="meta-box">
          <span>Target Role</span>
          <strong>{state.targetRole}</strong>
        </div>
      </div>

      <div className="result-panels">
        <div className="result-card">
          <h3>Education</h3>
          <div className="project-list">
            <div className="project-item">
              <strong>{state.degree}</strong>
              <span>{state.branch}</span>
              <p>Graduation year: {state.graduationYear} · {state.college}</p>
            </div>
          </div>
        </div>

        <div className="result-card">
          <h3>Detected Projects</h3>
          <div className="project-list">
            {projects.map(project => (
              <div key={project.name} className="project-item">
                <strong>{project.name}</strong>
                <span>{project.stack}</span>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="result-panels">
        <div className="result-card">
          <h3>Detected Skills</h3>
          <div className="chip-row">
            {detectedSkills.map(skill => (
              <span key={skill} className="chip small active">{skill}</span>
            ))}
          </div>
        </div>

        <div className="result-card">
          <h3>Experience &amp; Certifications</h3>
          <div className="project-list">
            <div className="project-item">
              <strong>Experience</strong>
              <span>Internship &amp; project work</span>
              <p>Strong project exposure across {state.targetRole} workflows and application engineering.</p>
            </div>
            <div className="project-item">
              <strong>Certifications</strong>
              <span>Detected signals</span>
              <p>Core technical coursework and project-based learning aligned with {state.targetRole}.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="score-grid">
        {[
          ['Resume Strength', `${state.atsScore} / 100`],
          ['Technical Profile', `${state.subScores.skills} / 100`],
          ['Project Strength', `${state.subScores.impact} / 100`],
          ['ATS Compatibility', `${state.atsScore} / 100`],
        ].map(([label, value]) => (
          <div key={label} className="score-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <p className="analysis-card-prompt">These are resume-derived indicators from {state.resumeFileName}. They help estimate your current profile before live skill verification through assessment.</p>

      <div className="analysis-actions">
        <button className="primary-action" onClick={onContinue}>Start Personalized Assessment →</button>
      </div>
    </section>
  )
}

function AssessmentScreen({
  currentQuestion,
  currentIndex,
  total,
  answer,
  setAnswer,
  onSubmit,
}: {
  currentQuestion: string
  currentIndex: number
  total: number
  answer: string
  setAnswer: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <section className="assessment-shell">
      <div className="assessment-card">
        <div className="assessment-header">
          <div>
            <p className="eyebrow">Assessment</p>
            <h2>Let&apos;s verify your skills.</h2>
          </div>
          <span className="question-count">Question {currentIndex + 1} of {total}</span>
        </div>

        <div className="progress-track"><i style={{ width: `${((currentIndex + 1) / total) * 100}%` }} /></div>

        <div className="question-box">
          <h3>{currentQuestion}</h3>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..." />
        </div>

        <button className="primary-action" onClick={onSubmit}>Submit Answer →</button>
      </div>
    </section>
  )
}

function ProfileSummaryScreen({ onContinue }: { onContinue: () => void }) {
  const { state } = useResume()
  const skills = [
    ['Technical Knowledge', String(state.subScores.skills)],
    ['Problem Solving', String(state.subScores.brevity)],
    ['Communication', String(state.subScores.style)],
    ['Project Understanding', String(state.subScores.impact)],
    ['Overall Signal', String(state.readinessScore)],
  ]

  return (
    <section className="profile-shell">
      <div className="profile-card">
        <p className="eyebrow">Initial assessment</p>
        <h2>Here&apos;s where you stand.</h2>

        <div className="profile-grid">
          {skills.map(([label, value]) => (
            <div key={label} className="capability-box">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="growth-panel">
          <h3>Skill gap signals</h3>
          <div className="growth-row"><span>Strong</span><strong>Python, OOP, Project Understanding</strong></div>
          <div className="growth-row"><span>Needs improvement</span><strong>DSA, SQL Optimization</strong></div>
          <div className="growth-row"><span>Gap to address</span><strong>{state.gapSkills[0]?.name || 'System Design'}</strong></div>
        </div>

        <div className="verification-card">
          <h3>Your skill verification</h3>
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Resume Claim</th>
                <th>Demonstrated Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.skills.slice(0, 5).map(s => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.resumeClaim || 'Intermediate'}</td>
                  <td>{s.demonstrated || 'Intermediate'}</td>
                  <td>
                    <span className={`status ${s.status || 'verified'}`}>
                      {(s.status || 'verified').charAt(0).toUpperCase() + (s.status || 'verified').slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="primary-action" onClick={onContinue}>Go to dashboard →</button>
      </div>
    </section>
  )
}

export default App
