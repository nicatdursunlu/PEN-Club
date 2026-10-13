import { mount, event } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminEventEdit from '../../src/pages/admin/AdminEventEdit'
import * as api from '../../src/services/eventsService'

describe('AdminEventEdit', () => {
  it('AdminEventEdit saves content without sending status', async () => {
    mount(<AdminEventEdit />, '/admin/events/party', '/admin/events/:slug')
    await screen.findByRole('button', { name: 'Update Event' })
    fireEvent.change(screen.getByLabelText(/Event Title/), { target: { value: 'Updated party' } })
    await userEvent.click(screen.getByRole('button', { name: 'Update Event' }))
    expect(api.updateEvent).toHaveBeenCalledWith('party', expect.objectContaining({ title: 'Updated party' }))
    expect(api.updateEvent.mock.calls[0][1]).not.toHaveProperty('status')
  })
  it('AdminEventEdit blocks updates for completed events', async () => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, status: 'COMPLETED' })
    mount(<AdminEventEdit />, '/admin/events/party', '/admin/events/:slug')
    expect(await screen.findByRole('button', { name: 'Update Event' })).toBeDisabled()
  })
  it('keeps lifecycle and clone actions off the editor', async () => {
    mount(<AdminEventEdit />, '/admin/events/party/edit', '/admin/events/:slug/edit')
    await screen.findByRole('button', { name: 'Update Event' })
    expect(screen.queryByRole('link', { name: 'View', exact: true })).not.toBeInTheDocument()
    for (const name of ['Publish Event', 'Cancel Event', 'Clone Event']) {
      expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
    }
  })
  it('redirects successful updates to the view page using the returned slug', async () => {
    api.updateEvent.mockResolvedValue({ slug: 'updated-party' })
    mount(<AdminEventEdit />, '/admin/events/party/edit', '/admin/events/:slug/edit')
    await userEvent.click(await screen.findByRole('button', { name: 'Update Event' }))
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/events/updated-party'))
  })
})
