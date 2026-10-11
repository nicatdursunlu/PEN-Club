import axiosInstance from './axiosInstance'
import { isAdmin } from './authService'

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
