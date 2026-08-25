import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { icon: '⊞', label: 'Dashboard',   path: '/dashboard' },
  { icon: '📄', label: 'Resume',      path: '/resume'    },
  { icon: '💼', label: 'Jobs',        path: '/jobs'      },
  { icon: '🎯', label: 'Matches',     path: '/matches'   },
  { icon: '📊', label: 'Analytics',   path: '/analytics' },
  { icon: '🤖', label: 'AI Advisor',  path: '/advisor'   },
  { icon: '⚙️', label: 'Settings',    path: '/profile'   },
]

export default function AppLayout({ children, breadcrumb = 'Dashboard' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="layout-root">

      {/* ── Top Header ── */}
      <header className="top-header">
        <div className="top-header-left">
          <div className="top-logo">
            <div className="top-logo-icon">AI</div>
            <span className="top-logo-text">CareerAI</span>
          </div>
        </div>

        {/* ── Nav Buttons ── */}
        <nav className="top-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`top-nav-btn ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="top-header-right">
          <div className="top-user-chip">
            <div className="top-avatar">{(user.username || 'U')[0].toUpperCase()}</div>
            <span className="top-username">{user.username || 'User'}</span>
          </div>
          <button className="top-logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <div className="layout-breadcrumb">
        <span>Home</span>
        <span className="bc-sep">›</span>
        <span className="bc-active">{breadcrumb}</span>
      </div>

      {/* ── Page Content ── */}
      <main className="layout-content">
        {children}
      </main>
    </div>
  )
}
