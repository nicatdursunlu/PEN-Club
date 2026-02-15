import React from 'react'
import '../styles/Events.css'

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Game Night Extravaganza',
      date: 'March 15, 2024',
      time: '7:00 PM - 11:00 PM',
      location: 'PEN Club Lounge',
      description: 'Join us for an evening of board games, video games, and friendly competition. Prizes for winners!',
      category: 'Entertainment'
    },
    {
      id: 2,
      title: 'Professional Networking Mixer',
      date: 'March 22, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Downtown Conference Center',
      description: 'Connect with professionals from various industries in a relaxed, fun atmosphere.',
      category: 'Networking'
    },
    {
      id: 3,
      title: 'Creative Workshop Series',
      date: 'March 29, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'PEN Club Studio',
      description: 'Unleash your creativity with hands-on workshops in art, music, and design.',
      category: 'Workshop'
    }
  ]

  const pastEvents = [
    {
      id: 1,
      title: 'Annual PEN Club Gala',
      date: 'February 14, 2024',
      attendees: 150,
      description: 'Our biggest event of the year with entertainment, networking, and celebration.'
    },
    {
      id: 2,
      title: 'Winter Sports Day',
      date: 'January 20, 2024',
      attendees: 80,
      description: 'Outdoor activities and team building in a winter wonderland setting.'
    }
  ]

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="container">
          <h1>Events</h1>
          <p>Discover exciting opportunities to play, enjoy, and network</p>
        </div>
      </section>

      <section className="section upcoming-events">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-category">{event.category}</div>
                <h3>{event.title}</h3>
                <div className="event-details">
                  <div className="event-detail">
                    <span className="detail-icon">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">🕐</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-description">{event.description}</p>
                <button className="btn">Register Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section past-events">
        <div className="container">
          <h2 className="section-title">Past Events</h2>
          <div className="past-events-list">
            {pastEvents.map((event) => (
              <div key={event.id} className="past-event-card">
                <div className="past-event-info">
                  <h3>{event.title}</h3>
                  <p className="past-event-date">{event.date}</p>
                  <p className="past-event-description">{event.description}</p>
                </div>
                <div className="past-event-stats">
                  <div className="stat">
                    <span className="stat-number">{event.attendees}</span>
                    <span className="stat-label">Attendees</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section event-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Want to Host an Event?</h2>
            <p>
              Have an idea for an event? We'd love to hear from you! 
              Contact us to discuss hosting your own PEN Club event.
            </p>
            <a href="/contact" className="btn">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Events
