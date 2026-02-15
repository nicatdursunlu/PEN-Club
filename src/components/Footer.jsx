import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PEN Club</h3>
            <p className="footer-tagline">Play • Enjoy • Network</p>
            <p className="footer-description">
              Join our vibrant community where fun meets networking. 
              Experience unforgettable events and build lasting connections.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="social-icon">📘</i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="social-icon">📷</i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="social-icon">🐦</i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="social-icon">💼</i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} PEN Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
