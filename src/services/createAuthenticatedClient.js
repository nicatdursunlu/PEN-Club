import axios from 'axios'

export default function createAuthenticatedClient({ getSession, refresh, expire }) {
  const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, headers: { 'Content-Type': 'application/json' } })
  let refreshing = null
  const rotations = new Map()
  const currentToken = (token) => {
    while (rotations.has(token)) token = rotations.get(token)
    return token
  }
  client.interceptors.request.use((config) => {
    const session = getSession()
    const expected = config._expectedAccessToken || config._authToken
    if (expected && currentToken(expected) !== session?.accessToken) throw new Error('Your login changed. Please try again.')
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
    if (config._retry) { expire(); throw error }
    config._retry = true
    try {
      if (session.accessToken === config._authToken) {
        if (!refreshing || refreshing.token !== session.accessToken) {
          const operation = { token: session.accessToken }
          operation.promise = Promise.resolve().then(refresh).then((token) => {
            if (token !== operation.token) rotations.set(operation.token, token)
            return token
          }).finally(() => { if (refreshing === operation) refreshing = null })
          refreshing = operation
        }
        await refreshing.promise
      }
    } catch (refreshError) {
      if (getSession()?.accessToken === session.accessToken) expire()
      throw refreshError
    }
    return client(config)
  })
  return client
}
