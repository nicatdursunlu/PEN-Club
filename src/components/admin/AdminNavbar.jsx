import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'

export default function AdminNavbar() {
  const navigate = useNavigate()
  const linkClass = ({ isActive }) => `px-3 py-2 rounded-lg text-sm font-semibold focus-visible:ring-2 focus-visible:ring-secondary ${isActive ? 'text-secondary bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'}`

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/admin" className="font-bold text-lg rounded-lg focus-visible:ring-2 focus-visible:ring-secondary">PEN Club Admin</Link>
        <nav aria-label="Admin navigation" className="flex flex-wrap items-center gap-2">
          <Link to="/" className="px-3 py-2 rounded-lg text-sm font-semibold hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary">Home</Link>
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/events" className={linkClass}>Events</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
          <Link to="/admin/events/new" className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-secondary">New Event</Link>
          <button type="button" onClick={() => { logout(); navigate('/login', { replace: true }) }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-secondary">Logout</button>
        </nav>
      </div>
    </header>
  )
}
