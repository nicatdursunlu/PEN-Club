import React from 'react'
import Hero from '../components/Hero'
import '../styles/Home.css'

const Home = () => {
  return (
    <div className="home">
      <Hero />
      
      <section className="section features">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Play</h3>
              <p>
                Sports games, board games, Mafia nights, and recreational activities 
                that bring Azerbaijani youth together for fun and memorable experiences.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎉</div>
              <h3>Enjoy</h3>
              <p>
                Picnics, social meetups, and intellectual competitions designed to 
                make your leisure time productive while having maximum fun.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Network</h3>
              <p>
                Professional development events and networking opportunities to build 
                lasting connections within the Azerbaijani community in Poland.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Events Organized</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5+</div>
              <div className="stat-label">Event Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Community Focused</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join the Community?</h2>
            <p>
              Become part of the Azerbaijani youth community in Poland. Experience 
              sports, games, networking, and make your leisure time truly productive!
            </p>
            <a href="/contact" className="btn">Get Started</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
