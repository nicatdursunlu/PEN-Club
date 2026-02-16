import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/EventDetail.css'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Event data - in a real app, this would come from an API or database
  const eventsData = {
    'job-networking-meetup-feb-2026': {
      title: 'Job Networking & Support Meetup',
      date: 'February 15, 2026',
      time: '12:00 PM - 2:00 PM',
      location: 'Warsaw, Poland',
      category: 'Networking',
      status: 'completed',
      attendees: 28,
      description: '🚀 PEN Club is starting a new phase…',
      fullDescription: `On Sunday, February 15th, 2026, PEN Club hosted a transformative networking meetup that brought together 28 members of the Azerbaijani community in Poland. This event marked a new phase in our club's mission - focusing on real, tangible support between those actively seeking employment opportunities in Poland and those who are currently established in their careers.

The atmosphere was warm and collaborative as participants gathered to share experiences, exchange insights, and build meaningful professional relationships. The event created a safe space where job seekers could openly discuss their challenges while employed professionals offered guidance, mentorship, and practical advice based on their own journeys in the Polish job market.

Throughout the two-hour session, attendees engaged in deep conversations about navigating the Polish employment landscape, understanding cultural nuances in the workplace, and leveraging professional networks effectively. The energy in the room was palpable as connections were made, LinkedIn profiles were reviewed on the spot, and CVs were critiqued with constructive feedback.`,
      agenda: [
        {
          time: '12:00 PM - 12:15 PM',
          title: 'Welcome & Introduction',
          description: 'Opening remarks by PEN Club organizers, introduction to the event format, and ice-breaking session where each participant shared their current professional status and what they hoped to gain from the meetup.'
        },
        {
          time: '12:15 PM - 12:45 PM',
          title: 'Panel Discussion: Job Market Insights',
          description: 'Employed professionals shared their experiences about finding jobs in Poland, discussing topics like application strategies, interview preparation, and workplace culture. Q&A session allowed job seekers to ask specific questions about different industries and career paths.'
        },
        {
          time: '12:45 PM - 1:15 PM',
          title: 'CV & LinkedIn Review Sessions',
          description: 'Small group breakout sessions where participants paired up for one-on-one CV reviews and LinkedIn profile optimization. Experienced professionals provided personalized feedback on resumes, cover letters, and online professional presence.'
        },
        {
          time: '1:15 PM - 1:45 PM',
          title: 'Networking & Relationship Building',
          description: 'Open networking time with refreshments. Participants exchanged contact information, discussed potential job opportunities, and formed mentorship connections. Several attendees discovered mutual professional interests and planned follow-up meetings.'
        },
        {
          time: '1:45 PM - 2:00 PM',
          title: 'Closing & Next Steps',
          description: 'Wrap-up session where participants shared key takeaways, success stories from the day, and commitments to support each other going forward. Announcement of future PEN Club networking events and initiatives.'
        }
      ],
      eventHighlights: [
        'Over 15 CV reviews conducted with personalized feedback',
        'Multiple LinkedIn connections made between job seekers and employers',
        '3 potential job leads identified during networking sessions',
        'Formation of 5 ongoing mentorship pairs',
        'Shared resources including job boards, recruitment agencies, and professional groups',
        'Commitment from attendees to continue supporting each other beyond the event'
      ],
      highlights: [
        'Real-life experiences about finding a job in Poland',
        'Communication and networking opportunities',
        'Exchange of ideas regarding CV / LinkedIn improvement',
        'New connections and strong relationships',
        'Opportunity to expand your network and support others'
      ],
      goal: "PEN Club's goal is simple: To move forward together, not alone.",
      images: [
        {
          url: '/images/events/job-networking-feb-2026.jpeg',
          alt: 'Job Networking & Support Meetup - Group photo of attendees',
          caption: 'Our amazing community coming together for networking and support'
        }
      ],
      organizer: 'PEN Club Team'
    },
    'football-tournament-march-2026': {
      title: 'Football Tournament',
      date: 'March 15, 2026',
      time: '3:00 PM - 6:00 PM',
      location: 'City Sports Complex',
      category: 'Sports',
      status: 'upcoming',
      description: 'Join us for an exciting football tournament! Form teams and compete for the championship trophy.',
      fullDescription: 'Get ready for an action-packed afternoon of football! This tournament brings together the Azerbaijani community in Poland for friendly competition and team building.',
      highlights: [
        'Team-based competition format',
        'Championship trophy for winners',
        'Refreshments provided',
        'All skill levels welcome',
        'Great opportunity to meet new people'
      ],
      goal: 'Building community through sports and healthy competition.',
      images: [],
      organizer: 'PEN Club Sports Committee'
    },
    'mafia-night-march-2026': {
      title: 'Mafia Night',
      date: 'March 22, 2026',
      time: '7:00 PM - 11:00 PM',
      location: 'Community Center',
      category: 'Games',
      status: 'upcoming',
      description: 'Strategic Mafia game night with multiple rounds. Test your detective skills and social deduction!',
      fullDescription: 'Join us for an evening of mystery, strategy, and fun! Our Mafia night features multiple rounds of the classic social deduction game.',
      highlights: [
        'Multiple game rounds',
        'Experienced moderators',
        'Snacks and drinks provided',
        'Prizes for best players',
        'Perfect for making new friends'
      ],
      goal: 'Entertainment and social bonding through strategic gameplay.',
      images: [],
      organizer: 'PEN Club Games Team'
    }
  }

  const event = eventsData[id]

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="event-not-found">
            <h1>Event Not Found</h1>
            <p>Sorry, we couldn't find the event you're looking for.</p>
            <button onClick={() => navigate('/events')} className="btn">
              Back to Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="event-detail-page">
      <section className="event-detail-hero">
        <div className="container">
          <button onClick={() => navigate('/events')} className="back-button">
            ← Back to Events
          </button>
          <div className="event-header">
            <span className={`event-status ${event.status}`}>
              {event.status === 'completed' ? '✓ Completed' : '📅 Upcoming'}
            </span>
            <span className="event-category-badge">{event.category}</span>
          </div>
          <h1>{event.title}</h1>
          <div className="event-meta">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{event.date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🕐</span>
              <span>{event.time}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <span>{event.location}</span>
            </div>
            {event.attendees && (
              <div className="meta-item">
                <span className="meta-icon">👥</span>
                <span>{event.attendees} Attendees</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section event-content">
        <div className="container">
          <div className="event-detail-grid">
            <div className="event-main-content">
              {event.images && event.images.length > 0 && (
                <div className="content-section event-gallery">
                  <h2>Event Photos</h2>
                  <div className="gallery-grid">
                    {event.images.map((image, index) => (
                      <div key={index} className="gallery-item">
                        <img 
                          src={image.url} 
                          alt={image.alt}
                          className="gallery-image"
                        />
                        {image.caption && (
                          <p className="image-caption">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="content-section">
                <h2>About This Event</h2>
                <p className="event-description">{event.fullDescription}</p>
              </div>

              {event.agenda && event.agenda.length > 0 && (
                <div className="content-section">
                  <h2>Event Agenda</h2>
                  <div className="agenda-timeline">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="agenda-item">
                        <div className="agenda-time">{item.time}</div>
                        <div className="agenda-content">
                          <h3 className="agenda-title">{item.title}</h3>
                          <p className="agenda-description">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.eventHighlights && event.eventHighlights.length > 0 && (
                <div className="content-section">
                  <h2>Event Highlights</h2>
                  <ul className="highlights-list">
                    {event.eventHighlights.map((highlight, index) => (
                      <li key={index}>
                        <span className="highlight-icon">🎯</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.highlights && event.highlights.length > 0 && (
                <div className="content-section">
                  <h2>What Participants Gained</h2>
                  <ul className="highlights-list">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>
                        <span className="highlight-icon">✔</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.goal && (
                <div className="content-section goal-section">
                  <h2>Our Goal</h2>
                  <p className="goal-text">{event.goal}</p>
                </div>
              )}
            </div>

            <div className="event-sidebar">
              <div className="sidebar-card">
                <h3>Event Details</h3>
                <div className="detail-item">
                  <strong>Date:</strong>
                  <span>{event.date}</span>
                </div>
                <div className="detail-item">
                  <strong>Time:</strong>
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  <strong>Location:</strong>
                  <span>{event.location}</span>
                </div>
                <div className="detail-item">
                  <strong>Category:</strong>
                  <span>{event.category}</span>
                </div>
                {event.organizer && (
                  <div className="detail-item">
                    <strong>Organizer:</strong>
                    <span>{event.organizer}</span>
                  </div>
                )}
              </div>

              {event.status === 'upcoming' && (
                <div className="sidebar-card register-card">
                  <h3>Interested?</h3>
                  <p>Contact us to register for this event</p>
                  <button 
                    onClick={() => navigate('/contact')} 
                    className="btn btn-register"
                  >
                    Contact Us
                  </button>
                </div>
              )}

              <div className="sidebar-card share-card">
                <h3>Share Event</h3>
                <div className="share-buttons">
                  <button className="share-btn" aria-label="Share on Facebook">
                    📘 Facebook
                  </button>
                  <button className="share-btn" aria-label="Share on WhatsApp">
                    💬 WhatsApp
                  </button>
                  <button className="share-btn" aria-label="Share on Instagram">
                    📷 Instagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section related-events">
        <div className="container">
          <h2>More Events</h2>
          <p>Check out other events from PEN Club</p>
          <button onClick={() => navigate('/events')} className="btn btn-outline">
            View All Events
          </button>
        </div>
      </section>
    </div>
  )
}

export default EventDetail
