import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../services/authService'
import { AUTH_CHANGE_EVENT } from '../services/authStorage'
import { EVENT_REGISTRATION_CHANGE, isEventRegistered, registerForEvent, unregisterFromEvent } from '../services/eventRegistrationService'
import { canRegisterForEvent } from '../utils/eventLifecycle'

export default function EventRegistrationButton({ slug, event, children, className = 'mt-3' }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => getSession('MEMBER'))
  const [registered, setRegistered] = useState(() => isEventRegistered(slug))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const submitting = useRef(false)

  useEffect(() => {
    const update = () => setRegistered(isEventRegistered(slug))
    const authChanged = () => { setSession(getSession('MEMBER')); update(); setError(''); setSuccess('') }
    update()
    window.addEventListener(EVENT_REGISTRATION_CHANGE, update)
    window.addEventListener(AUTH_CHANGE_EVENT, authChanged)
    window.addEventListener('storage', authChanged)
    return () => {
      window.removeEventListener(EVENT_REGISTRATION_CHANGE, update)
      window.removeEventListener(AUTH_CHANGE_EVENT, authChanged)
      window.removeEventListener('storage', authChanged)
    }
  }, [slug])

  const updateRegistration = async () => {
    if (submitting.current || !canRegisterForEvent(event)) return
    const unregister = isEventRegistered(slug)
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
      setRegistered(isEventRegistered(slug))
      if (unregister && getSession('MEMBER')) setSuccess('You’ve unregistered from this event.')
    } catch (err) {
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
      <button type="button" onClick={updateRegistration} disabled={loading || !slug} aria-busy={loading}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 ${registered ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-secondary text-white hover:bg-orange-600'}`}>
        {loading ? (registered ? 'Unregistering…' : 'Registering…') : registered ? 'Unregister' : 'Register for event'}
      </button>
      {registered && <p role="status" className="text-sm text-green-800 mt-2 mb-0">You’re registered for this event.</p>}
      {!registered && success && <p role="status" className="text-sm text-green-800 mt-2 mb-0">{success}</p>}
      {error && <p role="alert" className="text-sm text-red-700 mt-2 mb-0">{error}</p>}
    </div>
  )
}
