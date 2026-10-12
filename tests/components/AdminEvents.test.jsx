import { mount, event, page } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminEvents from '../../src/pages/admin/AdminEvents'
import * as api from '../../src/services/eventsService'

describe('AdminEvents', () => {
  it('AdminEvents sends filters, resets page, and changes page size', async () => {
    api.fetchAllEvents.mockResolvedValue(page([event], 30, 3))
    mount(<AdminEvents />)
    await screen.findByText(event.title)
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(api.fetchAllEvents).toHaveBeenLastCalledWith({ page: 1, size: 10, category: '', status: '' }))
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'DRAFT' } })
    await waitFor(() => expect(api.fetchAllEvents).toHaveBeenLastCalledWith({ page: 0, size: 10, category: '', status: 'DRAFT' }))
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'PLAY' } })
    await waitFor(() => expect(api.fetchAllEvents).toHaveBeenLastCalledWith({ page: 0, size: 10, category: 'PLAY', status: 'DRAFT' }))
    await screen.findByText(event.title)
    fireEvent.change(screen.getByLabelText('Events per page'), { target: { value: '25' } })
    await waitFor(() => expect(api.fetchAllEvents).toHaveBeenLastCalledWith({ page: 0, size: 25, category: 'PLAY', status: 'DRAFT' }))
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    await waitFor(() => expect(api.fetchAllEvents).toHaveBeenLastCalledWith({ page: 0, size: 25, category: '', status: '' }))
  })
  it('AdminEvents shows descriptions without displaying slugs', async () => {
    mount(<AdminEvents />)
    expect(await screen.findByText(event.description)).toBeInTheDocument()
    expect(screen.queryByText('/party')).not.toBeInTheDocument()
  })
  it('AdminEvents retries load failures', async () => {
    api.fetchAllEvents.mockRejectedValueOnce(new Error('Unavailable')).mockResolvedValueOnce(page())
    mount(<AdminEvents />)
    await screen.findByText('Unavailable')
    await userEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(await screen.findByText(event.title)).toBeInTheDocument()
  })
})
