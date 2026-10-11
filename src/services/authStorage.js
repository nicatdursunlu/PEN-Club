export const AUTH_CHANGE_EVENT = 'pen-auth-change'
export const AUTH_SESSION_KEY = 'pen_auth_session'
export const notifyAuthChange = () => window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))

export const getSession = (role) => {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY))
    return typeof session?.accessToken === 'string' && session.accessToken && ['ADMIN', 'MEMBER'].includes(session.role) && (!role || session.role === role) ? session : null
  } catch { return null }
}
export const saveSession = (session) => {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  notifyAuthChange()
}
export const clearSession = () => {
  localStorage.removeItem(AUTH_SESSION_KEY)
  notifyAuthChange()
}

// Migrate old credentials once, then retain only the shared session key.
if (!getSession()) {
  const accessToken = localStorage.getItem('pen_admin_access_token')
  if (accessToken) {
    saveSession({ accessToken, refreshToken: localStorage.getItem('pen_admin_refresh_token'), role: 'ADMIN' })
  } else {
    try {
      const previous = JSON.parse(localStorage.getItem('pen_member_session'))
      if (previous?.accessToken) saveSession({ accessToken: previous.accessToken, refreshToken: previous.refreshToken, email: previous.email, profile: previous.profile, role: 'MEMBER' })
    } catch { /* Ignore malformed legacy storage. */ }
  }
}
for (const key of ['pen_admin_access_token', 'pen_admin_refresh_token', 'pen_admin_session_id', 'pen_member_session']) localStorage.removeItem(key)
