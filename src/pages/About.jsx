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
                PEN Club is a dynamic platform aimed at making leisure time productive 
                and enjoyable for Azerbaijani youth living in Poland. We believe in 
                building social connections through games and forming a strong, supportive 
                community where everyone feels at home.
              </p>
              <p>
                With over 50+ events organized, we've created countless opportunities 
                for our community to play, enjoy, and network. From sports games to 
                intellectual competitions, from Mafia nights to professional networking 
                events, we bring people together in meaningful and fun ways.
              </p>
            </div>
            <div className="about-image">
              <img src="/logo.jpeg" alt="PEN Club" />
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
              <h3>Our Goal</h3>
              <p>
                To bring together Azerbaijani youth living in Poland and organize 
                social and professional events that make leisure time productive 
                and enjoyable.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💡</div>
              <h3>Our Community</h3>
              <p>
                Building a strong, supportive community through games, social 
                connections, and shared experiences that create lasting friendships.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🚀</div>
              <h3>Our Achievement</h3>
              <p>
                With 50+ events organized and counting, we continue to grow and 
                create opportunities for our community to thrive together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">What We Organize</h2>
          <div className="values-list">
            <div className="value-item">
              <span className="value-number">01</span>
              <div className="value-content">
                <h3>Sports Games ⚽️🎾🏓</h3>
                <p>
                  Football, tennis, table tennis, and various sports activities that 
                  keep our community active, healthy, and connected through friendly 
                  competition.
                </p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-number">02</span>
              <div className="value-content">
                <h3>Intellectual Competitions 🎓</h3>
                <p>
                  Quiz nights, trivia competitions, and brain-teasing challenges that 
                  stimulate minds and encourage learning in a fun, competitive environment.
                </p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-number">03</span>
              <div className="value-content">
                <h3>Mafia / Board Games 🕵️‍♂️🕵️</h3>
                <p>
                  Strategic Mafia games, board game nights, and card games that bring 
                  people together for hours of entertainment and social bonding.
                </p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-number">04</span>
              <div className="value-content">
                <h3>Picnics & Social Meetups 🪵🧺</h3>
                <p>
                  Outdoor gatherings, picnics, and casual meetups that allow our 
                  community to relax, socialize, and enjoy nature together.
                </p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-number">05</span>
              <div className="value-content">
                <h3>Networking & Professional Events 🗽🖇️</h3>
                <p>
                  Career development workshops, professional networking sessions, and 
                  mentorship opportunities that help our community grow professionally.
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
