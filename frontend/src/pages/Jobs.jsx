import AppLayout from '../components/AppLayout'
import { useState, useEffect, useCallback } from 'react'
import API from '../services/api'

const POPULAR_TAGS = ['Python', 'React', 'Node.js', 'Java', 'DevOps', 'AWS', 'TypeScript', 'Go', 'Data Science', 'Machine Learning']

export default function Jobs() {
  const [jobs, setJobs]         = useState([])
  const [total, setTotal]       = useState(0)
  const [search, setSearch]     = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  const fetchJobs = useCallback(async (q = '', tag = '') => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (q)   params.append('search', q)
      if (tag) params.append('tag', tag)
      const res = await API.get(`/live-jobs?${params}`)
      setJobs(res.data.jobs || [])
      setTotal(res.data.total || 0)
    } catch (e) {
      setError('Could not load live jobs. Check your internet connection.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchJobs(search, activeTag), 400)
    return () => clearTimeout(t)
  }, [search, activeTag, fetchJobs])

  const handleTag = (tag) => {
    const next = activeTag === tag ? '' : tag
    setActiveTag(next)
  }

  const formatDate = (ts) => {
    if (!ts) return ''
    try { return new Date(ts * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }
    catch { return '' }
  }

  return (
    <AppLayout breadcrumb="Jobs">
      <div className="dash-content">

        {/* Header */}
        <div className="page-header">
          <div>
            <h2>💼 Live Job Board</h2>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 3 }}>
              Real tech jobs · Updated every 10 min · Apply directly on company site
            </p>
          </div>
          {!loading && <span className="badge-count">{total} jobs</span>}
        </div>

        {/* Search bar */}
        <div className="search-bar">
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input
            placeholder="Search by title, company, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {loading && <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Fetching...</span>}
        </div>

        {/* Tag filters */}
        <div className="tag-filter-row">
          {POPULAR_TAGS.map(tag => (
            <button
              key={tag}
              className={`tag-filter-btn ${activeTag === tag ? 'active' : ''}`}
              onClick={() => handleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {error && <div className="alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

        {/* Job list */}
        {loading && jobs.length === 0 ? (
          <div className="loading-state">
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🌐</div>
            <p>Fetching live jobs worldwide...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="loading-state">
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🔍</div>
            <p>No jobs found. Try a different keyword or tag.</p>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-top">
                  {/* Company logo + info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                    <div className="company-logo">
                      {job.logo ? (
                        <img src={job.logo} alt={job.company}
                          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                        />
                      ) : null}
                      <span style={{ display: job.logo ? 'none' : 'flex' }}>
                        {job.company[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">
                        🏢 {job.company}
                        {job.location && <span> · 📍 {job.location}</span>}
                        {job.remote && <span className="remote-badge">🌍 Remote</span>}
                      </p>
                    </div>
                  </div>
                  {/* Date badge */}
                  {job.created_at && (
                    <span className="date-badge">{formatDate(job.created_at)}</span>
                  )}
                </div>

                {/* Description */}
                {job.description && (
                  <p className="job-desc">{job.description}...</p>
                )}

                {/* Footer */}
                <div className="job-footer">
                  <div className="job-skills">
                    {job.skills?.split(',').filter(s => s.trim()).map(s => (
                      <span key={s} className="skill-tag"
                        onClick={() => { setActiveTag(s.trim()); fetchJobs(search, s.trim()) }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {job.salary && job.salary !== 'Competitive' && (
                      <span className="salary-text">💰 {job.salary}</span>
                    )}
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer"
                      className="apply-btn">
                      Apply Now →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  )
}
