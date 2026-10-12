import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchEventBySlug } from '../services/eventsService'
import EventRegistrationButton from '../components/EventRegistrationButton'
import EventFeedbackForm from '../components/EventFeedbackForm'
import EventFeedbackList from '../components/EventFeedbackList'
import { canRegisterForEvent } from '../utils/eventLifecycle'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [feedbackRefresh, setFeedbackRefresh] = useState(0)
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchEventBySlug(id)
        setEvent(['PUBLISHED', 'COMPLETED'].includes(data.status?.toUpperCase()) ? data : null)
      } catch (err) {
        setError(err.message || 'Failed to load event details.')
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-lg">Loading event details...</p>
      </div>
    )
  }

  // Error / Not found state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              {error || "Sorry, we couldn't find the event you're looking for."}
            </p>
            <button
              onClick={() => navigate('/events')}
              className="px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="event-detail-page bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-bg-dark py-16 text-white">
        <div className="max-w-7xl mx-auto px-5">
          <button
            onClick={() => navigate('/events')}
            className="mb-6 flex items-center gap-2 text-white hover:text-secondary transition-colors font-semibold"
          >
            ← Back to Events
          </button>
          <div className="flex flex-wrap gap-3 mb-4">
            {event.status && (
              <span className={`px-4 py-2 rounded-full font-semibold ${
                event.status.toUpperCase() === 'COMPLETED'
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {event.status.toUpperCase() === 'COMPLETED' ? '✓ Completed' : 'Published'}
              </span>
            )}
            {event.category && (
              <span className="px-4 py-2 bg-secondary text-white rounded-full font-semibold">
                {event.category}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-lg">
            {event.date && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <span>{event.date}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🕐</span>
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <span>{event.location}</span>
              </div>
            )}
            {event.attendees && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span>{event.attendees} Attendees</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Event Photos */}
              {event.images && event.images.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Photos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-64 object-cover"
                        />
                        {image.caption && (
                          <p className="p-3 text-sm text-gray-600 bg-gray-50">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* About This Event */}
              {(event.fullDescription || event.description) && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Event</h2>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.fullDescription || event.description}
                  </p>
                </div>
              )}

              {/* Event Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Agenda</h2>
                  <div className="space-y-6">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 w-32 text-secondary font-bold">{item.time}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Highlights */}
              {event.eventHighlights && event.eventHighlights.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Highlights</h2>
                  <ul className="space-y-3">
                    {event.eventHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-2xl flex-shrink-0">🎯</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What Participants Gained */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">What Participants Gained</h2>
                  <ul className="space-y-3">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-secondary text-xl flex-shrink-0">✔</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Our Goal */}
              {event.goal && (
                <div className="bg-gradient-to-br from-secondary to-accent text-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold mb-4">Our Goal</h2>
                  <p className="text-lg leading-relaxed">{event.goal}</p>
                </div>
              )}

              {/* Pricing */}
              {event.pricing && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Pricing Options</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-secondary rounded-xl p-6 hover:shadow-xl transition-shadow">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">💎 Full Package</h3>
                      <p className="text-3xl font-bold text-secondary mb-2">{event.pricing.full}</p>
                      <p className="text-gray-600">Includes pizza and all activities</p>
                    </div>
                    <div className="border-2 border-gray-300 rounded-xl p-6 hover:shadow-xl transition-shadow">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">⭐ Basic Package</h3>
                      <p className="text-3xl font-bold text-secondary mb-2">{event.pricing.basic}</p>
                      <p className="text-gray-600">Bring your own food, enjoy all activities</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Map */}
              {event.mapEmbedUrl && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Location</h2>
                  <div className="space-y-4">
                    <iframe
                      src={event.mapEmbedUrl}
                      width="100%"
                      height="450"
                      style={{ border: 0, borderRadius: '10px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Event Location Map"
                      className="rounded-lg"
                    ></iframe>
                    {event.locationLink && (
                      <a
                        href={event.locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-white border-2 border-secondary text-secondary rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all"
                      >
                        📍 Open in Google Maps
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h3>
                <div className="space-y-4">
                  {event.date && (
                    <div className="flex flex-col gap-1">
                      <strong className="text-gray-700 font-semibold">Date:</strong>
                      <span className="text-gray-600">{event.date}</span>
                    </div>
                  )}
                  {event.time && (
                    <div className="flex flex-col gap-1">
                      <strong className="text-gray-700 font-semibold">Time:</strong>
                      <span className="text-gray-600">{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex flex-col gap-1">
                      <strong className="text-gray-700 font-semibold">Location:</strong>
                      <span className="text-gray-600">{event.location}</span>
                    </div>
                  )}
                  {event.locationLink && (
                    <div className="pt-2">
                      <a
                        href={event.locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent font-semibold transition-colors"
                      >
                        📍 View on Map
                      </a>
                    </div>
                  )}
                  {event.category && (
                    <div className="flex flex-col gap-1">
                      <strong className="text-gray-700 font-semibold">Category:</strong>
                      <span className="text-gray-600">{event.category}</span>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex flex-col gap-1">
                      <strong className="text-gray-700 font-semibold">Organizer:</strong>
                      <span className="text-gray-600">{event.organizer}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Note */}
              {event.specialNote && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl shadow-lg p-6">
                  <div className="text-gray-800 leading-relaxed">
                    {event.specialNote}
                  </div>
                </div>
              )}

              {/* Register CTA for upcoming events */}
              {canRegisterForEvent(event) && (
                <EventRegistrationButton key={id} event={event} slug={event.slug || id} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-3">Join this event</h3>
                  <p className="text-gray-600 mb-4">Register with your PEN Club member account.</p>
                </EventRegistrationButton>
              )}

              {/* Share */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Event</h3>
                <div className="flex flex-col gap-3">
                  <button
                    className="flex items-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors font-semibold"
                    aria-label="Share on Facebook"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button
                    className="flex items-center gap-3 px-4 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5C] transition-colors font-semibold"
                    aria-label="Share on WhatsApp"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    aria-label="Share on Instagram"
                    onClick={() => window.open('https://www.instagram.com/', '_blank')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">More Events</h2>
          <p className="text-lg text-gray-600 mb-8">Check out other events from PEN Club</p>
          <button
            onClick={() => navigate('/events')}
            className="px-8 py-3 bg-white border-2 border-secondary text-secondary rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all"
          >
            View All Events
          </button>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-5 pb-16 space-y-6">
        <EventFeedbackList event={event} slug={event.slug || id} refreshKey={feedbackRefresh} onLoaded={setFeedback} />
        <EventFeedbackForm hideIfExisting key={`feedback-${id}`} event={event} slug={event.slug || id} feedback={feedback} onSubmitted={() => setFeedbackRefresh((value) => value + 1)} />
      </div>
    </div>
  )
}

export default EventDetail
