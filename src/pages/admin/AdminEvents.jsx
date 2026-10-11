import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchUpcomingEvents, fetchPastEvents } from '../../services/eventsService'
import { logout } from '../../services/authService'
import { formatDate } from '../../utils/dateUtils'

const AdminEvents = () => {
  const navigate = useNavigate()

  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const [upcoming, past] = await Promise.all([
        fetchUpcomingEvents(),
        fetchPastEvents(),
      ])
      setUpcomingEvents(upcoming)
      setPastEvents(past)
    } catch (err) {
      setError(err.message || 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const allEvents = [
    ...upcomingEvents.map((e) => ({ ...e, _type: 'upcoming' })),
    ...pastEvents.map((e) => ({ ...e, _type: 'past' })),
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">PEN Club Admin</h1>
              <p className="text-gray-400 text-xs">Event Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/users" className="px-4 py-2 text-white rounded-lg text-sm font-semibold hover:text-secondary">Users</Link>
            <button
              onClick={() => navigate('/admin/events/new')}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Event
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg text-sm font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
            <p className="text-gray-500 text-sm mt-1">Click on an event to edit it.</p>
          </div>
          <button
            onClick={loadEvents}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:border-gray-400 hover:text-gray-800 transition-all bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">⚠️</div>
            <p className="text-gray-700 font-semibold">Failed to load events</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={loadEvents}
              className="px-6 py-2.5 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && allEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">📭</div>
            <p className="text-gray-500">No events found.</p>
            <button
              onClick={() => navigate('/admin/events/new')}
              className="px-6 py-2.5 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Create First Event
            </button>
          </div>
        )}

        {/* Upcoming Events */}
        {!loading && !error && upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
              Upcoming ({upcomingEvents.length})
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <EventRow
                  key={event.id || event.slug}
                  event={event}
                  badge={{ label: 'Upcoming', color: 'bg-blue-100 text-blue-700' }}
                  onClick={() => navigate(`/admin/events/${event.slug || event.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {!loading && !error && pastEvents.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
              Past ({pastEvents.length})
            </h3>
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <EventRow
                  key={event.id || event.slug}
                  event={event}
                  badge={{ label: 'Past', color: 'bg-gray-100 text-gray-600' }}
                  onClick={() => navigate(`/admin/events/${event.slug || event.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Event Row Component ──────────────────────────────────────────────────────
const EventRow = ({ event, badge, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-secondary hover:border-opacity-30"
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
        {event.category && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
            {event.category}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-gray-800 truncate">{event.title}</h3>
      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
        {event.date && (
          <span className="flex items-center gap-1">
            <span>📅</span> {formatDate(event.date)}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1">
            <span>📍</span> {event.location}
          </span>
        )}
        {event.slug && (
          <span className="flex items-center gap-1 font-mono text-xs text-gray-400">
            /{event.slug}
          </span>
        )}
      </div>
    </div>
    <div className="flex-shrink-0 flex items-center gap-2 text-secondary">
      {(event.slug || event.id) && (
        <Link
          to={`/admin/events/${encodeURIComponent(event.slug || event.id)}/participants`}
          onClick={(click) => click.stopPropagation()}
          className="px-3 py-2 mr-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 focus-visible:ring-2 focus-visible:ring-secondary"
        >
          View participants
        </Link>
      )}
      <span className="text-sm font-semibold hidden sm:block">Edit</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
)

export default AdminEvents
