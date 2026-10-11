import memberAxiosInstance from './memberAxiosInstance'
import { getMemberSession } from './memberAuthService'

export const EVENT_REGISTRATION_CHANGE = 'pen-event-registration-change'
const pending = new Map()
const confirmed = new Map()

const accountKey = (session) => {
  if (!session) return null
  // Prefer a stable token subject so profile email edits preserve registrations.
  try {
    const payload = session.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const subject = JSON.parse(atob(payload)).sub
    if (subject) return `pen_event_registrations:sub:${subject}`
  } catch { /* Opaque tokens fall back to the login email. */ }
  return `pen_event_registrations:email:${session.email?.toLowerCase()}`
}

const readRegistrations = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key))
    return Array.isArray(stored) ? stored.filter((slug) => typeof slug === 'string') : []
  } catch {
    return []
  }
}

export const isEventRegistered = (slug, session = getMemberSession()) => {
  const key = accountKey(session)
  if (!key) return false
  const cached = confirmed.get(`${key}:${slug}`)
  return cached ?? readRegistrations(key).includes(slug)
}

const markRegistered = (key, slug, registered = true) => {
  const cacheKey = `${key}:${slug}`
  try {
    const registrations = readRegistrations(key).filter((item) => item !== slug)
    if (registered) registrations.push(slug)
    localStorage.setItem(key, JSON.stringify([...new Set(registrations)]))
    confirmed.delete(cacheKey)
  } catch {
    // Keep the successful API result even when browser storage is unavailable.
    confirmed.set(cacheKey, registered)
  }
  window.dispatchEvent(new Event(EVENT_REGISTRATION_CHANGE))
}

const isDuplicateRegistration = (error) => {
  if (![400, 409, 422].includes(error.response?.status)) return false
  const data = error.response?.data
  const message = [data?.message, data?.error].flat().filter((value) => typeof value === 'string').join(' ')
  return data?.code === 'ALREADY_REGISTERED' || /already\s+(?:been\s+)?registered/i.test(message)
}

export const registerForEvent = (slug) => {
  const session = getMemberSession()
  if (!session) return Promise.reject(new Error('Please log in to register for this event.'))
  if (!slug) return Promise.reject(new Error('This event is missing its registration link.'))
  const key = accountKey(session)
  const requestKey = `${key}:${slug}`
  if (isEventRegistered(slug, session)) return Promise.resolve()
  if (pending.has(requestKey)) return pending.get(requestKey)

  const registration = (async () => {
    try {
      await memberAxiosInstance.post(
        `/events/${encodeURIComponent(slug)}/register`,
        undefined,
        { _expectedAccessToken: session.accessToken },
      )
      markRegistered(key, slug)
    } catch (error) {
      if (isDuplicateRegistration(error)) {
        markRegistered(key, slug)
        return
      }
      throw error
    }
  })().finally(() => pending.delete(requestKey))
  pending.set(requestKey, registration)
  return registration
}

export const unregisterFromEvent = (slug) => {
  const session = getMemberSession()
  if (!session) return Promise.reject(new Error('Please log in to unregister from this event.'))
  if (!slug) return Promise.reject(new Error('This event is missing its registration link.'))
  const key = accountKey(session)
  const requestKey = `unregister:${key}:${slug}`
  if (pending.has(requestKey)) return pending.get(requestKey)
  if (!isEventRegistered(slug, session)) return Promise.resolve()

  const cancellation = (async () => {
    try {
      await memberAxiosInstance.delete(
        `/events/${encodeURIComponent(slug)}/register`,
        { _expectedAccessToken: session.accessToken },
      )
      markRegistered(key, slug, false)
    } catch (error) {
      throw error
    }
  })().finally(() => pending.delete(requestKey))
  pending.set(requestKey, cancellation)
  return cancellation
}
