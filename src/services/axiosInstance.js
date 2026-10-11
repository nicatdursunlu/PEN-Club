import createAuthenticatedClient from './createAuthenticatedClient'
import { getSession, refreshAccessToken, clearTokens } from './authService'

export default createAuthenticatedClient({
  getSession,
  refresh: refreshAccessToken,
  expire: () => {
    const role = getSession()?.role
    clearTokens()
    window.location.href = role === 'ADMIN' ? '/admin/login' : '/login'
  },
})
