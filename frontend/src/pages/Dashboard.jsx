import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'

export default function Dashboard() {
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || '{}')

  const kpis = [
    { icon: '💼', label: 'Job Posts',      value: '5',   sub: 'Available'   },
    { icon: '📄', label: 'Applications',   value: '0',   sub: 'Total'       },
    { icon: '🎯', label: 'New Matches',     value: '3',   sub: 'New'         },
    { icon: '🧠', label: 'Skills Detected', value: '12+', sub: 'From resume' },
  ]

  const actionGroups = [
    [
      { icon: '📄', label: 'Update Resume',  desc: 'Edit profile & skillset',    path: '/resume'   },
      { icon: '💼', label: 'Post New Job',   desc: 'Browse available roles',     path: '/jobs'     },
    ],
    [
      { icon: '🗓️', label: 'Check Matches',  desc: 'View AI job matches',         path: '/matches'  },
      { icon: '🤖', label: 'Ask AI Advisor', desc: 'Get career guidance',         path: '/advisor'  },
    ],
  ]

  const progress = [
    { label: 'Profile Setup',   pct: 100, sub: 'Complete' },
    { label: 'Resume Uploaded', pct: 100, sub: 'Parsed'   },
    { label: 'Job Matches',     pct: 80,  sub: '4 found'  },
    { label: 'Skills Coverage', pct: 65,  sub: '12 skills'},
    { label: 'Applications',    pct: 15,  sub: 'Start now'},
  ]

  const tips = [
    'Add key skills (Python, SQL, FastAPI)',
    'Complete your experience details',
    'Highlight your achievements',
    'Include a professional summary',
    'Upload projects to GitHub',
  ]

  return (
    <AppLayout breadcrumb="Dashboard">
      <div className="dash-content">

        {/* Welcome */}
        <div className="db-welcome">
          <h1>Welcome back, {user.username || 'User'}! ☀️</h1>
          <p>Here's your career overview for today.</p>
        </div>

        {/* KPI Cards */}
        <div className="db-kpi-grid">
          {kpis.map(k => (
            <div key={k.label} className="db-kpi-card">
              <div className="db-kpi-top">
                <div className="db-kpi-icon">{k.icon}</div>
                <span className="db-kpi-label">{k.label}</span>
              </div>
              <div className="db-kpi-value">{k.value}</div>
              <div className="db-kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions — 2 columns, 2 items each */}
        <div className="db-actions-grid">
          {actionGroups.map((group, gi) => (
            <div key={gi} className="db-actions-card">
              {group.map(a => (
                <div key={a.path} className="db-action-item" onClick={() => navigate(a.path)}>
                  <div className="db-action-icon">{a.icon}</div>
                  <div className="db-action-text">
                    <h4>{a.label}</h4>
                    <p>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="db-bottom-grid">
          {/* Progress */}
          <div className="db-card">
            <div className="db-card-title">Recruitment Pipeline Overview</div>
            <div className="db-progress-list">
              {progress.map(p => (
                <div key={p.label} className="db-progress-row">
                  <div className="db-progress-meta">
                    <span>{p.pct}% · {p.sub}</span>
                    <span>{p.label}</span>
                  </div>
                  <div className="db-progress-bar">
                    <div className="db-progress-fill" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="db-card">
            <div className="db-card-title">Optimize Your Profile</div>
            <div className="db-check-list">
              {tips.map((t, i) => (
                <div key={i} className="db-check-item">
                  <span className="db-check-icon">✓</span>
                  <span>{i + 1}. {t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
