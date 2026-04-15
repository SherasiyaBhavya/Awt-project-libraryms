import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth.js'

const initialState = { name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'client' }

export default function Register() {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required.'
    if (!form.email.trim()) err.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Invalid email format.'
    if (!form.password) err.password = 'Password is required.'
    else if (form.password.length < 6) err.password = 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword) err.confirmPassword = 'Passwords do not match.'
    
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setServerError('')
    setLoading(true)

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || '',
        role: form.role
      }
      
      const data = await register(payload)
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
        <h1>Create an Account</h1>
        <p>Join our library system to get started.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
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
            <label htmlFor="phone">Phone (Optional)</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            >
              <option value="client">Client (Student)</option>
              <option value="admin">Admin (Librarian)</option>
            </select>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account…' : 'Sign Up'}
          </button>
          {serverError && <p className="error" style={{ marginTop: '1rem' }}>{serverError}</p>}
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
          Already have an account? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
        </p>
      </section>
    </div>
  )
}
