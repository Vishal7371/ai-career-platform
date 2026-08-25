import AppLayout from '../components/AppLayout'
import { useState, useEffect } from 'react'
import API from '../services/api'

export default function Matches() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get(`/match/user/${user.id}`)
        setData(res.data)
      } catch (e) {
        if (e.response?.status === 404) {
          setError('No resume found! Please upload your resume first.')
        } else {
          setError('Failed to load matches.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not disclosed'
    const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`
    return `${fmt(min)} – ${fmt(max)}`
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'score-high'
    if (score >= 40) return 'score-mid'
    return 'score-low'
  }

  if (loading) return <div className="dash-content"><div className="loading-state">🤖 Analyzing your resume...</div></div>

  if (error) return (
    <div className="dash-content">
      <div className="page-header"><h2>🎯 Job Matches</h2></div>
      <div className="alert alert-error">⚠️ {error}</div>
    </div>
  )

  return (
    <div className="dash-content">
      <div className="page-header">
        <h2>🎯 Job Matches</h2>
        <span className="badge-count">{data.total_jobs} jobs analyzed</span>
      </div>

      {/* Your skills */}
      <div className="your-skills-card">
        <h3>Your Skills from Resume</h3>
        <div className="job-skills" style={{ marginTop: '12px' }}>
          {data.resume_skills?.split(',').map(s => (
            <span key={s} className="skill-tag">{s.trim()}</span>
          ))}
        </div>
      </div>

      {/* Match cards */}
      <div className="match-list">
        {data.matches.map((job) => (
          <div key={job.job_id} className="match-card">
            <div className="match-card-left">

              {/* Score ring */}
              <div className={`score-ring ${getScoreColor(job.match_score)}`}>
                <span className="score-num">{job.match_score}%</span>
                <span className="score-lbl">match</span>
              </div>

              {/* Job info */}
              <div className="match-job-info">
                <h3>{job.title}</h3>
                <p>🏢 {job.company} · 📍 {job.location}</p>
                <p>💰 {formatSalary(job.salary_min, job.salary_max)} · 🎯 {job.experience}</p>

                {/* Matched skills */}
                {job.matched_skills.length > 0 && (
                  <div className="match-skills-row">
                    <span className="match-label match-yes">✅ You have:</span>
                    {job.matched_skills.map(s => (
                      <span key={s} className="skill-tag skill-matched">{s}</span>
                    ))}
                  </div>
                )}

                {/* Missing skills */}
                {job.missing_skills.length > 0 && (
                  <div className="match-skills-row">
                    <span className="match-label match-no">📚 Learn:</span>
                    {job.missing_skills.map(s => (
                      <span key={s} className="skill-tag skill-missing">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
