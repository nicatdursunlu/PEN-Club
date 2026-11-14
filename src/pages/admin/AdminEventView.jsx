import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import AdminNavbar from '../../components/admin/AdminNavbar'
import EventFeedbackList from '../../components/EventFeedbackList'
import { fetchEventBySlug, publishEvent, cancelEvent, cloneEvent } from '../../services/eventsService'
import { formatDate, formatDateTime } from '../../utils/dateUtils'

export default function AdminEventView() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [action, setAction] = useState(null)
  const [message, setMessage] = useState('')
  const [reload, setReload] = useState(0)
  const busy = useRef(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setEvent(null)
    fetchEventBySlug(slug).then((data) => { if (active) setEvent(data) })
      .catch((err) => { if (active) setError(err.response?.data?.message || err.message || 'Unable to load event.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug, reload])

  const status = event?.status?.toUpperCase()
  const handleClone = async () => {
    if (busy.current) return
    busy.current = true
    setAction('clone')
    setError('')
    setMessage('')
    try {
      const copy = await cloneEvent(slug)
      if (copy?.slug) navigate(`/admin/events/${encodeURIComponent(copy.slug)}`)
      else setMessage('Event cloned successfully. Find the copy in All Events.')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to clone event.')
    } finally {
      busy.current = false
      setAction(null)
    }
  }
  const changeStatus = async (nextAction) => {
    if (busy.current || (nextAction === 'publish' ? status !== 'DRAFT' : !['DRAFT', 'PUBLISHED'].includes(status))) return
    busy.current = true
    setAction(nextAction)
    setMessage('')
    setError('')
    try {
      const data = await (nextAction === 'publish' ? publishEvent(slug) : cancelEvent(slug))
      setEvent((previous) => ({ ...previous, status: data?.status || (nextAction === 'publish' ? 'PUBLISHED' : 'CANCELLED') }))
      setMessage(nextAction === 'publish' ? 'Event published successfully.' : 'Event cancelled successfully.')
    } catch (err) {
      const text = err.response?.data?.message || err.response?.data?.error || err.message
      setError(Array.isArray(text) ? text.join(' ') : typeof text === 'string' ? text : 'Unable to change event status.')
    } finally {
      busy.current = false
      setAction(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="max-w-6xl mx-auto px-5 py-8 space-y-6">
        <Link to="/admin/events" className="text-secondary font-semibold">← All Events</Link>
        {loading && <p role="status">Loading event details…</p>}
        {error && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}{!event && <button type="button" onClick={() => setReload((value) => value + 1)} className="ml-4 font-semibold underline">Retry</button>}</div>}
        {message && <p role="status" className="bg-green-50 text-green-800 rounded-xl p-4">{message}</p>}
        {!loading && event && <>
          <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div><p className="text-sm text-gray-500">{status} {event.category && `· ${event.category}`}</p><h1 className="text-3xl font-bold text-gray-800">{event.title}</h1></div>
              <div className="flex flex-wrap gap-3">
                {['PUBLISHED', 'COMPLETED'].includes(status) && (
                  <a href={`/events/${encodeURIComponent(event.slug || slug)}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View
                  </a>
                )}
                {status === 'COMPLETED' ? <button type="button" disabled className="px-4 py-2 bg-primary text-white rounded-lg font-semibold opacity-50 cursor-not-allowed">Update Event</button> : <Link to={`/admin/events/${encodeURIComponent(slug)}/edit`} aria-disabled={!!action} onClick={(e) => { if (action) e.preventDefault() }} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">Update Event</Link>}
                <button type="button" disabled={!!action || status !== 'DRAFT'} onClick={() => changeStatus('publish')} className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{action === 'publish' ? 'Publishing…' : 'Publish Event'}</button>
                <button type="button" disabled={!!action || !['DRAFT', 'PUBLISHED'].includes(status)} onClick={() => changeStatus('cancel')} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{action === 'cancel' ? 'Cancelling…' : 'Cancel Event'}</button>
                <button type="button" disabled={!!action} onClick={handleClone} className="px-4 py-2 border border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{action === 'clone' ? 'Cloning…' : 'Clone Event'}</button>
                <Link to={`/admin/events/${encodeURIComponent(slug)}/participants`} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">View participants</Link>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Status', status], ['Category', event.category], ['Slug', event.slug],
                ['Date', formatDate(event.date)], ['Time', event.time], ['Location', event.location],
                ['Organizer', event.organizer], ['Attendees', event.attendees], ['Full package price', event.pricing?.full], ['Basic package price', event.pricing?.basic],
                ['Created', formatDateTime(event.createdAt)], ['Last updated', formatDateTime(event.updatedAt)],
              ].filter(([, value]) => value !== undefined && value !== null && value !== '').map(([label, value]) => <div key={label}><dt className="text-sm text-gray-500">{label}</dt><dd className="font-semibold text-gray-800">{value}</dd></div>)}
            </dl>
          </section>
          {[['Short description', event.description], ['Full description', event.fullDescription]].map(([title, text]) => (
            <section key={title} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-3">{title}</h2>
              <p className="whitespace-pre-line break-words text-gray-700">{text || `No ${title.toLowerCase()} provided.`}</p>
            </section>
          ))}
          {event.mapEmbedUrl && (
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-3">Event location</h2>
              <iframe src={event.mapEmbedUrl} title="Event Location Map" width="100%" height="450"
                loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                className="border-0 rounded-lg" />
              {event.locationLink && <a href={event.locationLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-orange-600">View location</a>}
            </section>
          )}
          {!event.mapEmbedUrl && event.locationLink && <a href={event.locationLink} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-orange-600">View location</a>}
          {event.images?.length > 0 && <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">{event.images.map((image, index) => <figure key={index}><img src={image.url} alt={image.alt || event.title} className="w-full rounded-xl" />{image.caption && <figcaption className="mt-2 text-gray-600">{image.caption}</figcaption>}</figure>)}</section>}
          {event.agenda?.length > 0 && <section className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-bold mb-3">Agenda</h2><ul className="space-y-4">{event.agenda.map((item, index) => <li key={index}><p className="font-semibold">{item.time} {item.title}</p>{item.description && <p className="text-gray-600 whitespace-pre-line">{item.description}</p>}</li>)}</ul></section>}
          {[['Highlights', event.highlights], ['Event highlights', event.eventHighlights]].map(([title, items]) => items?.length > 0 && <section key={title} className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-bold mb-3">{title}</h2><ul className="list-disc pl-5 space-y-2">{items.map((item, index) => <li key={index}>{item}</li>)}</ul></section>)}
          {[['Goal', event.goal], ['Special note', event.specialNote]].map(([title, text]) => text && <section key={title} className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-xl font-bold mb-3">{title}</h2><p className="whitespace-pre-line">{text}</p></section>)}
          <EventFeedbackList event={event} slug={slug} />
        </>}
      </main>
    </div>
  )
}
