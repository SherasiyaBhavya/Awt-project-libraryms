import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddBook() {
  const [form, setForm] = useState({ title: '', author: '', publisher: '', totalCopies: 1, description: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const valid = form.title.trim() && form.author.trim() && form.totalCopies > 0
  
  const onSubmit = async (e) => {
    e.preventDefault()
    if (!valid) {
      setError('Please fill book name, author, and copies.')
      return
    }
    
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const token = localStorage.getItem('libraryToken')
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add book')
      }

      setMessage(`${form.title} added successfully.`)
      setForm({ title: '', author: '', publisher: '', totalCopies: 1, description: '' })
      
      setTimeout(() => {
        navigate('/admin/managebooks')
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-card">
      <h2>Add a New Book</h2>
      <form onSubmit={onSubmit} style={{ marginTop: '1rem' }}>
        <div className="form-group"><label>Book Name</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Book title" /></div>
        <div className="form-group"><label>Author</label><input value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} placeholder="Author name" /></div>
        <div className="form-group"><label>Publisher (optional)</label><input value={form.publisher} onChange={(e) => setForm((p) => ({ ...p, publisher: e.target.value }))} placeholder="Publisher" /></div>
        <div className="form-group"><label>Copies</label><input type="number" min="1" value={form.totalCopies} onChange={(e) => setForm((p) => ({ ...p, totalCopies: parseInt(e.target.value) || 1 }))} /></div>
        <div className="form-group"><label>Description (optional)</label><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Book description" rows="3"></textarea></div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Book'}</button>
      </form>
      {error && <p style={{ marginTop: '0.8rem', color: '#ef4444' }}>{error}</p>}
      {message && <p style={{ marginTop: '0.8rem', color: '#22c55e' }}>{message}</p>}
    </section>
  )
}

