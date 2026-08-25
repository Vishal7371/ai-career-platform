import AppLayout from '../components/AppLayout'
import { useState, useEffect } from 'react'
import API from '../services/api'

export default function Jobs() {
  const [jobs, setJobs]       = useState([])
  const [total, setTotal]     = useState(0)
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const fetchJobs = async (q = '') => {
    setLoading(true)
    setError('')
    try {
      const res = await API.get(`/remote-jobs?search=${encodeURIComponent(q)}`)
      setJobs(res.data.jobs || [])
      setTotal(res.data.total || 0)
      if (res.data.error) setError('Could not reach RemoteOK. Showing cached results.')
    } catch (e) {
      setError('Failed to load jobs. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  let searchTimer = null
  const handleSearch = (val) => {
    setSearch(val)
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => fetchJobs(val), 500)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    } catch { return '' }
  }

  return (
    <AppLayout breadcrumb="Jobs">
      <div className="dash-content">
        <div className="page-header">
          <div>
            <h2>💼 Real Job Listings</h2>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>
              Live jobs from RemoteOK · Updated every 10 minutes
            </p>
          </div>
          <span className="badge-count">{total} live jobs</span>
        </div>

        {/* Search */}
        <div className="search-bar">
          <span>🔍</span>
          <input
            placeholder="Search by title, company, or skill (e.g. Python, React, DevOps)..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          {loading && <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Loading...</span>}
        </div>

        {error && (
          <div className="alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>
        )}

        {/* Jobs */}
        {loading && jobs.length === 0 ? (
          <div className="loading-state">
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🌍</div>
            <p>Fetching live jobs from RemoteOK...</p>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Company Logo */}
                    {job.logo ? (
                      <img src={job.logo} alt={job.company}
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', border: '1px solid #e5e7eb', background: '#f9fafb' }}
                        onError={e => e.target.style.display = 'none'}
                      />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                        {job.company[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">🏢 {job.company} · 📍 {job.location}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span className="job-type-badge">🌍 {job.job_type}</span>
                    {job.date && <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{formatDate(job.date)}</span>}
                  </div>
                </div>

                {job.description && (
                  <p className="job-desc">{job.description}</p>
                )}

                <div className="job-footer">
                  <div className="job-skills">
                    {job.skills?.split(',').filter(s => s.trim()).map(s => (
                      <span key={s} className="skill-tag">{s.trim()}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {job.salary && (
                      <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>
                        💰 {job.salary}
                      </span>
                    )}
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-btn"
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {jobs.length === 0 && !loading && (
              <div className="loading-state">
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>🔍</div>
                <p>No jobs found for "{search}". Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
