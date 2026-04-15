import { useEffect, useState } from 'react'
import { getMyIssuedBooks, returnBook } from '../../api/books.js'

export default function MyBooks() {
  const [myBooks, setMyBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const data = await getMyIssuedBooks()
        setMyBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMyBooks()
  }, [])

  const handleReturnBook = async (issueId) => {
    try {
      await returnBook(issueId)
      window.alert('Book returned successfully!')
      const data = await getMyIssuedBooks()
      setMyBooks(data)
    } catch (err) {
      window.alert(`Error: ${err.message}`)
    }
  }

  return (
    <section className="page-card">
      <h2>My Issued Books</h2>
      <p>You have {myBooks.length} books currently issued.</p>
      
      {loading && <p>Loading your books...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!loading && myBooks.length === 0 && <p>No books issued yet.</p>}
      
      {!loading && myBooks.length > 0 && (
        <table className="responsive-table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr><th>Title</th><th>Author</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {myBooks.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.book?.title || 'N/A'}</td>
                <td>{issue.book?.author || 'N/A'}</td>
                <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                <td><span className={`badge ${issue.status === 'issued' ? 'badge-available' : 'badge-issued'}`}>{issue.status}</span></td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleReturnBook(issue._id)}
                    disabled={issue.status !== 'issued'}
                  >
                    {issue.status === 'issued' ? 'Return' : 'Returned'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
