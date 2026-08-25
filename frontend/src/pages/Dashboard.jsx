import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'

export default function Dashboard() {
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')

  const stats = [
    { label: 'Resume Uploads',   value: '1',   icon: '📄', change: '+1 today',    color: '#111' },
    { label: 'Jobs Available',   value: '5',   icon: '💼', change: 'Browse all',  color: '#111' },
    { label: 'Best Match Score', value: '80%', icon: '🎯', change: 'View matches', color: '#111' },
    { label: 'Skills Detected',  value: '12',  icon: '🧠', change: 'From resume',  color: '#111' },
  ]

  const quickLinks = [
    { label: 'Upload Resume',  path: '/resume',    icon: '📄', desc: 'Add your PDF' },
    { label: 'Find Jobs',      path: '/jobs',      icon: '💼', desc: 'Browse openings' },
    { label: 'Check Matches',  path: '/matches',   icon: '🎯', desc: 'AI matching' },
    { label: 'Ask AI Advisor', path: '/advisor',   icon: '🤖', desc: 'Get advice' },
  ]

  return (
    <AppLayout breadcrumb="Dashboard">
      <div className="dash-content">

        <div className="dash-page-title">
          <h1>Welcome back, {user.username || 'User'} 👋</h1>
          <p>Here's your career overview for today</p>
        </div>

        {/* Stats */}
        <div className="pro-stats-grid">
          {stats.map(s => (
            <div key={s.label} className="pro-stat-card">
              <div>
                <p className="pro-stat-label">{s.label}</p>
                <h2 className="pro-stat-value">{s.value}</h2>
                <span className="pro-stat-change">{s.change}</span>
              </div>
              <div className="pro-stat-icon" style={{ background: '#f3f4f6', color: s.color }}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="pro-section-header">
          <h2>Quick Actions</h2>
          <p>Jump right in</p>
        </div>
        <div className="pro-quick-grid">
          {quickLinks.map(q => (
            <button key={q.path} className="pro-quick-card" onClick={() => navigate(q.path)}>
              <div className="pro-quick-icon">{q.icon}</div>
              <div>
                <h3>{q.label}</h3>
                <p>{q.desc}</p>
              </div>
              <span className="pro-quick-arrow">→</span>
            </button>
          ))}
        </div>

        {/* Bottom cards */}
        <div className="pro-bottom-grid">
          <div className="pro-card">
            <div className="pro-card-header"><h3>Career Progress</h3></div>
            <div className="pro-progress-list">
              {[
                { label: 'Profile Setup',   pct: 100 },
                { label: 'Resume Uploaded', pct: 100 },
                { label: 'Job Matches',     pct: 80  },
                { label: 'Skills Coverage', pct: 65  },
                { label: 'Applications',    pct: 20  },
              ].map(p => (
                <div key={p.label}>
                  <div className="pro-progress-top">
                    <span>{p.label}</span><span>{p.pct}%</span>
                  </div>
                  <div className="pro-progress-bar">
                    <div className="pro-progress-fill" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-header"><h3>💡 Career Tips</h3></div>
            <div className="pro-tips-list">
              {[
                { icon: '📄', tip: 'Keep resume under 2 pages for best results' },
                { icon: '🎯', tip: 'Target jobs with 60%+ match score first' },
                { icon: '🧠', tip: 'Add missing skills to boost your match rate' },
                { icon: '🤖', tip: 'Ask the AI Advisor for personalized advice' },
                { icon: '💼', tip: 'Apply to 3–5 jobs per week consistently' },
              ].map((t, i) => (
                <div key={i} className="pro-tip-item">
                  <span className="pro-tip-icon">{t.icon}</span>
                  <span>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
