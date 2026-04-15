import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBooks, issueBook } from '../../api/books.js'

export default function Home() {
  const [latest, setLatest] = useState([])
  const [error, setError] = useState('')
  const [issuingId, setIssuingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getBooks()
        setLatest(books.slice(0, 3))
      } catch (err) {
        setError(err.message)
      }
    }

    fetchBooks()
  }, [])

  const stats = [
    { label: 'Total Books', value: latest.length },
    { label: 'Available', value: latest.reduce((sum, b) => sum + (b.availableCopies || 0), 0) },
    { label: 'Issued', value: latest.reduce((sum, b) => sum + ((b.totalCopies || 0) - (b.availableCopies || 0)), 0) },
    { label: 'Overdue', value: 0 },
  ]

  const handleViewAll = () => {
    navigate('/client/books')
  }

  const getBookImage = (index) => {
    const images = [
      '/data-struc-book.png',
      '/design-book.png',
      '/digital-logic-book.png'
    ]
    return images[index % images.length]
  }

  const handleIssue = async (bookId, title) => {
    setIssuingId(bookId)
    try {
      await issueBook(bookId)
      window.alert(`${title} has been issued successfully!`)
    } catch (err) {
      window.alert(`Error: ${err.message}`)
    } finally {
      setIssuingId(null)
    }
  }

  return (
    <section className="page-card">
      <h2>Welcome to Student Library</h2>
      <p>Dashboard overview and quick actions to browse or issue books.</p>

      <div className="grid-2" style={{ gap: '0.9rem', marginTop: '1rem' }}>
        {stats.map((item) => (
          <article key={item.label} className="dashboard-card">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </div>

      <h3 style={{ marginTop: '1.4rem' }}>Featured Books</h3>
      <p>Latest additions and available books.</p>

      {error && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>}

      {latest.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No books available yet.</p>
      ) : (
        <div className="grid-2" style={{ marginTop: '1rem' }}>
          {latest.map((book, index) => (
            <article key={book._id} className="book-card" style={{ margin: 0 }}>
              <img src={getBookImage(index)} alt={book.title} />
              <div className="book-meta" style={{ padding: '0.75rem' }}>
                <h3>{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-meta-bottom">
                  <button 
                    className="btn btn-primary btn-issue" 
                    onClick={() => handleIssue(book._id, book.title)}
                    disabled={book.availableCopies < 1 || issuingId === book._id}
                  >
                    {issuingId === book._id ? 'Issuing...' : book.availableCopies > 0 ? 'Issue Book' : 'Not Available'}
                  </button>
                  <button className="btn btn-secondary" onClick={handleViewAll}>
                    View All
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
