import { mount, event } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import EventDetail from '../../src/pages/EventDetail'
import * as api from '../../src/services/eventsService'
import userEvent from '@testing-library/user-event'

describe('EventDetail', () => {
  it('EventDetail hides drafts and cancelled events', async () => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, status: 'DRAFT' })
    mount(<EventDetail />, '/events/party', '/events/:id')
    expect(await screen.findByRole('heading', { name: 'Event Not Found' })).toBeInTheDocument()
    expect(screen.queryByText(event.title)).not.toBeInTheDocument()
  })
  it('EventDetail shows public event content', async () => {
    mount(<EventDetail />, '/events/party', '/events/:id')
    expect(await screen.findByRole('heading', { name: event.title })).toBeInTheDocument()
    expect(api.fetchEventBySlug).toHaveBeenCalledWith('party')
  })
  it('opens Instagram directly in a new tab', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    mount(<EventDetail />, '/events/party', '/events/:id')
    await user.click(await screen.findByRole('button', { name: 'Open Instagram' }))
    expect(open).toHaveBeenCalledWith('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
  })
})
