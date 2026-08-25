import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const navSections = [
  {
    label: 'MAIN',
    items: [
      { icon: '⊞', label: 'Dashboard',    path: '/dashboard' },
      { icon: '📄', label: 'Resume',       path: '/resume'    },
      { icon: '💼', label: 'Job Matching', path: '/jobs'      },
    ]
  },
  {
    label: 'INSIGHTS',
    items: [
      { icon: '🎯', label: 'My Matches',  path: '/matches'   },
      { icon: '📊', label: 'Analytics',   path: '/analytics' },
      { icon: '🤖', label: 'AI Advisor',  path: '/advisor'   },
    ]
  },
  {
    label: 'ACCOUNT',
    items: [
      { icon: '👤', label: 'Profile',     path: '/profile'   },
    ]
  }
]

export default function Dashboard() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = JSON.parse(localStorage.getItem('user') || '{}')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const stats = [
    { label: 'Resume Uploads',   value: '1',   icon: '📄', change: '+1 today',   color: '#6366f1' },
    { label: 'Jobs Available',   value: '5',   icon: '💼', change: 'Browse all',  color: '#0ea5e9' },
    { label: 'Best Match Score', value: '80%', icon: '🎯', change: 'View matches', color: '#10b981' },
    { label: 'Skills Detected',  value: '12',  icon: '🧠', change: 'From resume', color: '#f59e0b' },
  ]

  const quickLinks = [
    { label: 'Upload Resume',   path: '/resume',    icon: '📄', desc: 'Add your PDF' },
    { label: 'Find Jobs',       path: '/jobs',      icon: '💼', desc: 'Browse openings' },
    { label: 'Check Matches',   path: '/matches',   icon: '🎯', desc: 'AI matching' },
    { label: 'Ask AI Advisor',  path: '/advisor',   icon: '🤖', desc: 'Get advice' },
  ]

  return (
    <div className="app-shell">

      {/* ── Sidebar ── */}
      <aside className={`pro-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Logo */}
        <div className="pro-logo">
          <div className="pro-logo-icon">AI</div>
          {sidebarOpen && <span className="pro-logo-text">CareerAI</span>}
        </div>

        {/* Nav sections */}
        <nav className="pro-nav">
          {navSections.map(section => (
            <div key={section.label} className="pro-nav-section">
              {sidebarOpen && <p className="pro-section-label">{section.label}</p>}
              {section.items.map(item => (
                <button
                  key={item.path}
                  className={`pro-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="pro-nav-icon">{item.icon}</span>
                  {sidebarOpen && <span className="pro-nav-label">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="pro-sidebar-footer">
          <div className="pro-user-mini">
            <div className="pro-avatar-sm">
              {(user.username || 'U')[0].toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="pro-user-info">
                <p className="pro-user-name">{user.username || 'User'}</p>
                <p className="pro-user-role">Job Seeker</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="pro-logout-btn" onClick={handleLogout}>⎋</button>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="pro-main">

        {/* Top bar */}
        <header className="pro-topbar">
          <div className="pro-topbar-left">
            <button className="pro-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <div className="pro-breadcrumb">
              <span>Home</span>
              <span className="pro-breadcrumb-sep">›</span>
              <span className="pro-breadcrumb-active">Dashboard</span>
            </div>
          </div>
          <div className="pro-topbar-right">
            <div className="pro-search-box">
              <span>🔍</span>
              <input placeholder="Search..." />
            </div>
            <div className="pro-topbar-avatar">
              {(user.username || 'U')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="pro-content">
          <div className="pro-page-title">
            <div>
              <h1>Welcome back, {user.username || 'User'} 👋</h1>
              <p>Here's your career overview for today</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="pro-stats-grid">
            {stats.map(s => (
              <div key={s.label} className="pro-stat-card">
                <div className="pro-stat-left">
                  <p className="pro-stat-label">{s.label}</p>
                  <h2 className="pro-stat-value">{s.value}</h2>
                  <span className="pro-stat-change">{s.change}</span>
                </div>
                <div className="pro-stat-icon" style={{ background: s.color + '20', color: s.color }}>
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

          {/* Bottom row */}
          <div className="pro-bottom-grid">
            {/* Career progress */}
            <div className="pro-card">
              <div className="pro-card-header">
                <h3>Career Progress</h3>
              </div>
              <div className="pro-progress-list">
                {[
                  { label: 'Profile Setup',    pct: 100 },
                  { label: 'Resume Uploaded',  pct: 100 },
                  { label: 'Job Matches',      pct: 80  },
                  { label: 'Skills Coverage',  pct: 65  },
                  { label: 'Applications',     pct: 20  },
                ].map(p => (
                  <div key={p.label} className="pro-progress-item">
                    <div className="pro-progress-top">
                      <span>{p.label}</span>
                      <span>{p.pct}%</span>
                    </div>
                    <div className="pro-progress-bar">
                      <div className="pro-progress-fill" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips card */}
            <div className="pro-card">
              <div className="pro-card-header">
                <h3>💡 Career Tips</h3>
              </div>
              <div className="pro-tips-list">
                {[
                  { icon: '📄', tip: 'Keep resume under 2 pages for best results' },
                  { icon: '🎯', tip: 'Target jobs with 60%+ match score first' },
                  { icon: '🧠', tip: 'Add missing skills to boost your match rate' },
                  { icon: '🤖', tip: 'Ask the AI Advisor for personalized advice' },
                  { icon: '💼', tip: 'Apply to 3-5 jobs per week consistently' },
                ].map((t, i) => (
                  <div key={i} className="pro-tip-item">
                    <span className="pro-tip-icon">{t.icon}</span>
                    <span>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
