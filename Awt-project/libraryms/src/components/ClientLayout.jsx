import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function ClientLayout() {
  const navigate = useNavigate()
  return (
    <div className="layout client">
      <div className="topbar">
        <h1>Library Manager</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/login')}>Logout</button>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside className="client-leftnav leftnav">
          <NavLink to="home" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="books" className={({ isActive }) => (isActive ? 'active' : '')}>Browse Books</NavLink>
          <NavLink to="mybooks" className={({ isActive }) => (isActive ? 'active' : '')}>My Books</NavLink>
          <NavLink to="issuebook" className={({ isActive }) => (isActive ? 'active' : '')}>Issue Book</NavLink>
          <NavLink to="profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
        </aside>
        <main className="content-frame">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
