type LandingPageProps = {
  onEnter: () => void
  onNavigate: (view: 'home' | 'dashboard' | 'resume' | 'interview' | 'github' | 'readiness' | 'roadmap' | 'reports' | 'profile') => void
}

const agents = [
  { key: 'resume', label: 'Resume Analyzer', description: 'Tune your resume for the roles you want.', icon: '◎', tone: 'coral' },
  { key: 'interview', label: 'Mock Interview', description: 'Practice clear, confident answers with AI feedback.', icon: '◉', tone: 'yellow' },
  { key: 'github', label: 'GitHub Intelligence', description: 'Turn your work into a stronger technical story.', icon: '◐', tone: 'green' },
  { key: 'readiness', label: 'Readiness', description: 'See what to improve before your next application.', icon: '◑', tone: 'ink' },
  { key: 'roadmap', label: 'Learning Roadmap', description: 'Build momentum with focused next steps.', icon: '▷', tone: 'coral' },
  { key: 'reports', label: 'Reports', description: 'Track your progress in one clear view.', icon: '≡', tone: 'yellow' },
] as const

export function LandingPage({ onEnter, onNavigate }: LandingPageProps) {
  return (
    <main className="marketing-page">
      <section className="command-hero" id="product">
        <div className="command-copy">
          <p className="marketing-kicker"><span /> Your career command center</p>
          <h1>Make your next move with <em>signal.</em></h1>
          <p className="hero-lede">HireSense turns the scattered work of getting hired into one focused rhythm: understand your strengths, improve the gaps, and practice what comes next.</p>
          <div className="command-actions"><button className="marketing-cta" onClick={onEnter}>Open workspace <span aria-hidden="true">↗</span></button><button className="command-text-button" onClick={() => onNavigate('readiness')}>View readiness <span aria-hidden="true">↓</span></button></div>
          <div className="command-proof"><span><strong>92%</strong> readiness</span><span><strong>6</strong> specialist agents</span><span><strong>1</strong> clear plan</span></div>
        </div>

        <div className="momentum-board" aria-label="Current HireSense momentum overview">
          <div className="board-header"><span><i /> Live workspace</span><strong>Thursday, 9:41 AM</strong></div>
          <div className="board-greeting"><span>GOOD MORNING, ARAVIND</span><h2>Your momentum is building.</h2></div>
          <div className="board-score"><div><span>READINESS SCORE</span><strong>92</strong><small>/100</small></div><div className="score-arc"><b>+8%</b><span>this month</span></div></div>
          <div className="board-next"><span>NEXT BEST ACTION</span><strong>Sharpen your project story</strong><p>Resume Analyzer found 3 projects ready for stronger impact statements.</p><button onClick={() => onNavigate('resume')}>Review recommendation <span>↗</span></button></div>
          <div className="board-footer"><span>Resume <b>Strong</b></span><span>GitHub <b>Growing</b></span><span>Interview <b>Ready</b></span></div>
        </div>
      </section>

      <section className="agent-section redesigned-agents" id="agents"><div className="section-intro"><p className="marketing-kicker"><span /> The toolkit</p><h2>Different questions.<br /><em>One connected answer.</em></h2><p>Start with the part of your search that needs attention today. Every agent feeds the same readiness picture.</p></div><div className="agent-grid">{agents.map((agent, index) => <button key={agent.key} className={`agent-card ${agent.tone}`} onClick={() => onNavigate(agent.key)}><span className="agent-number">0{index + 1}</span><span className="agent-icon">{agent.icon}</span><span className="agent-card-copy"><strong>{agent.label}</strong><small>{agent.description}</small></span><span className="agent-arrow">↗</span></button>)}</div></section>
      <section className="principles-strip" id="proof"><span>HIR ESENSE METHOD</span><strong>See clearly.</strong><i>→</i><strong>Practice deliberately.</strong><i>→</i><strong>Move with confidence.</strong></section>
      <section className="marketing-bottom" id="approach"><p className="marketing-kicker"><span /> A better way forward</p><h2>Your work is already telling a story. Make it easier to hear.</h2><button className="text-link" onClick={onEnter}>Explore the workspace <span>↗</span></button></section>
    </main>
  )
}
