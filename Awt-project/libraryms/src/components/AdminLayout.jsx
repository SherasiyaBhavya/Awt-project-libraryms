import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const navigate = useNavigate()
  return (
    <div className="layout admin">
      <div className="topbar" style={{ background: '#0f172a', color: '#e2e8f0' }}>
        <h1>Library Manager</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/login')}>Logout</button>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside className="admin-leftnav leftnav">
          <NavLink to="dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
          <NavLink to="managebooks" className={({ isActive }) => (isActive ? 'active' : '')}>Manage Books</NavLink>
          <NavLink to="addbook" className={({ isActive }) => (isActive ? 'active' : '')}>Add Book</NavLink>
          <NavLink to="manageusers" className={({ isActive }) => (isActive ? 'active' : '')}>Manage Users</NavLink>
        </aside>
        <main className="content-frame">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
