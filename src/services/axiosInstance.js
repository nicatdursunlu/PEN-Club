import createAuthenticatedClient from './createAuthenticatedClient'
import { getSession, refreshAccessToken, clearTokens } from './authService'

export default createAuthenticatedClient({
  getSession,
  refresh: refreshAccessToken,
  expire: () => {
    clearTokens()
    window.location.href = '/login'
  },
})
