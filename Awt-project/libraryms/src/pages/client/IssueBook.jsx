import { useState, useEffect } from 'react'
import { getBooks, issueBook } from '../../api/books.js'

export default function IssueBook() {
  const [books, setBooks] = useState([])
  const [inputs, setInputs] = useState({ book: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [issuingId, setIssuingId] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks()
        const availableBooks = data.filter(b => b.availableCopies > 0)
        setBooks(availableBooks)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!inputs.book) {
      setMessage('Please select a book.')
      return
    }
    
    setIssuingId(inputs.book)
    setMessage('')
    
    try {
      const selectedBook = books.find(b => b._id === inputs.book)
      await issueBook(inputs.book)
      setMessage(`"${selectedBook?.title}" has been issued successfully to you!`)
      setInputs({ book: '' })
      
      const data = await getBooks()
      const availableBooks = data.filter(b => b.availableCopies > 0)
      setBooks(availableBooks)
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setIssuingId(null)
    }
  }

  return (
    <section className="page-card">
      <h2>Issue Book</h2>
      <p>Select a book to issue directly.</p>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {loading && <p>Loading available books...</p>}
      
      {!loading && books.length === 0 && <p>No books available at the moment.</p>}
      
      {!loading && books.length > 0 && (
        <form onSubmit={submit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label htmlFor="book">Select Book</label>
            <select
              id="book"
              value={inputs.book}
              onChange={(e) => setInputs((p) => ({ ...p, book: e.target.value }))}
            >
              <option value="">-- Select Available Book --</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={issuingId}>
            {issuingId ? 'Issuing...' : 'Issue Book'}
          </button>
        </form>
      )}
      {message && <p style={{ marginTop: '0.8rem', color: message.includes('Error') ? '#ef4444' : '#22c55e' }}>{message}</p>}
    </section>
  )
}
