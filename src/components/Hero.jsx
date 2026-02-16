import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Welcome to <span className="highlight">PEN Club</span>
          </h1>
          <p className="hero-subtitle">Play • Enjoy • Network</p>
          <p className="hero-description">
            A dynamic platform for Azerbaijani youth in Poland, making leisure time 
            productive and enjoyable through games, social connections, and building 
            a strong community. Join us for 50+ amazing events and counting!
          </p>
          <div className="hero-buttons">
            <Link to="/events" className="btn">
              Explore Events
            </Link>
            <Link to="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/logo.jpeg" alt="PEN Club" className="hero-logo" />
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll Down</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  )
}

export default Hero
