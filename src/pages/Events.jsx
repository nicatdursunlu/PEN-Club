import React from 'react'
import { useNavigate } from 'react-router-dom'

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
      <section className="bg-gradient-to-r from-primary to-bg-dark py-20 text-white">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h1 className="text-5xl font-bold mb-4">Events</h1>
          <p className="text-xl text-gray-200">Join 50+ amazing events and counting! Sports, games, networking, and more.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 text-sm font-semibold">
                  {event.category}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📅</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🕐</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                  {event.hasDetailPage ? (
                    <button 
                      className="w-full px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View Details
                    </button>
                  ) : (
                    <button className="w-full px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105">
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Past Events</h2>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <div 
                key={event.id} 
                className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${
                  event.hasDetailPage ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''
                }`}
                onClick={() => event.hasDetailPage && navigate(`/events/${event.id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{event.title}</h3>
                    <p className="text-secondary font-semibold mb-2">{event.date}</p>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    {event.hasDetailPage && (
                      <span className="inline-block mt-3 text-secondary font-semibold hover:text-accent transition-colors">
                        View Details →
                      </span>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-secondary to-accent text-white rounded-xl p-6 text-center min-w-[120px]">
                    <div className="text-4xl font-bold">{event.attendees}</div>
                    <div className="text-sm mt-1">Attendees</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-secondary to-accent">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Join Our Community!</h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Be part of the Azerbaijani youth community in Poland. Don't miss out on 
            sports, games, networking, and social events. Contact us to get involved!
          </p>
          <a href="/contact" className="inline-block px-10 py-4 bg-white text-secondary rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}

export default Events
