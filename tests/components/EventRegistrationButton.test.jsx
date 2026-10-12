import { mount, setSession, member, event } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventRegistrationButton from '../../src/components/EventRegistrationButton'
import * as api from '../../src/services/eventsService'
import * as registration from '../../src/services/eventRegistrationService'

describe('EventRegistrationButton', () => {
  it('registration buttons use server registered state and refetch after mutation', async () => {
    setSession(member)
    api.fetchEventBySlug.mockResolvedValueOnce({ ...event, registered: true }).mockResolvedValueOnce(event)
    mount(<EventRegistrationButton event={event} slug="party" />)
    await userEvent.click(await screen.findByRole('button', { name: 'Unregister' }))
    expect(registration.unregisterFromEvent).toHaveBeenCalledWith('party')
    expect(await screen.findByRole('button', { name: 'Register for event' })).toBeEnabled()
    expect(api.fetchEventBySlug).toHaveBeenCalledTimes(2)
  })
  it('registration failures retain the server-confirmed state', async () => {
    setSession(member)
    registration.registerForEvent.mockRejectedValue(new Error('Registration unavailable'))
    mount(<EventRegistrationButton event={event} slug="party" />)
    await userEvent.click(await screen.findByRole('button', { name: 'Register for event' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Registration unavailable')
    expect(screen.getByRole('button', { name: 'Register for event' })).toBeEnabled()
  })
  it.each(['DRAFT', 'CANCELLED', 'COMPLETED'])('registration is hidden for %s events', (status) => {
    setSession(member)
    mount(<EventRegistrationButton event={{ ...event, status }} slug="party" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
