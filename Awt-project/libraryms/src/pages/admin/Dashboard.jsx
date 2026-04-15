import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Books', value: 0 },
    { label: 'Issued', value: 0 },
    { label: 'Members', value: 0 }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('libraryToken')
        const headers = { 'Authorization': `Bearer ${token}` }

        // Fetch books count
        const booksRes = await fetch('http://localhost:5000/api/books', { headers })
        const books = await booksRes.json()
        const issued = books.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0)

        // Fetch users count
        const usersRes = await fetch('http://localhost:5000/api/users', { headers })
        const users = await usersRes.json()
        const clientCount = users.filter(u => u.role === 'client').length

        setStats([
          { label: 'Total Books', value: books.length },
          { label: 'Issued', value: issued },
          { label: 'Members', value: clientCount }
        ])
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="page-card">
      <h2>Admin Dashboard</h2>
      <div className="grid-2" style={{ marginTop: '1rem' }}>
        {stats.map((item) => (
          <article key={item.label} style={{ padding: '1rem', background: '#1e293b', color: '#e2e8f0', borderRadius: '8px' }}>
            <h3>{loading ? '...' : item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
