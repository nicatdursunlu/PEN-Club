import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Events.css'

const Events = () => {
  const navigate = useNavigate()
  const upcomingEvents = [
    {
      id: 'football-tournament-march-2026',
      title: 'Football Tournament',
      date: 'March 15, 2026',
      time: '3:00 PM - 6:00 PM',
      location: 'City Sports Complex',
      description: 'Join us for an exciting football tournament! Form teams and compete for the championship trophy.',
      category: 'Sports',
      hasDetailPage: true
    },
    {
      id: 'mafia-night-march-2026',
      title: 'Mafia Night',
      date: 'March 22, 2026',
      time: '7:00 PM - 11:00 PM',
      location: 'Community Center',
      description: 'Strategic Mafia game night with multiple rounds. Test your detective skills and social deduction!',
      category: 'Games',
      hasDetailPage: true
    },
    {
      id: 3,
      title: 'Professional Networking Event',
      date: 'March 29, 2026',
      time: '6:00 PM - 9:00 PM',
      location: 'Business Hub Warsaw',
      description: 'Connect with Azerbaijani professionals in Poland. Career development and mentorship opportunities.',
      category: 'Networking'
    },
    {
      id: 4,
      title: 'Spring Picnic',
      date: 'April 5, 2026',
      time: '12:00 PM - 5:00 PM',
      location: 'Łazienki Park',
      description: 'Outdoor gathering with games, food, and socializing. Bring your friends and enjoy the spring weather!',
      category: 'Social'
    },
    {
      id: 5,
      title: 'Intellectual Quiz Competition',
      date: 'April 12, 2026',
      time: '7:00 PM - 10:00 PM',
      location: 'University Hall',
      description: 'Test your knowledge in various categories. Form teams and compete for exciting prizes!',
      category: 'Intellectual'
    },
    {
      id: 6,
      title: 'Table Tennis Championship',
      date: 'April 19, 2026',
      time: '4:00 PM - 8:00 PM',
      location: 'Sports Arena',
      description: 'Singles and doubles table tennis tournament. All skill levels welcome!',
      category: 'Sports'
    }
  ]

  const pastEvents = [
    {
      id: 'job-networking-meetup-feb-2026',
      title: 'Job Networking & Support Meetup',
      date: 'February 15, 2026',
      attendees: 28,
      description: '🚀 Real support between job seekers and employed professionals. CV/LinkedIn improvement, networking, and building strong relationships.',
      hasDetailPage: true
    },
    {
      id: 2,
      title: 'Career Development Workshop',
      date: 'February 25, 2026',
      attendees: 60,
      description: 'Professional networking and career guidance session with industry experts.'
    },
    {
      id: 3,
      title: 'Board Games Marathon',
      date: 'February 10, 2026',
      attendees: 35,
      description: 'All-day board games event featuring Mafia, Monopoly, and various strategy games.'
    },
    {
      id: 4,
      title: 'Winter Football Tournament',
      date: 'January 20, 2026',
      attendees: 45,
      description: 'Intense football matches despite the cold weather. Great team spirit and competition!'
    },
    {
      id: 'outdoor-volleyball-sept-2025',
      title: 'Outdoor Volleyball - Last Summer Games',
      date: 'September 12, 2025',
      attendees: 32,
      description: '🏐 Final outdoor volleyball session before winter! Summer is almost over - once the weather gets colder, games will move indoors (paid). Great turnout for the last outdoor match!',
      hasDetailPage: true
    },
    {
      id: 'summer-picnic-aug-2025',
      title: 'Summer Picnic & Games Festival',
      date: 'August 16, 2025',
      attendees: 65,
      description: '🌿 Epic outdoor picnic with volleyball, mafia, intellectual games, board games, music, pizza, and samovar tea! Full and basic packages available. Unforgettable day of fun and community bonding.',
      hasDetailPage: true
    },
    {
      id: 5,
      title: 'New Year Celebration 2026',
      date: 'December 31, 2025',
      attendees: 120,
      description: 'Celebrated the new year with games, music, and networking. Memorable night for the community!'
    }
  ]

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="container">
          <h1>Events</h1>
          <p>Join 50+ amazing events and counting! Sports, games, networking, and more.</p>
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
                {event.hasDetailPage ? (
                  <button 
                    className="btn" 
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </button>
                ) : (
                  <button className="btn">Register Now</button>
                )}
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
              <div 
                key={event.id} 
                className={`past-event-card ${event.hasDetailPage ? 'clickable' : ''}`}
                onClick={() => event.hasDetailPage && navigate(`/events/${event.id}`)}
                style={{ cursor: event.hasDetailPage ? 'pointer' : 'default' }}
              >
                <div className="past-event-info">
                  <h3>{event.title}</h3>
                  <p className="past-event-date">{event.date}</p>
                  <p className="past-event-description">{event.description}</p>
                  {event.hasDetailPage && (
                    <span className="view-details-link">View Details →</span>
                  )}
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
            <h2>Join Our Community!</h2>
            <p>
              Be part of the Azerbaijani youth community in Poland. Don't miss out on 
              sports, games, networking, and social events. Contact us to get involved!
            </p>
            <a href="/contact" className="btn">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Events
