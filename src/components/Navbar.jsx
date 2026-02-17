import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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

        <div className={`md:flex md:gap-8 md:items-center fixed md:static left-0 w-full md:w-auto bg-primary md:bg-transparent transition-all duration-300 shadow-2xl md:shadow-none ${
          isOpen ? 'top-[70px]' : '-top-full'
        }`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block md:inline-block text-white font-medium text-base px-4 py-3 md:py-2 rounded-md transition-all duration-300 relative
                ${location.pathname === item.path 
                  ? 'text-secondary after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:h-0.5 after:bg-secondary' 
                  : 'hover:text-secondary'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="md:hidden flex flex-col gap-1.5 cursor-pointer" onClick={toggleMenu}>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 rounded ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 rounded ${
            isOpen ? 'opacity-0' : ''
          }`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 rounded ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
