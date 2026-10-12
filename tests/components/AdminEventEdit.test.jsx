import { mount, event } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminEventEdit from '../../src/pages/admin/AdminEventEdit'
import * as api from '../../src/services/eventsService'

describe('AdminEventEdit', () => {
  it('AdminEventEdit publishes a draft via the publish endpoint', async () => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, status: 'DRAFT' })
    api.publishEvent.mockResolvedValue({ status: 'PUBLISHED' })
    mount(<AdminEventEdit />, '/admin/events/party', '/admin/events/:slug')
    await userEvent.click(await screen.findByRole('button', { name: 'Publish Event' }))
    expect(api.publishEvent).toHaveBeenCalledWith('party')
    await waitFor(() => expect(screen.getByText('Status: PUBLISHED')).toBeInTheDocument())
  })
  it('AdminEventEdit cancels published events via the cancel endpoint', async () => {
    api.cancelEvent.mockResolvedValue({ status: 'CANCELLED' })
    mount(<AdminEventEdit />, '/admin/events/party', '/admin/events/:slug')
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel Event' }))
    expect(api.cancelEvent).toHaveBeenCalledWith('party')
    await waitFor(() => expect(screen.getByText('Status: CANCELLED')).toBeInTheDocument())
  })
  it('AdminEventEdit saves content without sending status', async () => {
    mount(<AdminEventEdit />, '/admin/events/party', '/admin/events/:slug')
    await screen.findByRole('button', { name: 'Update Event' })
    fireEvent.change(screen.getByLabelText(/Event Title/), { target: { value: 'Updated party' } })
    await userEvent.click(screen.getByRole('button', { name: 'Update Event' }))
    expect(api.updateEvent).toHaveBeenCalledWith('party', expect.objectContaining({ title: 'Updated party' }))
    expect(api.updateEvent.mock.calls[0][1]).not.toHaveProperty('status')
  })
  it('AdminEventEdit disables status actions for completed events', async () => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, status: 'COMPLETED' })
    mount(<AdminEventEdit />, '/admin/events/party', '/admin/events/:slug')
    expect(await screen.findByRole('button', { name: 'Publish Event' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel Event' })).toBeDisabled()
  })
  it('AdminEventEdit clones saved events and opens their copy', async () => {
    api.cloneEvent.mockResolvedValue({ slug: 'party-copy' })
    mount(<AdminEventEdit />, '/admin/events/party', '/admin/events/:slug')
    await userEvent.click(await screen.findByRole('button', { name: 'Clone Event' }))
    expect(api.cloneEvent).toHaveBeenCalledWith('party')
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/events/party-copy'))
  })
})
