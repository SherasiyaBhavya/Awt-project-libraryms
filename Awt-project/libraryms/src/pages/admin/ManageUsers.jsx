import { useState, useEffect } from 'react'
import { getUsers, deleteUser } from '../../api/users.js'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await deleteUser(userId)
        window.alert('User deleted successfully')
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
        window.alert(`Error: ${err.message}`)
      }
    }
  }

  return (
    <section className="page-card">
      <h2>Manage Users</h2>
      <p>Total users: {users.length}</p>
      
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      
      {!loading && users.length > 0 && (
        <table className="responsive-table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`badge ${user.role === 'admin' ? 'badge-issued' : 'badge-available'}`}>{user.role}</span></td>
                <td>{user.phone || '-'}</td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => handleDeleteUser(user._id, user.name)}
                  >
                    Delete
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
