import AppLayout from '../components/AppLayout'
import { useState, useEffect, useRef } from 'react'
import API from '../services/api'

export default function ResumePage() {
  const user       = JSON.parse(localStorage.getItem('user') || '{}')
  const [resumes, setResumes]   = useState([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage]   = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const fetchResumes = async () => {
    try {
      const res = await API.get(`/resume/${user.id}`)
      setResumes(res.data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchResumes() }, [])

  const handleUpload = async (file) => {
    if (!file || !file.name.endsWith('.pdf')) {
      setMessage('❌ Please upload a PDF file only!')
      return
    }
    setUploading(true)
    setMessage('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await API.post(`/resume/upload?user_id=${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage(`✅ ${res.data.message}`)
      fetchResumes()
    } catch (e) {
      setMessage('❌ Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <AppLayout breadcrumb="Resume">
    <div className="dash-content">
      <div className="page-header">
        <h2>📄 Resume Manager</h2>
        <span className="badge-count">{resumes.length} uploaded</span>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]) }}
        onClick={() => fileRef.current.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
        <div className="upload-icon">{uploading ? '⏳' : '📂'}</div>
        <h3>{uploading ? 'Uploading & parsing PDF...' : 'Drop your resume here'}</h3>
        <p>{uploading ? 'Extracting text and skills...' : 'Click or drag & drop a PDF file'}</p>
        {!uploading && <span className="upload-btn">Choose PDF file</span>}
      </div>

      {/* Message */}
      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {/* Resume list */}
      {resumes.length > 0 && (
        <div className="resume-list">
          <h3 className="section-title">Your Resumes</h3>
          {resumes.map((r) => (
            <div key={r.id} className="resume-card">
              <div className="resume-card-top">
                <div className="resume-icon">📄</div>
                <div className="resume-info">
                  <h4>{r.filename}</h4>
                  <p>Uploaded • {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <span className="status-badge parsed">{r.status}</span>
              </div>
              {r.skills && (
                <div className="resume-skills">
                  <p className="skills-label">🎯 Detected Skills:</p>
                  <div className="job-skills">
                    {r.skills.split(',').map(s => (
                      <span key={s} className="skill-tag">{s.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </AppLayout>
  )
}
