import { mount, event, setSession, member } from './helpers'
import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminEventView from '../../src/pages/admin/AdminEventView'
import Router from '../../src/components/Router'
import * as api from '../../src/services/eventsService'

describe('AdminEventView', () => {
  it('displays event details and links to the editor and participants', async () => {
    mount(<AdminEventView />, '/admin/events/party', '/admin/events/:slug')
    expect(await screen.findByRole('heading', { name: event.title })).toBeInTheDocument()
    expect(screen.getByText(event.description)).toBeInTheDocument()
    expect(screen.getByText('31.12.2099')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Update Event' })).toHaveAttribute('href', '/admin/events/party/edit')
    expect(screen.getByRole('link', { name: /View participants/ })).toHaveAttribute('href', '/admin/events/party/participants')
  })
  it('publishes a draft and then permits cancellation', async () => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, status: 'DRAFT' })
    api.publishEvent.mockResolvedValue({ status: 'PUBLISHED' })
    api.cancelEvent.mockResolvedValue({ status: 'CANCELLED' })
    mount(<AdminEventView />, '/admin/events/party', '/admin/events/:slug')
    await userEvent.click(await screen.findByRole('button', { name: 'Publish Event' }))
    expect(api.publishEvent).toHaveBeenCalledWith('party')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Publish Event' })).toBeDisabled())
    await userEvent.click(screen.getByRole('button', { name: 'Cancel Event' }))
    expect(api.cancelEvent).toHaveBeenCalledWith('party')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel Event' })).toBeDisabled())
  })
  it('shows completed details with status actions disabled', async () => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, status: 'COMPLETED' })
    mount(<AdminEventView />, '/admin/events/party', '/admin/events/:slug')
    expect(await screen.findByRole('button', { name: 'Publish Event' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel Event' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Update Event' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Clone Event' })).toBeEnabled()
  })
  it('clones events and opens the copy', async () => {
    api.cloneEvent.mockResolvedValue({ slug: 'party-copy' })
    mount(<AdminEventView />, '/admin/events/party', '/admin/events/:slug')
    await userEvent.click(await screen.findByRole('button', { name: 'Clone Event' }))
    expect(api.cloneEvent).toHaveBeenCalledWith('party')
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/events/party-copy'))
  })
  it('retries event loading errors', async () => {
    api.fetchEventBySlug.mockRejectedValueOnce(new Error('Unavailable')).mockResolvedValueOnce(event)
    mount(<AdminEventView />, '/admin/events/party', '/admin/events/:slug')
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable')
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByRole('heading', { name: event.title })).toBeInTheDocument()
  })
  it('routes an admin from detail to update form', async () => {
    setSession({ ...member, role: 'ADMIN' })
    mount(<Router />, '/admin/events/party', 'router')
    await userEvent.click(await screen.findByRole('link', { name: 'Update Event' }))
    expect(await screen.findByRole('button', { name: 'Update Event' })).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('/admin/events/party/edit')
  })
  it('shows all content fields including both descriptions, pricing, agenda, and maps', async () => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, fullDescription: 'Full event details', organizer: 'PEN Team', attendees: 0,
      pricing: { full: '100 PLN', basic: '50 PLN' }, mapEmbedUrl: 'https://www.google.com/maps/embed?pb=test',
      locationLink: 'https://maps.google.com', goal: 'Build community', specialNote: 'Bring ID',
      highlights: ['Games'], eventHighlights: ['Networking'], agenda: [{ time: '18:00', title: 'Welcome', description: 'Introductions' }],
      images: [{ url: '/event.jpg', alt: 'Event poster', caption: 'Poster caption' }],
    })
    mount(<AdminEventView />, '/admin/events/party', '/admin/events/:slug')
    await screen.findByRole('heading', { name: event.title })
    for (const heading of ['Short description', 'Full description', 'Agenda', 'Highlights', 'Event highlights', 'Goal', 'Special note']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
    for (const text of ['Full event details', 'PEN Team', '100 PLN', '50 PLN', 'Build community', 'Bring ID', 'Introductions', 'Poster caption']) expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByTitle('Event Location Map')).toHaveAttribute('src', 'https://www.google.com/maps/embed?pb=test')
    expect(screen.getByRole('img', { name: 'Event poster' })).toBeInTheDocument()
  })
  it.each(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'])('shows the public View link only for visible statuses: %s', async (status) => {
    api.fetchEventBySlug.mockResolvedValue({ ...event, status })
    mount(<AdminEventView />, '/admin/events/party', '/admin/events/:slug')
    await screen.findByRole('heading', { name: event.title })
    if (['PUBLISHED', 'COMPLETED'].includes(status)) {
      expect(screen.getByRole('link', { name: 'View', exact: true })).toHaveAttribute('href', '/events/party')
      expect(screen.getByRole('link', { name: 'View', exact: true })).toHaveAttribute('target', '_blank')
    } else expect(screen.queryByRole('link', { name: 'View', exact: true })).not.toBeInTheDocument()
  })
})
