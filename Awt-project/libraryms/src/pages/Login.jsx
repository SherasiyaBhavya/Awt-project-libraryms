import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth.js'

const initialState = { email: '', password: '' }

export default function Login() {
  const [mode, setMode] = useState('client')
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const err = {}
    if (!form.email.trim()) err.email = 'Email is required.'
    if (!form.password) err.password = 'Password is required.'
    else if (form.password.length < 5) err.password = 'Password must be 5+ chars.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setServerError('')
    setLoading(true)

    try {
      const data = await login({ email: form.email, password: form.password })
      localStorage.setItem('libraryToken', data.token)
      localStorage.setItem('libraryUser', JSON.stringify(data.user))

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/client/home')
      }
    } catch (error) {
      setServerError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-card">
        <h1>{mode === 'client' ? 'Student / Client Login' : 'Admin Login'}</h1>
        <p>Enter credentials to continue.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in…' : mode === 'client' ? 'Client Sign In' : 'Admin Sign In'}
          </button>
          {serverError && <p className="error" style={{ marginTop: '1rem' }}>{serverError}</p>}
        </form>
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'client' ? 'admin' : 'client'))
            setForm(initialState)
            setErrors({})
            setServerError('')
          }}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '0.8rem' }}
        >
          Switch to {mode === 'client' ? 'Admin' : 'Client'} Login
        </button>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
          Don't have an account? <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </section>
    </div>
  )
}
