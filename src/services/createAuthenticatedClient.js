import axios from 'axios'

export default function createAuthenticatedClient({ getSession, refresh, expire }) {
  const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, headers: { 'Content-Type': 'application/json' } })
  let refreshing = null
  const rotations = new Map()
  const currentToken = (token) => {
    while (rotations.has(token)) token = rotations.get(token)
    return token
  }
  const refreshSession = async (session) => {
    if (!refreshing || refreshing.token !== session.accessToken) {
      const operation = { token: session.accessToken }
      operation.promise = Promise.resolve().then(refresh).then((token) => {
        if (token !== operation.token) rotations.set(operation.token, token)
        return token
      }).finally(() => { if (refreshing === operation) refreshing = null })
      refreshing = operation
    }
    try {
      await refreshing.promise
    } catch (error) {
      if (getSession()?.accessToken === session.accessToken &&
          (error.code === 'NO_REFRESH_TOKEN' || [401, 403].includes(error.response?.status))) expire()
      throw error
    }
  }
  const expiresSoon = (token) => {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const { exp } = JSON.parse(atob(payload))
      return typeof exp === 'number' && exp * 1000 <= Date.now() + 30000
    } catch { return false }
  }
  client.interceptors.request.use(async (config) => {
    let session = getSession()
    const expected = config._expectedAccessToken || config._authToken
    if (expected && currentToken(expected) !== session?.accessToken) throw new Error('Your login changed. Please try again.')
    if (session?.accessToken && !config._retry && expiresSoon(session.accessToken)) {
      const token = session.accessToken
      await refreshSession(session)
      session = getSession()
      if (!session || currentToken(token) !== session.accessToken) throw new Error('Your login changed. Please try again.')
    }
    config.headers ||= {}
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
      config._authToken = session.accessToken
    } else delete config.headers.Authorization
    return config
  })
  client.interceptors.response.use((response) => response, async (error) => {
    const config = error.config
    if (![401, 403].includes(error.response?.status) || !config?._authToken) throw error
    const session = getSession()
    if (!session || currentToken(config._authToken) !== session.accessToken) throw error
    if (config._retry) {
      if (error.response.status === 401) expire()
      throw error
    }
    config._retry = true
    if (session.accessToken === config._authToken) await refreshSession(session)
    return client(config)
  })
  return client
}
