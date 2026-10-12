import axios from 'axios'
import { getSession, saveSession, clearSession } from './authStorage'

export { getSession } from './authStorage'
export const getAccessToken = () => getSession()?.accessToken || null
export const getRefreshToken = () => getSession()?.refreshToken || null
export const isAuthenticated = () => Boolean(getSession())
export const isAdmin = () => getSession()?.role === 'ADMIN'
export const clearTokens = clearSession

const normalizeRole = (value) => {
  const role = (typeof value === 'string' ? value : value?.authority || value?.name)?.toUpperCase().replace(/^ROLE_/, '')
  return role === 'ADMIN' ? 'ADMIN' : ['MEMBER', 'USER'].includes(role) ? 'MEMBER' : null
}
export const resolveRole = (data) => {
  let claims = {}
  try {
    const payload = data.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    claims = JSON.parse(atob(payload))
  } catch { /* Role can also be supplied directly in the response. */ }
  const candidates = [data.role, data.user?.role, data.profile?.role, data.roles, data.user?.roles, claims.role, claims.roles, claims.authorities].flat().map(normalizeRole)
  return candidates.includes('ADMIN') ? 'ADMIN' : 'MEMBER'
}

export const storeAuthResponse = (data, email, profile = {}) => {
  if (typeof data?.accessToken !== 'string' || !data.accessToken) return false
  saveSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    role: resolveRole(data),
    email,
    profile: { ...profile, ...(data.user || data.profile || {}), email },
  })
  return true
}
export const login = async (email, password) => {
  const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password })
  if (!storeAuthResponse(data, email)) throw new Error('Sign in did not return an access token.')
  return data
}
export const register = async ({ firstName, lastName, email, password }) => {
  const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, { firstName, lastName, email, password })
  return storeAuthResponse(data, email, { firstName, lastName })
}
export const refreshAccessToken = async () => {
  const session = getSession()
  if (!session?.refreshToken) {
    const error = new Error('No refresh token available. Please sign in again.')
    error.code = 'NO_REFRESH_TOKEN'
    throw error
  }
  const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, { refreshToken: session.refreshToken })
  if (typeof data?.accessToken !== 'string' || !data.accessToken) throw new Error('Token refresh did not return an access token.')
  const current = getSession()
  if (current?.accessToken !== session.accessToken) throw new Error('Your login changed.')
  saveSession({ ...current, accessToken: data.accessToken, refreshToken: data.refreshToken || session.refreshToken })
  return data.accessToken
}
export const logout = async () => {
  const session = getSession()
  clearSession()
  if (!session) return true
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, undefined, { headers: { Authorization: `Bearer ${session.accessToken}` } })
    return true
  } catch { return false }
}
export const updateSessionProfile = (profile, expectedToken) => {
  const session = getSession()
  if (!session || session.accessToken !== expectedToken) return
  saveSession({ ...session, email: profile.email, profile: { ...session.profile, ...profile } })
}
