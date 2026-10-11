import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../services/authService'
import { AUTH_CHANGE_EVENT } from '../services/authStorage'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [session, setSession] = useState(getSession)

  useEffect(() => {
    const updateSession = () => setSession(getSession())
    window.addEventListener(AUTH_CHANGE_EVENT, updateSession)
    window.addEventListener('storage', updateSession)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, updateSession)
      window.removeEventListener('storage', updateSession)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/events', label: 'Events' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <nav className={`fixed top-0 left-0 w-full bg-primary z-50 transition-all duration-300 shadow-lg ${
      scrolled ? 'py-2 bg-opacity-95 backdrop-blur-md' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white transition-transform duration-300 hover:scale-105">
          <img 
            src="/logo.jpeg" 
            alt="PEN Club Logo" 
            className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-12'}`}
          />
          <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            PEN Club
          </span>
        </Link>

        <div id="main-navigation" className={`lg:flex lg:gap-2 lg:items-center fixed lg:static left-0 w-full lg:w-auto bg-primary lg:bg-transparent transition-all duration-300 shadow-2xl lg:shadow-none ${
          isOpen ? 'top-[70px]' : '-top-full'
        }`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block lg:inline-block text-white font-medium text-base px-4 py-3 lg:py-2 rounded-md transition-all duration-300 relative
                ${location.pathname === item.path 
                  ? 'text-secondary after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:h-0.5 after:bg-secondary' 
                  : 'hover:text-secondary'
                }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 py-3 lg:py-0 lg:ml-3">
            {session?.role === 'ADMIN' ? (
              <>
                <Link to="/admin" className="px-5 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-orange-600 whitespace-nowrap">Admin panel</Link>
                <button type="button" onClick={() => {
                  logout()
                  setIsOpen(false)
                  navigate('/admin/login', { replace: true })
                }} className="px-4 py-2 rounded-lg bg-transparent text-white border border-white/40 hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary">Logout</button>
              </>
            ) : session ? (
              <>
                <Link to="/profile" className="px-5 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-orange-600 whitespace-nowrap">My profile</Link>
                <button type="button" onClick={() => {
                  logout()
                  setIsOpen(false)
                  navigate('/login', { replace: true })
                }} className="px-4 py-2 rounded-lg bg-transparent text-white border border-white/40 hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-white border border-white/40 hover:border-secondary hover:text-secondary">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-orange-600">Register</Link>
              </>
            )}
          </div>
        </div>

        <button type="button" aria-label={isOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isOpen} aria-controls="main-navigation" className="lg:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent p-2" onClick={toggleMenu}>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 rounded ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 rounded ${
            isOpen ? 'opacity-0' : ''
          }`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 rounded ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
