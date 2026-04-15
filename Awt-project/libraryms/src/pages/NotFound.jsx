import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-card">
      <h2>404 - Page Not Found</h2>
      <p>The route you requested does not exist.</p>
      <Link to="/login" className="btn btn-secondary">Return to Login</Link>
    </div>
  )
}
