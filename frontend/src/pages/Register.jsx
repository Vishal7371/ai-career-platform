import { useState } from 'react'
import { registerUser } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', username: '', full_name: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-split">
        {/* Left branding panel */}
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-logo">⚡</div>
            <h1 className="brand-title">Join 10,000+<br/>Professionals</h1>
            <p className="brand-sub">Start your AI-powered career journey today. Free forever.</p>
            <div className="brand-steps">
              <div className="step"><span className="step-num">1</span><span>Create your account</span></div>
              <div className="step"><span className="step-num">2</span><span>Upload your resume</span></div>
              <div className="step"><span className="step-num">3</span><span>Get AI-powered insights</span></div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Create your account</h2>
              <p>Get started with AI career intelligence</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="full_name" placeholder="John Doe" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input name="username" placeholder="johndoe" onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Email address</label>
                <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" placeholder="Create a strong password" onChange={handleChange} required />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : null}
                {loading ? 'Creating account...' : 'Create free account →'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
