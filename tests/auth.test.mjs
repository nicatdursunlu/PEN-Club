import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import axios, { AxiosError } from 'axios'

const storage = new Map()
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
}
globalThis.window = new EventTarget()
const axiosUrl = new URL('../node_modules/axios/index.js', import.meta.url).href
const load = async (file) => {
  let source = (await readFile(new URL(`../src/services/${file}`, import.meta.url), 'utf8'))
    .replace("from 'axios'", `from '${axiosUrl}'`)
    .replaceAll('import.meta.env.VITE_API_BASE_URL', "'https://api.test/api/v1'")
  if (source.includes("from './authStorage'")) {
    const storageSource = await readFile(new URL('../src/services/authStorage.js', import.meta.url), 'utf8')
    const storageUrl = `data:text/javascript;base64,${Buffer.from(storageSource).toString('base64')}`
    source = source.replaceAll("from './authStorage'", `from '${storageUrl}'`)
  }
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
}
const { default: createClient } = await load('createAuthenticatedClient.js')
const auth = await load('authService.js')
const unauthorized = (config) => Promise.reject(new AxiosError('Expired', 'ERR_BAD_REQUEST', config, null, { status: 401, config }))

test('expired access token returning 403 refreshes and retries for either role', async () => {
  for (const role of ['ADMIN', 'MEMBER']) {
    storage.clear()
    auth.storeAuthResponse({ accessToken: `old-${role}`, refreshToken: 'refresh', role }, 'user@example.com')
    let refreshes = 0
    let expires = 0
    axios.defaults.adapter = async (config) => {
      refreshes++
      assert.equal(config.url, 'https://api.test/api/v1/auth/refresh-token')
      assert.deepEqual(JSON.parse(config.data), { refreshToken: 'refresh' })
      return { data: { accessToken: `new-${role}`, refreshToken: 'rotated-refresh' }, status: 200, config }
    }
    const client = createClient({ getSession: auth.getSession, refresh: auth.refreshAccessToken, expire: () => { expires++; auth.clearTokens() } })
    client.defaults.adapter = async (config) => {
      if (config.headers.Authorization === `Bearer old-${role}`) throw new AxiosError('Expired', 'ERR_BAD_REQUEST', config, null, { status: 403, config })
      assert.equal(config.headers.Authorization, `Bearer new-${role}`)
      return { data: 'ok', status: 200, config }
    }
    assert.equal((await client.get('/auth/profile')).data, 'ok')
    assert.equal(refreshes, 1)
    assert.equal(expires, 0)
    assert.equal(auth.getSession().role, role)
    assert.equal(auth.getRefreshToken(), 'rotated-refresh')
  }
})

test('repeated 403 preserves the refreshed session for either role', async () => {
  for (const role of ['ADMIN', 'MEMBER']) {
    storage.clear()
    auth.storeAuthResponse({ accessToken: `token-${role}`, refreshToken: 'refresh', role }, 'user@example.com')
    let destination
    let refreshes = 0
    const client = createClient({ getSession: auth.getSession, refresh: async () => {
      refreshes++
      auth.storeAuthResponse({ accessToken: `new-${role}`, role }, 'user@example.com')
      return `new-${role}`
    }, expire: () => {
      destination = auth.isAdmin() ? '/admin/login' : '/login'
      auth.clearTokens()
    } })
    client.defaults.adapter = (config) => Promise.reject(new AxiosError('Forbidden', 'ERR_BAD_REQUEST', config, null, { status: 403, config }))
    await assert.rejects(client.get('/auth/profile'))
    assert.equal(auth.getAccessToken(), `new-${role}`)
    assert.equal(destination, undefined)
    assert.equal(refreshes, 1)
  }
})

test('anonymous and stale-login 403 responses do not log out another user', async () => {
  let session = null
  let expires = 0
  const client = createClient({ getSession: () => session, refresh: async () => {}, expire: () => { expires++ } })
  client.defaults.adapter = (config) => {
    if (session) session = { accessToken: 'different-login' }
    return Promise.reject(new AxiosError('Forbidden', 'ERR_BAD_REQUEST', config, null, { status: 403, config }))
  }
  await assert.rejects(client.get('/public'))
  session = { accessToken: 'old-login' }
  await assert.rejects(client.get('/auth/profile'))
  assert.equal(expires, 0)
  assert.equal(session.accessToken, 'different-login')
})

test('concurrent 401s share refresh, rotated token retries once, late 401 uses current token', async () => {
  let session = { accessToken: 'old' }
  let refreshes = 0
  let expires = 0
  const client = createClient({ getSession: () => session, refresh: async () => {
    refreshes++
    await new Promise((resolve) => setTimeout(resolve, 10))
    session = { ...session, accessToken: 'new' }
    return 'new'
  }, expire: () => { expires++ } })
  let requests = 0
  client.defaults.adapter = async (config) => {
    requests++
    if (config.headers.Authorization === 'Bearer old') {
      if (config.url === '/users') await new Promise((resolve) => setTimeout(resolve, 25))
      return unauthorized(config)
    }
    return { data: 'ok', status: 200, config }
  }
  const responses = await Promise.all([client.get('/profile'), client.get('/events'), client.get('/users')])
  assert.equal(refreshes, 1)
  assert.equal(requests, 6)
  assert.equal(expires, 0)
  assert.ok(responses.every((response) => response.data === 'ok'))
})

test('retry 401 expires session without a refresh loop; anonymous 401 never refreshes', async () => {
  let session = { accessToken: 'old' }
  let refreshes = 0
  const client = createClient({ getSession: () => session, refresh: async () => { refreshes++; session.accessToken = 'new'; return 'new' }, expire: () => { session = null } })
  client.defaults.adapter = unauthorized
  await assert.rejects(client.get('/profile'))
  assert.equal(refreshes, 1)
  assert.equal(session, null)
  await assert.rejects(client.get('/public'))
  assert.equal(refreshes, 1)
})

test('failed refresh expires session and does not replay request', async () => {
  let session = { accessToken: 'old' }
  let requests = 0
  const client = createClient({ getSession: () => session, refresh: async () => { throw new AxiosError('Refresh rejected', 'ERR_BAD_REQUEST', undefined, null, { status: 401 }) }, expire: () => { session = null } })
  client.defaults.adapter = (config) => { requests++; return unauthorized(config) }
  await assert.rejects(client.get('/profile'), /Refresh rejected/)
  assert.equal(requests, 1)
  assert.equal(session, null)
})

test('a request cannot replay under a different login after refresh', async () => {
  let session = { accessToken: 'old' }
  let requests = 0
  let expired = false
  const client = createClient({ getSession: () => session, refresh: async () => {
    session = { accessToken: 'other-user' }
    return 'new'
  }, expire: () => { expired = true } })
  client.defaults.adapter = (config) => { requests++; return unauthorized(config) }
  await assert.rejects(client.get('/profile'), /(?:session|login) changed/)
  assert.equal(requests, 1)
  assert.equal(expired, false)
  assert.equal(session.accessToken, 'other-user')
})

test('one shared session stores server role; switching roles replaces credentials', async () => {
  storage.clear()
  axios.defaults.adapter = async (config) => ({ data: { accessToken: 'admin-token', refreshToken: 'admin-refresh', role: 'ADMIN' }, status: 200, config })
  await auth.login('admin@example.com', 'password123')
  assert.equal(auth.isAdmin(), true)
  assert.equal(auth.getSession().role, 'ADMIN')
  assert.equal(auth.getSession('MEMBER'), null)
  assert.deepEqual([...storage.keys()], ['pen_auth_session'])
  axios.defaults.adapter = async (config) => ({ data: { accessToken: 'member-token', refreshToken: 'member-refresh', user: { role: 'MEMBER', firstName: 'Jane' } }, status: 200, config })
  await auth.login('member@example.com', 'password123')
  assert.equal(auth.isAdmin(), false)
  assert.equal(auth.isAuthenticated(), true)
  assert.equal(auth.getSession('ADMIN'), null)
  assert.equal(auth.getSession().role, 'MEMBER')
  assert.deepEqual([...storage.keys()], ['pen_auth_session'])
  axios.defaults.adapter = async () => { throw new Error('Invalid credentials') }
  await assert.rejects(auth.login('bad@example.com', 'bad-password'))
  assert.equal(auth.getAccessToken(), 'member-token')
})

test('role resolves from response or token; absent role never grants admin', () => {
  const token = `header.${Buffer.from(JSON.stringify({ authorities: ['ROLE_ADMIN'] })).toString('base64url')}.signature`
  assert.equal(auth.resolveRole({ accessToken: token }), 'ADMIN')
  assert.equal(auth.resolveRole({ role: 'ROLE_ADMIN' }), 'ADMIN')
  assert.equal(auth.resolveRole({ user: { role: 'USER' } }), 'MEMBER')
  assert.equal(auth.resolveRole({ accessToken: 'opaque-token' }), 'MEMBER')
})

test('shared refresh rotates tokens and preserves role, email, and profile', async () => {
  storage.clear()
  auth.storeAuthResponse({ accessToken: 'old', refreshToken: 'refresh-old', role: 'ADMIN' }, 'admin@example.com', { firstName: 'Jane' })
  axios.defaults.adapter = async (config) => {
    assert.equal(config.url, 'https://api.test/api/v1/auth/refresh-token')
    assert.deepEqual(JSON.parse(config.data), { refreshToken: 'refresh-old' })
    return { data: { accessToken: 'new', refreshToken: 'refresh-new' }, status: 200, config }
  }
  await auth.refreshAccessToken()
  assert.equal(auth.getSession().role, 'ADMIN')
  assert.equal(auth.getSession('MEMBER'), null)
  assert.equal(auth.getAccessToken(), 'new')
  assert.equal(auth.getRefreshToken(), 'refresh-new')
  assert.equal(auth.getSession().profile.firstName, 'Jane')
  assert.equal('sessionId' in auth.getSession(), false)
  auth.updateSessionProfile({ email: 'updated@example.com' }, 'new')
  assert.equal(auth.getSession().email, 'updated@example.com')
})

test('logout notifies the server and clears the single session even on failure', async () => {
  storage.clear()
  auth.storeAuthResponse({ accessToken: 'member-token', role: 'MEMBER' }, 'member@example.com')
  const calls = []
  axios.defaults.adapter = async (config) => { calls.push(config); throw new Error('Offline') }
  const logout = auth.logout()
  assert.equal(auth.getSession(), null)
  assert.equal(await logout, false)
  assert.equal(calls[0].method, 'post')
  assert.equal(calls[0].url, 'https://api.test/api/v1/auth/logout')
  assert.equal(calls[0].headers.Authorization, 'Bearer member-token')
  assert.equal(storage.size, 0)
})

test('logout during shared refresh cannot restore credentials', async () => {
  storage.clear()
  auth.storeAuthResponse({ accessToken: 'old', refreshToken: 'refresh', role: 'MEMBER' }, 'member@example.com')
  let release
  axios.defaults.adapter = (config) => new Promise((resolve) => { release = () => resolve({ data: { accessToken: 'new' }, status: 200, config }) })
  const refreshing = auth.refreshAccessToken()
  auth.clearTokens()
  release()
  await assert.rejects(refreshing, /login changed/)
  assert.equal(auth.getSession(), null)
})

test('refresh preserves refresh token without rotation and rejects missing access tokens', async () => {
  storage.clear()
  auth.storeAuthResponse({ accessToken: 'old', refreshToken: 'refresh', role: 'ADMIN' }, 'admin@example.com')
  axios.defaults.adapter = async (config) => ({ data: { accessToken: 'new' }, status: 200, config })
  await auth.refreshAccessToken()
  assert.equal(auth.getRefreshToken(), 'refresh')
  axios.defaults.adapter = async (config) => ({ data: {}, status: 200, config })
  await assert.rejects(auth.refreshAccessToken(), /access token/)
})


test('temporary refresh failures preserve the session and allow another attempt', async () => {
  for (const failure of [new AxiosError('Offline', 'ERR_NETWORK'), new AxiosError('Unavailable', 'ERR_BAD_RESPONSE', undefined, null, { status: 503 })]) {
    let session = { accessToken: 'old' }
    let attempts = 0
    let expires = 0
    const client = createClient({ getSession: () => session, refresh: async () => {
      if (++attempts === 1) throw failure
      session = { accessToken: 'new' }
      return 'new'
    }, expire: () => { expires++ } })
    client.defaults.adapter = async (config) => config.headers.Authorization === 'Bearer old'
      ? unauthorized(config) : { data: 'ok', status: 200, config }
    await assert.rejects(client.get('/profile'))
    assert.equal(session.accessToken, 'old')
    assert.equal(expires, 0)
    assert.equal((await client.get('/profile')).data, 'ok')
    assert.equal(attempts, 2)
  }
})

test('expired JWT refreshes before concurrent requests and preserves role/profile', async () => {
  storage.clear()
  const token = `header.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 1 })).toString('base64url')}.signature`
  auth.storeAuthResponse({ accessToken: token, refreshToken: 'refresh', role: 'ADMIN' }, 'admin@example.com', { firstName: 'Jane' })
  let refreshes = 0
  axios.defaults.adapter = async (config) => {
    refreshes++
    await new Promise((resolve) => setTimeout(resolve, 10))
    return { data: { accessToken: 'new', refreshToken: 'rotated' }, status: 200, config }
  }
  let expires = 0
  const client = createClient({ getSession: auth.getSession, refresh: auth.refreshAccessToken, expire: () => { expires++ } })
  client.defaults.adapter = async (config) => {
    assert.equal(config.headers.Authorization, 'Bearer new')
    return { data: 'ok', status: 200, config }
  }
  await Promise.all([client.get('/profile'), client.get('/events')])
  assert.equal(refreshes, 1)
  assert.equal(expires, 0)
  assert.equal(auth.getRefreshToken(), 'rotated')
  assert.equal(auth.getSession().role, 'ADMIN')
  assert.equal(auth.getSession().profile.firstName, 'Jane')
})
