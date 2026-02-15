import React from 'react'
import '../styles/About.css'

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About PEN Club</h1>
          <p className="about-tagline">Play • Enjoy • Network</p>
        </div>
      </section>

      <section className="section about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                PEN Club was founded with a simple yet powerful vision: to create a space 
                where people can come together to play, enjoy life, and build meaningful 
                connections. We believe that the best networking happens when people are 
                relaxed, having fun, and being themselves.
              </p>
              <p>
                What started as a small gathering of friends has grown into a vibrant 
                community of diverse individuals who share a passion for life, creativity, 
                and connection. Our events range from casual game nights to professional 
                networking sessions, always maintaining the perfect balance between fun 
                and purpose.
              </p>
            </div>
            <div className="about-image">
              <img src="/logo.png" alt="PEN Club" />
            </div>
          </div>
        </div>
      </section>

      <section className="section mission-section">
        <div className="container">
          <h2 className="section-title">Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Vision</h3>
              <p>
                To be the premier community where professionals and enthusiasts 
                come together to create unforgettable experiences while building 
                lasting relationships.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💡</div>
              <h3>Our Values</h3>
              <p>
                Inclusivity, creativity, authenticity, and fun. We believe in 
                creating an environment where everyone feels welcome and valued.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🚀</div>
              <h3>Our Goal</h3>
              <p>
                To facilitate meaningful connections through engaging activities 
                that bring out the best in people and create lasting memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">What Makes Us Different</h2>
          <div className="values-list">
            <div className="value-item">
              <span className="value-number">01</span>
              <div className="value-content">
                <h3>Community First</h3>
                <p>
                  We prioritize building a supportive and inclusive community where 
                  everyone can thrive and feel at home.
                </p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-number">02</span>
              <div className="value-content">
                <h3>Fun & Professional</h3>
                <p>
                  We strike the perfect balance between entertainment and professional 
                  networking, making every event valuable and enjoyable.
                </p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-number">03</span>
              <div className="value-content">
                <h3>Diverse Activities</h3>
                <p>
                  From game nights to workshops, we offer a wide range of activities 
                  that cater to different interests and preferences.
                </p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-number">04</span>
              <div className="value-content">
                <h3>Lasting Connections</h3>
                <p>
                  We focus on creating opportunities for genuine connections that 
                  extend beyond our events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
