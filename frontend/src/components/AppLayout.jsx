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
      { icon: '⚙️', label: 'Settings',    path: '/profile'   },
    ]
  }
]

export default function AppLayout({ children, pageTitle = 'Dashboard', breadcrumb = 'Dashboard' }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="pro-sidebar open">
        <div className="pro-logo">
          <div className="pro-logo-icon">AI</div>
          <span className="pro-logo-text">CareerAI</span>
        </div>

        <nav className="pro-nav">
          {navSections.map(section => (
            <div key={section.label} className="pro-nav-section">
              <p className="pro-section-label">{section.label}</p>
              {section.items.map(item => (
                <button
                  key={item.path}
                  className={`pro-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="pro-nav-icon">{item.icon}</span>
                  <span className="pro-nav-label">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="pro-sidebar-footer">
          <div className="pro-user-mini">
            <div className="pro-avatar-sm">
              {(user.username || 'U')[0].toUpperCase()}
            </div>
            <div className="pro-user-info">
              <p className="pro-user-name">{user.username || 'User'}</p>
              <p className="pro-user-role">Job Seeker</p>
            </div>
          </div>
          <button className="pro-logout-btn" onClick={handleLogout}>⎋</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="pro-main">
        <header className="pro-topbar">
          <div className="pro-topbar-left">
            <div className="pro-breadcrumb">
              <span>Home</span>
              <span className="pro-breadcrumb-sep">›</span>
              <span className="pro-breadcrumb-active">{breadcrumb}</span>
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

        <main className="pro-content">
          {children}
        </main>
      </div>
    </div>
  )
}
