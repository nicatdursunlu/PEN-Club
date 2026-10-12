import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { canLeaveEventFeedback } from '../src/utils/eventLifecycle.js'

test('feedback eligibility covers completed and past public events', () => {
  const now = new Date('2026-10-12T12:00:00')
  for (const registered of [false, undefined]) assert.equal(canLeaveEventFeedback({ registered, status: 'COMPLETED' }, now), false)
  assert.equal(canLeaveEventFeedback({ registered: true, status: 'COMPLETED', date: '2099-01-01' }, now), true)
  assert.equal(canLeaveEventFeedback({ registered: true, status: 'PUBLISHED', date: '2026-10-11' }, now), true)
  for (const status of ['DRAFT', 'CANCELLED']) assert.equal(canLeaveEventFeedback({ registered: true, status, date: '2000-01-01' }, now), false)
  for (const date of ['2026-10-12', '2026-10-13', 'invalid', undefined]) assert.equal(canLeaveEventFeedback({ registered: true, status: 'PUBLISHED', date }, now), false)
})

test('feedback service sends authenticated payload and validates rating/comment', async () => {
  let session = { accessToken: 'token' }
  const calls = []
  globalThis.feedbackTestClient = { post: async (...args) => { calls.push(args); return { data: 'ok' } } }
  globalThis.feedbackTestSession = () => session
  const source = (await readFile(new URL('../src/services/eventsService.js', import.meta.url), 'utf8'))
    .replace("import axiosInstance from './axiosInstance'", 'const axiosInstance = globalThis.feedbackTestClient')
    .replace("import { isAdmin, getSession } from './authService'", 'const isAdmin = () => false; const getSession = globalThis.feedbackTestSession')
  const { submitEventFeedback } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
  assert.equal(await submitEventFeedback('my event', { rating: 5, comment: 'Great' }), 'ok')
  assert.deepEqual(calls[0], ['/events/my%20event/feedback', { rating: 5, comment: 'Great' }, { _expectedAccessToken: 'token' }])
  await submitEventFeedback('event', { rating: 1 })
  assert.equal(calls[1][1].comment, '')
  for (const rating of [0, 6, 2.5, '5']) await assert.rejects(submitEventFeedback('event', { rating }), /rating/)
  await assert.rejects(submitEventFeedback('event', { rating: 3, comment: 'x'.repeat(2001) }), /2000/)
  await submitEventFeedback('event', { rating: 3, comment: 'x'.repeat(2000) })
  session = null
  await assert.rejects(submitEventFeedback('event', { rating: 3 }), /log in/)
  delete globalThis.feedbackTestClient
  delete globalThis.feedbackTestSession
})
