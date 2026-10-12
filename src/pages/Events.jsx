import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUpcomingEvents, fetchPastEvents } from '../services/eventsService'
import EventRegistrationButton from '../components/EventRegistrationButton'

const Events = () => {
  const navigate = useNavigate()

  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [upcomingLoading, setUpcomingLoading] = useState(true)
  const [upcomingError, setUpcomingError] = useState(null)

  const [pastEvents, setPastEvents] = useState([])
  const [pastLoading, setPastLoading] = useState(true)
  const [pastError, setPastError] = useState(null)

  const loadUpcomingEvents = async () => {
    setUpcomingLoading(true)
    setUpcomingError(null)
    try {
      const data = await fetchUpcomingEvents()
      setUpcomingEvents(data)
    } catch (err) {
      setUpcomingError(err.message || 'Failed to load upcoming events. Please try again.')
    } finally {
      setUpcomingLoading(false)
    }
  }

  const loadPastEvents = async () => {
    setPastLoading(true)
    setPastError(null)
    try {
      const data = await fetchPastEvents()
      setPastEvents(data)
    } catch (err) {
      setPastError(err.message || 'Failed to load past events. Please try again.')
    } finally {
      setPastLoading(false)
    }
  }

  useEffect(() => {
    loadUpcomingEvents()
    loadPastEvents()
  }, [])

  return (
    <div className="events-page">
      <section className="bg-gradient-to-r from-primary to-bg-dark py-20 text-white">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h1 className="text-5xl font-bold mb-4">Events</h1>
          <p className="text-xl text-gray-200">Join 50+ amazing events and counting! Sports, games, networking, and more.</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Upcoming Events</h2>

          {/* Loading State */}
          {upcomingLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-lg">Loading events...</p>
            </div>
          )}

          {/* Error State */}
          {!upcomingLoading && upcomingError && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="text-5xl">⚠️</div>
              <p className="text-gray-700 text-lg font-semibold">Oops! Something went wrong.</p>
              <p className="text-gray-500 text-sm">{upcomingError}</p>
              <button
                onClick={loadUpcomingEvents}
                className="mt-2 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!upcomingLoading && !upcomingError && upcomingEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="text-5xl">📭</div>
              <p className="text-gray-500 text-lg">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}

          {/* Events Grid */}
          {!upcomingLoading && !upcomingError && upcomingEvents.length > 0 && (
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
                      {event.time && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                    <button
                      className="w-full px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
                      onClick={() => navigate(`/events/${encodeURIComponent(event.slug || event.id)}`)}
                    >
                      View Details
                    </button>
                    <EventRegistrationButton event={event} slug={event.slug || event.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Past Events</h2>

          {/* Loading State */}
          {pastLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-lg">Loading past events...</p>
            </div>
          )}

          {/* Error State */}
          {!pastLoading && pastError && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="text-5xl">⚠️</div>
              <p className="text-gray-700 text-lg font-semibold">Oops! Something went wrong.</p>
              <p className="text-gray-500 text-sm">{pastError}</p>
              <button
                onClick={loadPastEvents}
                className="mt-2 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!pastLoading && !pastError && pastEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="text-5xl">📭</div>
              <p className="text-gray-500 text-lg">No past events to show.</p>
            </div>
          )}

          {/* Past Events List */}
          {!pastLoading && !pastError && pastEvents.length > 0 && (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${
                    event.id ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''
                  }`}
                  onClick={() => event.id && navigate(`/events/${event.id}`)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">{event.title}</h3>
                      <p className="text-secondary font-semibold mb-2">{event.date}</p>
                      <p className="text-gray-600 leading-relaxed">{event.description}</p>
                      {event.id && (
                        <span className="inline-block mt-3 text-secondary font-semibold hover:text-accent transition-colors">
                          View Details →
                        </span>
                      )}
                    </div>
                    {event.attendees && (
                      <div className="bg-gradient-to-br from-secondary to-accent text-white rounded-xl p-6 text-center min-w-[120px]">
                        <div className="text-4xl font-bold">{event.attendees}</div>
                        <div className="text-sm mt-1">Attendees</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
