import { useState, useRef, useEffect } from 'react'
import API from '../services/api'

export default function Advisor() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "👋 Hi! I'm your AI Career Advisor.\n\nAsk me about your jobs, skills, salary, interviews, or career path!"
    }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg = { from: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await API.post('/advisor/chat', {
        user_id: user.id,
        message: input
      })
      setMessages(prev => [...prev, { from: 'bot', text: res.data.response }])
    } catch (e) {
      setMessages(prev => [...prev, { from: 'bot', text: '❌ Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [
    'What jobs match me?',
    'What skills do I have?',
    'What should I learn?',
    'Give me interview tips',
    'What salary can I expect?'
  ]

  return (
    <div className="dash-content" style={{ display: 'flex', flexDirection: 'column', height: '85vh' }}>
      <div className="page-header">
        <h2>🤖 AI Career Advisor</h2>
        <span className="badge-count">Free · Unlimited</span>
      </div>

      {/* Quick suggestions */}
      <div className="suggestions-row">
        {suggestions.map(s => (
          <button key={s} className="suggestion-chip" onClick={() => setInput(s)}>
            {s}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-wrap ${msg.from}`}>
            <div className={`chat-bubble ${msg.from}`}>
              {msg.text.split('\n').map((line, j) => (
                <span key={j}>
                  {line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}
                  <br />
                </span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble-wrap bot">
            <div className="chat-bubble bot typing">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <textarea
          rows={1}
          placeholder="Ask me anything about your career..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  )
}
