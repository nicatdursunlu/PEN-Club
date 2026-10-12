import axiosInstance from './axiosInstance'
import { isAdmin, getSession } from './authService'

export const fetchEventFeedback = async (slug) => {
  const { data } = await axiosInstance.get(`/events/${encodeURIComponent(slug)}/feedback`)
  if (!Array.isArray(data)) throw new Error('The feedback response is not a list.')
  return data
}

export const submitEventFeedback = async (slug, { rating, comment = '' }) => {
  const session = getSession('MEMBER')
  if (!session) throw new Error('Please log in to leave feedback.')
  if (!slug) throw new Error('This event is missing its feedback link.')
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Choose a rating from 1 to 5.')
  if (typeof comment !== 'string' || comment.length > 2000) throw new Error('Comment must be at most 2000 characters.')
  const response = await axiosInstance.post(`/events/${encodeURIComponent(slug)}/feedback`, { rating, comment }, { _expectedAccessToken: session.accessToken })
  return response.data
}

export const fetchAllEvents = async ({ page = 0, size = 10, category, status } = {}) => {
  if (!isAdmin()) throw new Error('Admin login is required to view all events.')
  const response = await axiosInstance.get('/events/admin/all', {
    params: { page, size, ...(category && { category }), ...(status && { status }) },
  })
  if (!Array.isArray(response.data?.content) || !Number.isInteger(response.data.totalElements) || !Number.isInteger(response.data.totalPages)) {
    throw new Error('The events response is not a paginated list.')
  }
  return response.data
}

export const cloneEvent = async (slug) => {
  if (!isAdmin()) throw new Error('Admin login is required to clone an event.')
  const response = await axiosInstance.post(`/events/${encodeURIComponent(slug)}/clone`)
  return response.data
}

export const publishEvent = async (slug) => {
  if (!isAdmin()) throw new Error('Admin login is required to publish an event.')
  const response = await axiosInstance.patch(`/events/${encodeURIComponent(slug)}/publish`)
  return response.data
}

export const cancelEvent = async (slug) => {
  if (!isAdmin()) throw new Error('Admin login is required to cancel an event.')
  const response = await axiosInstance.patch(`/events/${encodeURIComponent(slug)}/cancel`)
  return response.data
}

export const fetchEventParticipants = async (slug) => {
  if (!isAdmin()) throw new Error('Admin login is required to view participants.')
  const response = await axiosInstance.get(`/events/${encodeURIComponent(slug)}/participants`)
  if (!Array.isArray(response.data)) throw new Error('The participants response is not a list.')
  return response.data
}

/**
 * Fetches the admin dashboard summary from the API.
 * @returns {Promise<Object>} Dashboard data
 */
export const fetchDashboard = async () => {
  const response = await axiosInstance.get('/dashboard')
  return response.data
}

/**
 * Fetches the list of upcoming events from the API.
 * @returns {Promise<Array>} Array of upcoming event objects
 */
export const fetchUpcomingEvents = async () => {
  const response = await axiosInstance.get('/events/upcoming')
  return response.data
}

/**
 * Creates a new event via the API.
 * Requires a valid JWT access token (attached automatically by axiosInstance interceptor).
 * @param {Object} eventData - The event data to create
 * @returns {Promise<Object>} Created event object
 */
export const createEvent = async (eventData) => {
  const response = await axiosInstance.post('/events', eventData)
  return response.data
}

/**
 * Fetches the list of past events from the API.
 * @returns {Promise<Array>} Array of past event objects
 */
export const fetchPastEvents = async () => {
  const response = await axiosInstance.get('/events/past')
  return response.data
}

/**
 * Fetches a single event by its slug/id from the API.
 * @param {string} slug - The event slug/id
 * @returns {Promise<Object>} Event object
 */
export const fetchEventBySlug = async (slug) => {
  const response = await axiosInstance.get(`/events/${slug}`)
  return response.data
}

/**
 * Updates an existing event by slug.
 * Requires a valid JWT access token (attached automatically by axiosInstance interceptor).
 * @param {string} slug - The event slug
 * @param {Object} eventData - The updated event data
 * @returns {Promise<Object>} Updated event object
 */
export const updateEvent = async (slug, eventData) => {
  const response = await axiosInstance.put(`/events/${slug}`, eventData)
  return response.data
}
