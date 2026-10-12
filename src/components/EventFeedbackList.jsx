import React, { useEffect, useState } from 'react'
import { fetchEventFeedback } from '../services/eventsService'
import { formatDate } from '../utils/dateUtils'
import EventFeedbackForm from './EventFeedbackForm'
import { getSession } from '../services/authService'
import { AUTH_CHANGE_EVENT } from '../services/authStorage'
import { canLeaveEventFeedback, isOwnFeedback } from '../utils/eventLifecycle'

export default function EventFeedbackList({ slug, event, refreshKey = 0, onLoaded }) {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [editing, setEditing] = useState(null)
  const [session, setSession] = useState(() => getSession('MEMBER'))

  useEffect(() => {
    const update = () => { setSession(getSession('MEMBER')); setEditing(null) }
    window.addEventListener(AUTH_CHANGE_EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])
  useEffect(() => { setEditing(null) }, [slug])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchEventFeedback(slug).then((data) => {
      if (active) {
        setFeedback(data)
        onLoaded?.(data)
      }
    }).catch((err) => {
      if (!active) return
      const message = err.response?.data?.message || err.response?.data?.error || err.message
      setError(Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Unable to load feedback.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug, refreshKey, retry, onLoaded])

  return (
    <section aria-labelledby="feedback-list-heading" className="bg-white rounded-xl shadow-lg p-6">
      <h2 id="feedback-list-heading" className="text-2xl font-bold mb-4">Participant feedback</h2>
      {loading ? <p role="status" className="text-gray-500">Loading feedback…</p> : error ? (
        <div>
          <p role="alert" className="text-red-700">{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 text-secondary font-semibold rounded-lg focus-visible:ring-2 focus-visible:ring-secondary">Retry feedback</button>
        </div>
      ) : feedback.length === 0 ? <p className="text-gray-500">No feedback yet.</p> : (
        <ul className="space-y-4">
          {feedback.map((entry, index) => (
            <li key={entry.userId ? `${entry.eventId || slug}:${entry.userId}` : entry.id || index} className="relative border border-gray-200 rounded-lg p-4">
              {editing === index && isOwnFeedback(entry, session) ? (
                <EventFeedbackForm inline event={event} slug={slug} feedback={[entry]} onCancel={() => setEditing(null)}
                  onSubmitted={() => { setEditing(null); setRetry((value) => value + 1) }} />
              ) : (
                <>
              {isOwnFeedback(entry, session) && canLeaveEventFeedback(event) && (
                <button type="button" aria-label="Edit your feedback" onClick={() => setEditing(index)}
                  className="absolute top-3 right-3 p-2 text-gray-500 hover:text-secondary rounded-lg focus-visible:ring-2 focus-visible:ring-secondary">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16 3 5 5-12 12H4v-5L16 3zM14 5l5 5" />
                  </svg>
                </button>
              )}
              <p className="font-semibold text-gray-800 mb-2 pr-10">{[entry.firstName, entry.lastName].filter(Boolean).join(' ') || 'Participant'}</p>
              <div className="flex gap-1 mb-2" aria-label={`Rating: ${entry.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <svg key={value} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${value <= entry.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              {entry.comment && <p className="text-gray-700 whitespace-pre-line break-words">{entry.comment}</p>}
              {entry.createdAt && <p className="mt-2 text-xs text-gray-500"><time dateTime={entry.createdAt}>{formatDate(entry.createdAt.split('T')[0])}{entry.createdAt.includes('T') ? ` ${entry.createdAt.split('T')[1].slice(0, 5)}` : ''}</time></p>}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
