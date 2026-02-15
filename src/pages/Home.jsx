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
                Engage in exciting activities, games, and recreational events 
                designed to bring out your playful side and create memorable experiences.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎉</div>
              <h3>Enjoy</h3>
              <p>
                Immerse yourself in a vibrant atmosphere filled with entertainment, 
                laughter, and joy. Every event is crafted for maximum enjoyment.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Network</h3>
              <p>
                Connect with like-minded individuals, build meaningful relationships, 
                and expand your professional and social network.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join the Fun?</h2>
            <p>
              Become part of our growing community and experience the perfect 
              blend of entertainment and networking.
            </p>
            <a href="/contact" className="btn">Get Started</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
