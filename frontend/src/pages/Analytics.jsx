import AppLayout from '../components/AppLayout'
import { useState, useEffect } from 'react'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie, Legend
} from 'recharts'
import API from '../services/api'

const COLORS = ['#7c3aed', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

export default function Analytics() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [matches, setMatches]   = useState(null)
  const [resumes, setResumes]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, rRes] = await Promise.all([
          API.get(`/match/user/${user.id}`).catch(() => null),
          API.get(`/resume/${user.id}`).catch(() => ({ data: [] }))
        ])
        if (mRes) setMatches(mRes.data)
        setResumes(rRes.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="dash-content"><div className="loading-state">📊 Loading analytics...</div></div>

  // ── Compute skill frequency from resume ──
  const skillFreq = {}
  resumes.forEach(r => {
    r.skills?.split(',').forEach(s => {
      const sk = s.trim()
      if (sk) skillFreq[sk] = (skillFreq[sk] || 0) + 1
    })
  })
  const skillData = Object.entries(skillFreq)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // ── Match score buckets ──
  const buckets = { 'High (75-100%)': 0, 'Medium (40-74%)': 0, 'Low (0-39%)': 0 }
  matches?.matches?.forEach(m => {
    if (m.match_score >= 75)     buckets['High (75-100%)']++
    else if (m.match_score >= 40) buckets['Medium (40-74%)']++
    else                          buckets['Low (0-39%)']++
  })
  const bucketData = Object.entries(buckets).map(([name, value]) => ({ name, value }))

  // ── Profile completion ──
  const profile = JSON.parse(localStorage.getItem('user') || '{}')
  const checks = [
    { label: 'Account Created',  done: true },
    { label: 'Resume Uploaded',  done: resumes.length > 0 },
    { label: 'Skills Detected',  done: resumes.some(r => r.skills) },
    { label: 'Jobs Browsed',     done: true },
    { label: 'Matches Viewed',   done: !!matches },
  ]
  const completionPct = Math.round((checks.filter(c => c.done).length / checks.length) * 100)

  // ── Top matched job ──
  const topJob = matches?.matches?.[0]

  return (
    <div className="dash-content">
      <div className="page-header">
        <h2>📊 Analytics</h2>
        <span className="badge-count">Your career insights</span>
      </div>

      {/* Top KPI row */}
      <div className="stats-row" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-value">{resumes.length}</div>
          <div className="stat-label">Resumes Uploaded</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{matches?.total_jobs || 0}</div>
          <div className="stat-label">Jobs Analyzed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{topJob ? `${topJob.match_score}%` : 'N/A'}</div>
          <div className="stat-label">Best Match Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧠</div>
          <div className="stat-value">{skillData.length}</div>
          <div className="stat-label">Skills Detected</div>
        </div>
      </div>

      <div className="analytics-grid">

        {/* Profile Completion */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Profile Completion</h3>
          <div className="completion-ring-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
                data={[{ name: 'completion', value: completionPct, fill: '#7c3aed' }]}
                startAngle={90} endAngle={90 - (completionPct / 100) * 360}>
                <RadialBar dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="completion-label">
              <span className="completion-pct">{completionPct}%</span>
              <span className="completion-sub">Complete</span>
            </div>
          </div>
          <div className="checklist">
            {checks.map(c => (
              <div key={c.label} className={`check-item ${c.done ? 'done' : ''}`}>
                <span>{c.done ? '✅' : '⬜'}</span> {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Job Match Distribution</h3>
          {matches ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={bucketData} cx="50%" cy="50%" outerRadius={90}
                  dataKey="value" nameKey="name" label={({ name, value }) => value > 0 ? `${value}` : ''}>
                  {bucketData.map((_, i) => (
                    <Cell key={i} fill={['#10b981','#f59e0b','#ef4444'][i]} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{v}</span>} />
                <Tooltip contentStyle={{ background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="loading-state" style={{ padding: 40 }}>Upload resume to see matches</div>
          )}
        </div>

        {/* Your Skills Bar Chart */}
        <div className="analytics-card analytics-card-wide">
          <h3 className="analytics-card-title">Your Detected Skills</h3>
          {skillData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skillData} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: '#e2e8f0' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {skillData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="loading-state" style={{ padding: 40 }}>Upload a resume to see your skill chart</div>
          )}
        </div>

        {/* Top job match */}
        {topJob && (
          <div className="analytics-card analytics-card-wide">
            <h3 className="analytics-card-title">🏆 Your Best Job Match</h3>
            <div className="top-match-card">
              <div className={`score-ring score-high`} style={{ width: 90, height: 90 }}>
                <span className="score-num">{topJob.match_score}%</span>
                <span className="score-lbl">match</span>
              </div>
              <div>
                <h3 style={{ color: '#fff', marginBottom: 6 }}>{topJob.title}</h3>
                <p style={{ color: '#64748b', marginBottom: 8 }}>🏢 {topJob.company} · 📍 {topJob.location}</p>
                <div className="job-skills">
                  {topJob.matched_skills.map(s => <span key={s} className="skill-tag skill-matched">{s}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
