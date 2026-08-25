import AppLayout from '../components/AppLayout'
import { useState, useEffect } from 'react'
import API from '../services/api'

export default function Jobs() {
  const [jobs, setJobs]       = useState([])
  const [total, setTotal]     = useState(0)
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  const fetchJobs = async (q = '') => {
    setLoading(true)
    try {
      const res = await API.get(`/jobs/?search=${q}&limit=20`)
      setJobs(res.data.jobs)
      setTotal(res.data.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed'
    const fmt = (n) => `₹${(n/100000).toFixed(1)}L`
    return `${fmt(min)} – ${fmt(max)}`
  }

  return (
    <AppLayout breadcrumb="Job Matching">
      <div className="dash-content">
        <div className="page-header">
          <h2>💼 Job Listings</h2>
          <span className="badge-count">{total} jobs found</span>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search jobs, companies, skills..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              fetchJobs(e.target.value)
            }}
          />
        </div>

        {loading ? (
          <div className="loading-state">Loading jobs...</div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-top">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">🏢 {job.company} · 📍 {job.location}</p>
                  </div>
                  <span className={`job-type-badge ${job.job_type?.toLowerCase().replace('-','')}`}>
                    {job.job_type}
                  </span>
                </div>
                <p className="job-desc">{job.description}</p>
                <div className="job-footer">
                  <div className="job-skills">
                    {job.skills?.split(',').map(s => (
                      <span key={s} className="skill-tag">{s.trim()}</span>
                    ))}
                  </div>
                  <div className="job-meta">
                    <span>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                    <span>🎯 {job.experience}</span>
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
