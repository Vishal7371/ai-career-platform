import { useState } from 'react'
import { loginUser } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(form)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-split">
        {/* Left branding panel */}
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-logo">⚡</div>
            <h1 className="brand-title">AI Career<br/>Platform</h1>
            <p className="brand-sub">Your intelligent career co-pilot powered by cutting-edge AI & data engineering.</p>
            <div className="brand-features">
              <div className="feat"><span>🤖</span> AI Resume Analysis</div>
              <div className="feat"><span>💼</span> Smart Job Matching</div>
              <div className="feat"><span>📊</span> Skill Gap Insights</div>
              <div className="feat"><span>🧠</span> Career AI Assistant</div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : null}
                {loading ? 'Signing in...' : 'Sign in →'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
