import { useEffect, useState } from 'react'
import { getBooks, issueBook } from '../../api/books.js'

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [issuingId, setIssuingId] = useState(null)

  const getBookImage = (index) => {
    const images = [
      '/data-struc-book.png',
      '/design-book.png',
      '/digital-logic-book.png'
    ]
    return images[index % images.length]
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks()
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const handleIssue = async (bookId, title) => {
    setIssuingId(bookId)
    try {
      await issueBook(bookId)
      window.alert(`${title} has been issued successfully!`)
      const data = await getBooks()
      setBooks(data)
    } catch (err) {
      window.alert(`Error: ${err.message}`)
    } finally {
      setIssuingId(null)
    }
  }

  return (
    <section className="page-card">
      <h2>Browse Books</h2>
      <p>Choose a book and issue if it is available.</p>
      
      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!loading && books.length === 0 && <p>No books available.</p>}
      
      {!loading && books.length > 0 && (
        <div className="book-grid" style={{ marginTop: '1rem' }}>
          {books.map((book, index) => {
            const isAvailable = book.availableCopies > 0
            return (
              <article className="book-card" key={book._id}>
                <img src={getBookImage(index)} alt={book.title} />
                <div className="book-meta">
                  <h3>{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta-bottom">
                    <span className={`badge ${isAvailable ? 'badge-available' : 'badge-issued'}`}>
                      {isAvailable ? 'Available' : 'Not Available'}
                    </span>
                    <button
                      className="btn btn-primary btn-issue"
                      disabled={!isAvailable || issuingId === book._id}
                      onClick={() => handleIssue(book._id, book.title)}
                    >
                      {issuingId === book._id ? 'Issuing...' : isAvailable ? 'Issue Book' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
