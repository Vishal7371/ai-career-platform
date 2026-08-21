import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const navItems = [
    { icon: '🏠', label: 'Dashboard',    path: '/dashboard', active: true  },
    { icon: '📄', label: 'Resume',       path: '/dashboard', active: false },
    { icon: '💼', label: 'Job Matching', path: '/jobs',      active: false },
    { icon: '📊', label: 'Analytics',    path: '/dashboard', active: false },
    { icon: '🤖', label: 'AI Assistant', path: '/dashboard', active: false },
    { icon: '⚙️', label: 'Settings',     path: '/dashboard', active: false },
  ]

  const stats = [
    { icon: '📄', value: '0',  label: 'Resumes Uploaded'  },
    { icon: '💼', value: '0',  label: 'Jobs Matched'       },
    { icon: '🎯', value: '0%', label: 'Profile Complete'   },
    { icon: '⚡', value: '0',  label: 'AI Insights'        },
  ]

  const features = [
    { icon: '📄', title: 'Resume Analysis',    desc: 'Upload your resume and get AI-powered skill extraction and analysis.',    color1: '#7c3aed', color2: '#5b21b6' },
    { icon: '💼', title: 'Smart Job Matching', desc: 'Match your profile with thousands of jobs using semantic AI matching.',    color1: '#0891b2', color2: '#0e7490' },
    { icon: '📊', title: 'Skill Gap Analysis', desc: 'Discover skills you need to land your dream role with detailed roadmaps.',  color1: '#059669', color2: '#047857' },
    { icon: '🤖', title: 'AI Career Chat',     desc: 'Chat with your personal AI career assistant powered by LLM and RAG.',     color1: '#db2777', color2: '#be185d' },
  ]

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>⚡</span>
          <h2>AI Career</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`} onClick={() => navigate(item.path)}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {(user.username || 'U')[0].toUpperCase()}
          </div>
          <div className="user-info">
            <h4>{user.username || 'User'}</h4>
            <p>Free Plan</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1>Good morning, {user.username}! 👋</h1>
            <p>Here's your career intelligence overview</p>
          </div>
          <button className="btn-logout" onClick={logout}>Sign out</button>
        </header>

        <div className="dash-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <h2>Your AI Career Journey Starts Here</h2>
            <p>Upload your resume to unlock AI-powered insights, job matching, and personalized recommendations.</p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <h3 className="section-title">Platform Features</h3>
          <div className="feature-grid">
            {features.map((f) => (
              <div
                key={f.title}
                className="feature-card"
                style={{ '--card-color1': f.color1, '--card-color2': f.color2 }}
              >
                <div className="feature-card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="badge-soon">Coming soon</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
