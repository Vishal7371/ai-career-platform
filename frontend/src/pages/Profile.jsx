import AppLayout from '../components/AppLayout'
import { useState, useEffect } from 'react'
import API from '../services/api'

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [profile, setProfile]   = useState({ full_name: '', username: '', email: '' })
  const [pwForm, setPwForm]     = useState({ current_password: '', new_password: '', confirm: '' })
  const [msg, setMsg]           = useState({ profile: '', password: '' })
  const [loading, setLoading]   = useState({ profile: false, password: false })

  useEffect(() => {
    API.get(`/profile/${storedUser.id}`).then(res => setProfile(res.data))
  }, [])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(l => ({ ...l, profile: true }))
    try {
      const res = await API.put(`/profile/${storedUser.id}`, {
        full_name: profile.full_name,
        username:  profile.username,
      })
      // Update localStorage with new info
      localStorage.setItem('user', JSON.stringify({ ...storedUser, username: res.data.username, full_name: res.data.full_name }))
      setMsg(m => ({ ...m, profile: '✅ Profile updated!' }))
    } catch (e) {
      setMsg(m => ({ ...m, profile: '❌ Update failed.' }))
    } finally {
      setLoading(l => ({ ...l, profile: false }))
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm) {
      setMsg(m => ({ ...m, password: '❌ New passwords do not match!' }))
      return
    }
    setLoading(l => ({ ...l, password: true }))
    try {
      await API.put(`/profile/${storedUser.id}/password`, {
        current_password: pwForm.current_password,
        new_password:     pwForm.new_password,
      })
      setMsg(m => ({ ...m, password: '✅ Password changed successfully!' }))
      setPwForm({ current_password: '', new_password: '', confirm: '' })
    } catch (e) {
      setMsg(m => ({ ...m, password: e.response?.data?.detail || '❌ Failed to change password.' }))
    } finally {
      setLoading(l => ({ ...l, password: false }))
    }
  }

  return (
    <div className="dash-content">
      <div className="page-header">
        <h2>⚙️ Profile Settings</h2>
      </div>

      <div className="profile-grid">

        {/* Avatar + info */}
        <div className="profile-avatar-card">
          <div className="profile-avatar-big">
            {(profile.username || 'U')[0].toUpperCase()}
          </div>
          <h3>{profile.full_name || profile.username}</h3>
          <p>{profile.email}</p>
          <div className="profile-badges">
            <span className="badge-plan">Free Plan</span>
            <span className="badge-active">● Active</span>
          </div>
        </div>

        <div className="profile-forms">

          {/* Edit profile form */}
          <div className="profile-section">
            <h3>Personal Information</h3>
            {msg.profile && (
              <div className={`alert ${msg.profile.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
                {msg.profile}
              </div>
            )}
            <form onSubmit={handleProfileSave} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    value={profile.full_name || ''}
                    onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    value={profile.username || ''}
                    onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
                    placeholder="Your username"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email (cannot change)</label>
                <input value={profile.email || ''} disabled className="input-disabled" />
              </div>
              <button type="submit" className="btn-primary" disabled={loading.profile}>
                {loading.profile ? <span className="spinner" /> : null}
                {loading.profile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change password form */}
          <div className="profile-section">
            <h3>Change Password</h3>
            {msg.password && (
              <div className={`alert ${msg.password.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
                {msg.password}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={pwForm.current_password}
                  onChange={e => setPwForm(p => ({ ...p, current_password: e.target.value }))}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={pwForm.new_password}
                    onChange={e => setPwForm(p => ({ ...p, new_password: e.target.value }))}
                    placeholder="New password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading.password}>
                {loading.password ? <span className="spinner" /> : null}
                {loading.password ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
