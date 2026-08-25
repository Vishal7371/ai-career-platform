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
    <div className="auth-root">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">AI</div>
          <span className="auth-logo-text">CareerAI</span>
        </div>

        <h2>Welcome back</h2>
        <p>Sign in to your account to continue</p>

        {error && <div className="alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              name="email" type="email"
              placeholder="you@example.com"
              onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password" type="password"
              placeholder="Enter your password"
              onChange={handleChange} required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
