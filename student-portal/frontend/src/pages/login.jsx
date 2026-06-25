import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Cannot connect to server')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Student Portal</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

          <p style={styles.hint}>
            Student: haruki@university.edu / student123<br/>
            Admin: admin@university.edu / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff', padding: '40px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px',
  },
  title: { margin: '0 0 6px 0', fontSize: '24px', color: '#1a1a2e' },
  subtitle: { margin: '0 0 24px 0', color: '#666', fontSize: '14px' },
  errorBox: {
    backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px',
    borderRadius: '6px', fontSize: '13px', marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#333' },
  input: {
    padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd',
    fontSize: '14px', outline: 'none',
  },
  button: {
    padding: '11px', backgroundColor: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '15px',
    cursor: 'pointer', marginTop: '4px',
  },
  hint: { fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px', lineHeight: '1.6' },
}