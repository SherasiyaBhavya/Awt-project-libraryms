import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import ClientLayout from './components/ClientLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import Home from './pages/client/Home.jsx'
import Books from './pages/client/Books.jsx'
import MyBooks from './pages/client/MyBooks.jsx'
import Profile from './pages/client/Profile.jsx'
import IssueBook from './pages/client/IssueBook.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ManageBooks from './pages/admin/ManageBooks.jsx'
import AddBook from './pages/admin/AddBook.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'

function App() {
  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route path="mybooks" element={<MyBooks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="issuebook" element={<IssueBook />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="managebooks" element={<ManageBooks />} />
            <Route path="addbook" element={<AddBook />} />
            <Route path="manageusers" element={<ManageUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
