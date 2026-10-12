import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('registration mutations always call the API without persisting registration state', async () => {
  const calls = []
  globalThis.registrationTestClient = {
    post: async (...args) => { calls.push(['post', ...args]) },
    delete: async (...args) => { calls.push(['delete', ...args]) },
  }
  globalThis.registrationTestSession = () => ({ accessToken: 'member-token', role: 'MEMBER' })
  globalThis.localStorage = {
    getItem: () => { throw new Error('Registration must not read localStorage') },
    setItem: () => { throw new Error('Registration must not write localStorage') },
  }
  const source = (await readFile(new URL('../src/services/eventRegistrationService.js', import.meta.url), 'utf8'))
    .replace("import axiosInstance from './axiosInstance'", 'const axiosInstance = globalThis.registrationTestClient')
    .replace("import { getSession } from './authService'", 'const getSession = globalThis.registrationTestSession')
  const { registerForEvent, unregisterFromEvent } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
  await registerForEvent('new year')
  await unregisterFromEvent('new year')
  assert.deepEqual(calls, [
    ['post', '/events/new%20year/register', undefined, { _expectedAccessToken: 'member-token' }],
    ['delete', '/events/new%20year/register', { _expectedAccessToken: 'member-token' }],
  ])
  globalThis.registrationTestClient.post = async () => { throw new Error('Registration failed') }
  await assert.rejects(registerForEvent('event'), /Registration failed/)
  delete globalThis.registrationTestClient
  delete globalThis.registrationTestSession
  delete globalThis.localStorage
})
