import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../services/authService'
import { AUTH_CHANGE_EVENT } from '../services/authStorage'
import { registerForEvent, unregisterFromEvent } from '../services/eventRegistrationService'
import { fetchEventBySlug } from '../services/eventsService'
import { canRegisterForEvent } from '../utils/eventLifecycle'

export default function EventRegistrationButton({ slug, event, children, className = 'mt-3' }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => getSession('MEMBER'))
  const [registered, setRegistered] = useState(() => typeof event?.registered === 'boolean' ? event.registered : null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [retry, setRetry] = useState(0)
  const submitting = useRef(false)
  const requestVersion = useRef(0)

  useEffect(() => {
    const authChanged = () => { setSession(getSession('MEMBER')); setError(''); setSuccess('') }
    window.addEventListener(AUTH_CHANGE_EVENT, authChanged)
    window.addEventListener('storage', authChanged)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, authChanged)
      window.removeEventListener('storage', authChanged)
    }
  }, [])

  useEffect(() => {
    const version = ++requestVersion.current
    setRegistered(null)
    if (!session || !slug) return
    fetchEventBySlug(slug).then((data) => {
      if (version !== requestVersion.current) return
      if (typeof data.registered !== 'boolean') throw new Error('Unable to determine your registration status.')
      setRegistered(data.registered)
      setError('')
    }).catch((err) => {
      if (version === requestVersion.current) setError(err.message || 'Unable to load registration status.')
    })
    return () => { requestVersion.current++ }
  }, [slug, session?.email, session?.role, retry])

  const updateRegistration = async () => {
    if (submitting.current || registered === null || !canRegisterForEvent(event)) return
    const unregister = registered
    const version = ++requestVersion.current
    const from = { pathname: `/events/${encodeURIComponent(slug)}` }
    if (!getSession('MEMBER')) {
      setSession(null)
      return
    }
    submitting.current = true
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (unregister) await unregisterFromEvent(slug)
      else await registerForEvent(slug)
      const updatedEvent = await fetchEventBySlug(slug)
      if (version !== requestVersion.current) return
      if (typeof updatedEvent.registered !== 'boolean') throw new Error('Registration updated, but its status could not be loaded. Refresh this page.')
      setRegistered(updatedEvent.registered)
      if (unregister && getSession('MEMBER')) setSuccess('You’ve unregistered from this event.')
    } catch (err) {
      if (version !== requestVersion.current) return
      if (err.response?.status === 401) {
        navigate('/login', { state: { from } })
      } else {
        const message = err.response?.data?.message || err.response?.data?.error || err.message
        setError(Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Unable to update registration. Please try again.')
      }
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  if (!session || !canRegisterForEvent(event)) return null

  return (
    <div className={className}>
      {children}
      <button type="button" onClick={updateRegistration} disabled={loading || !slug || registered === null} aria-busy={loading}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 ${registered ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-secondary text-white hover:bg-orange-600'}`}>
        {registered === null ? 'Loading registration…' : loading ? (registered ? 'Unregistering…' : 'Registering…') : registered ? 'Unregister' : 'Register for event'}
      </button>
      {registered && <p role="status" className="text-sm text-green-800 mt-2 mb-0">You’re registered for this event.</p>}
      {!registered && success && <p role="status" className="text-sm text-green-800 mt-2 mb-0">{success}</p>}
      {registered === null && error && <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-2 text-secondary font-semibold">Retry registration status</button>}
      {error && <p role="alert" className="text-sm text-red-700 mt-2 mb-0">{error}</p>}
    </div>
  )
}
