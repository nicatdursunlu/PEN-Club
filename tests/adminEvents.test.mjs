import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('admin events sends pagination and combined filters and reads a Spring Page', async () => {
  let allowed = true
  let response = { content: [{ slug: 'draft-event', status: 'DRAFT' }], totalElements: 21, totalPages: 3 }
  const requests = []
  globalThis.adminEventsTestClient = {
    get: async (url, config) => {
      requests.push({ url, ...config })
      return { data: response }
    },
  }
  globalThis.adminEventsTestIsAdmin = () => allowed
  const source = (await readFile(new URL('../src/services/eventsService.js', import.meta.url), 'utf8'))
    .replace("import axiosInstance from './axiosInstance'", 'const axiosInstance = globalThis.adminEventsTestClient')
    .replace("import { isAdmin, getSession } from './authService'", 'const isAdmin = globalThis.adminEventsTestIsAdmin; const getSession = () => null')
  const { fetchAllEvents } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
  assert.deepEqual(await fetchAllEvents({ page: 1, size: 10, category: 'PLAY', status: 'DRAFT' }), response)
  assert.deepEqual(requests[0], { url: '/events/admin/all', params: { page: 1, size: 10, category: 'PLAY', status: 'DRAFT' } })
  await fetchAllEvents({ category: '', status: '' })
  assert.deepEqual(requests[1].params, { page: 0, size: 10 })
  response = []
  await assert.rejects(fetchAllEvents(), /not a paginated list/)
  allowed = false
  const count = requests.length
  await assert.rejects(fetchAllEvents(), /Admin login is required/)
  assert.equal(requests.length, count)
  delete globalThis.adminEventsTestClient
  delete globalThis.adminEventsTestIsAdmin
})
