import axiosInstance from './axiosInstance'
import { getSession } from './authService'

const pending = new Map()

const isDuplicateRegistration = (error) => {
  if (![400, 409, 422].includes(error.response?.status)) return false
  const data = error.response?.data
  const message = [data?.message, data?.error].flat().filter((value) => typeof value === 'string').join(' ')
  return data?.code === 'ALREADY_REGISTERED' || /already\s+(?:been\s+)?registered/i.test(message)
}

const updateRegistration = (slug, unregister) => {
  const session = getSession('MEMBER')
  if (!session) return Promise.reject(new Error('Please log in to update your registration.'))
  if (!slug) return Promise.reject(new Error('This event is missing its registration link.'))
  const requestKey = `${session.accessToken}:${slug}`
  if (pending.has(requestKey)) return pending.get(requestKey)
  const request = (async () => {
    try {
      const url = `/events/${encodeURIComponent(slug)}/register`
      const config = { _expectedAccessToken: session.accessToken }
      if (unregister) await axiosInstance.delete(url, config)
      else await axiosInstance.post(url, undefined, config)
    } catch (error) {
      if (!unregister && isDuplicateRegistration(error)) return
      throw error
    }
  })().finally(() => pending.delete(requestKey))
  pending.set(requestKey, request)
  return request
}

export const registerForEvent = (slug) => updateRegistration(slug, false)
export const unregisterFromEvent = (slug) => updateRegistration(slug, true)
