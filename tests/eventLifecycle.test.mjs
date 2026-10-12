import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { canRegisterForEvent } from '../src/utils/eventLifecycle.js'

test('only published upcoming events allow registration', () => {
  const now = new Date('2026-12-31T17:00:00')
  for (const status of ['DRAFT', 'CANCELLED', 'COMPLETED', 'UPCOMING', undefined]) {
    assert.equal(canRegisterForEvent({ status, date: '2027-01-01' }, now), false)
  }
  assert.equal(canRegisterForEvent({ status: 'PUBLISHED', date: '2027-01-01' }, now), true)
  assert.equal(canRegisterForEvent({ status: 'PUBLISHED', date: '2026-12-30' }, now), false)
  assert.equal(canRegisterForEvent({ status: 'PUBLISHED', date: 'invalid' }, now), false)
})

test('registration closes at the start time for 12-hour and 24-hour ranges', () => {
  const event = { status: 'PUBLISHED', date: '2026-12-31' }
  for (const time of ['6:00 PM - 8:00 PM', '18:00 - 20:00']) {
    assert.equal(canRegisterForEvent({ ...event, time }, new Date('2026-12-31T17:59:00')), true)
    assert.equal(canRegisterForEvent({ ...event, time }, new Date('2026-12-31T18:00:00')), false)
  }
  assert.equal(canRegisterForEvent({ ...event, time: '12:00 AM' }, new Date('2026-12-31T01:00:00')), false)
})

test('content update payload omits lifecycle status', async () => {
  const source = await readFile(new URL('../src/components/admin/EventForm.jsx', import.meta.url), 'utf8')
  const payloadSource = source.slice(source.indexOf('export const buildPayload'), source.indexOf('// ─── Map API'))
  const { buildPayload } = await import(`data:text/javascript;base64,${Buffer.from(payloadSource).toString('base64')}`)
  const form = {
    title: ' My Event ', description: ' Description ', date: '2026-12-31', status: 'PUBLISHED',
    highlights: [], eventHighlights: [], agenda: [], images: [],
    slug: '', fullDescription: '', location: '', locationLink: '', mapEmbedUrl: '', organizer: '',
    specialNote: '', goal: '', pricingFull: '', pricingBasic: '',
  }
  assert.deepEqual(buildPayload(form), { title: 'My Event', description: 'Description', date: '2026-12-31' })
})
