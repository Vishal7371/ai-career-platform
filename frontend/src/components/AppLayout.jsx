import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard',  path: '/dashboard' },
  { label: 'Resume',     path: '/resume'    },
  { label: 'Jobs',       path: '/jobs'      },
  { label: 'Matches',    path: '/matches'   },
  { label: 'Analytics',  path: '/analytics' },
  { label: 'AI Advisor', path: '/advisor'   },
  { label: 'Settings',   path: '/profile'   },
]

export default function AppLayout({ children, breadcrumb = 'Dashboard' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const initials = (user.username || 'U').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="lx-root">

      {/* ── Top Nav ── */}
      <header className="lx-header">
        {/* Logo */}
        <div className="lx-logo" onClick={() => navigate('/dashboard')}>
          <div className="lx-logo-box">C</div>
          <span className="lx-logo-name">CareerAI</span>
        </div>

        {/* Nav links */}
        <nav className="lx-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`lx-nav-link ${location.pathname === item.path ? 'lx-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="lx-header-right">
          <div className="lx-user-badge" onClick={handleLogout} title="Click to sign out">
            <div className="lx-avatar">{initials}</div>
            <span className="lx-username">{user.username || 'User'}</span>
            <span className="lx-chevron">∨</span>
          </div>
        </div>
      </header>

      {/* ── Page ── */}
      <main className="lx-page">
        {children}
      </main>
    </div>
  )
}
