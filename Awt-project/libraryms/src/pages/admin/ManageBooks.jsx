import { useState, useEffect } from 'react'

export default function ManageBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('libraryToken')
        const response = await fetch('http://localhost:5000/api/books', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch books')
        }
        
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return (
    <section className="page-card">
      <h2>Manage Books</h2>
      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!loading && books.length === 0 && <p>No books added yet. Go to Add Book to create one.</p>}
      {!loading && books.length > 0 && (
        <table className="responsive-table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr><th>Title</th><th>Author</th><th>Category</th><th>Available</th><th>Total</th></tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category || 'N/A'}</td>
                <td><span className={b.availableCopies > 0 ? 'badge badge-available' : 'badge badge-issued'}>{b.availableCopies}</span></td>
                <td>{b.totalCopies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

