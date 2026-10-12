import React, { useEffect, useRef, useState } from 'react'
import { getSession } from '../services/authService'
import { AUTH_CHANGE_EVENT } from '../services/authStorage'
import { submitEventFeedback } from '../services/eventsService'
import { canLeaveEventFeedback, isOwnFeedback } from '../utils/eventLifecycle'

export default function EventFeedbackForm({ event, slug, onSubmitted, feedback = [], inline = false, onCancel, hideIfExisting = false }) {
  const [session, setSession] = useState(() => getSession('MEMBER'))
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState('')
  const submitting = useRef(false)
  const version = useRef(0)
  const existingFeedback = session && feedback.find((entry) => entry.eventSlug === slug && isOwnFeedback(entry, session))

  useEffect(() => {
    const update = () => setSession(getSession('MEMBER'))
    window.addEventListener(AUTH_CHANGE_EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  useEffect(() => {
    version.current++
    setRating(existingFeedback ? String(existingFeedback.rating) : '')
    setComment(existingFeedback?.comment || '')
    setError('')
    setSubmitted(!!existingFeedback)
    setSuccess('')
    return () => { version.current++ }
  }, [slug, session?.email, session?.role, existingFeedback?.rating, existingFeedback?.comment])

  const submit = async (e) => {
    e.preventDefault()
    if (submitting.current || !getSession('MEMBER') || !canLeaveEventFeedback(event)) return
    submitting.current = true
    const currentVersion = version.current
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await submitEventFeedback(slug, { rating: Number(rating), comment })
      if (currentVersion === version.current) {
        setSubmitted(true)
        setSuccess(submitted ? 'Your feedback has been updated.' : 'Thank you for your feedback!')
        onSubmitted?.()
      }
    } catch (err) {
      if (currentVersion !== version.current) return
      const message = err.response?.data?.message || err.response?.data?.error || err.message
      setError(Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Unable to submit feedback. Please try again.')
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  if (!session || !canLeaveEventFeedback(event) || (hideIfExisting && existingFeedback)) return null

  return (
    <section className={inline ? '' : 'bg-white rounded-xl shadow-lg p-6'} aria-labelledby="event-feedback-heading">
      <h3 id="event-feedback-heading" className="text-2xl font-bold mb-3">{inline ? 'Edit feedback' : 'Event feedback'}</h3>
      <p className="text-sm text-gray-600 mb-4">You can leave one feedback entry for this event. Saving again updates your feedback.</p>
      {success && <p role="status" className="text-green-800 mb-4">{success}</p>}
        <form onSubmit={submit} aria-busy={loading} className="space-y-4">
          <fieldset disabled={loading}>
            <legend className="text-sm font-semibold mb-2">Rating</legend>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className={`relative rounded-lg ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <input type="radio" name="feedback-rating" value={value} checked={Number(rating) === value}
                    onChange={() => setRating(String(value))} required
                    aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                    className="peer sr-only" />
                  <span className={`block p-2 rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-secondary ${value <= Number(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                </label>
              ))}
              {rating && <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>}
            </div>
          </fieldset>
          <div>
            <label htmlFor="feedback-comment" className="block text-sm font-semibold mb-2">Comment (optional)</label>
            <textarea id="feedback-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={4}
              disabled={loading} aria-describedby="feedback-comment-count" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary" />
            <p id="feedback-comment-count" className="text-xs text-gray-500">{comment.length} / 2000 characters</p>
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading || !rating || !slug}
            className="w-full px-4 py-3 bg-secondary text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary">
            {loading ? 'Submitting…' : submitted ? 'Update feedback' : 'Submit feedback'}
          </button>
          {onCancel && <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 text-gray-600 font-semibold rounded-lg focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50">Cancel edit</button>}
        </form>
    </section>
  )
}
