import { mount, setSession, member, event } from './helpers'
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventFeedbackList from '../../src/components/EventFeedbackList'
import { fetchEventFeedback, submitEventFeedback } from '../../src/services/eventsService'

describe('EventFeedbackList', () => {
  it('loads feedback with ratings and comments', async () => {
    fetchEventFeedback.mockResolvedValue([{ eventId: 'event-id', eventSlug: 'party', userId: 'user-id', firstName: 'Jane', lastName: 'Doe', email: 'private@example.com', rating: 4, comment: 'Great event', createdAt: '2026-10-10T18:00:00', updatedAt: '2026-10-11T19:00:00' }, { id: 2, rating: 5, comment: '' }])
    mount(<EventFeedbackList slug="party" />)
    expect(screen.getByText('Loading feedback…')).toBeInTheDocument()
    expect(await screen.findByText('Great event')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('10.10.2026 18:00')).toBeInTheDocument()
    expect(screen.queryByText(/Submitted|Updated|19:00/)).not.toBeInTheDocument()
    expect(screen.queryByText('private@example.com')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Rating: 4 out of 5')).toBeInTheDocument()
    expect(screen.getByLabelText('Rating: 5 out of 5')).toBeInTheDocument()
    expect(fetchEventFeedback).toHaveBeenCalledWith('party')
  })
  it('lets the author edit inline, resubmit, and refresh the saved card', async () => {
    setSession(member)
    const own = { eventSlug: 'party', userId: 'member-id', email: member.email, firstName: 'Jane', rating: 4, comment: 'Original' }
    fetchEventFeedback.mockResolvedValueOnce([own]).mockResolvedValueOnce([{ ...own, rating: 5, comment: 'Edited' }])
    mount(<EventFeedbackList slug="party" event={{ ...event, status: 'COMPLETED', registered: true }} />)
    await userEvent.click(await screen.findByRole('button', { name: 'Edit your feedback' }))
    expect(screen.getByRole('radio', { name: '4 stars' })).toBeChecked()
    expect(screen.getByLabelText('Comment (optional)')).toHaveValue('Original')
    await userEvent.click(screen.getByRole('radio', { name: '5 stars' }))
    fireEvent.change(screen.getByLabelText('Comment (optional)'), { target: { value: 'Edited' } })
    await userEvent.click(screen.getByRole('button', { name: 'Update feedback' }))
    expect(submitEventFeedback).toHaveBeenCalledWith('party', { rating: 5, comment: 'Edited' })
    expect(await screen.findByText('Edited')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Edit feedback' })).not.toBeInTheDocument()
  })
  it('does not allow editing another participant feedback', async () => {
    setSession(member)
    fetchEventFeedback.mockResolvedValue([{ eventSlug: 'party', email: 'other@example.com', rating: 3, comment: 'Someone else' }])
    mount(<EventFeedbackList slug="party" event={{ ...event, status: 'COMPLETED', registered: true }} />)
    await screen.findByText('Someone else')
    expect(screen.queryByRole('button', { name: 'Edit your feedback' })).not.toBeInTheDocument()
  })
  it('cancel edit restores the card without submitting', async () => {
    setSession(member)
    fetchEventFeedback.mockResolvedValue([{ eventSlug: 'party', email: member.email, rating: 4, comment: 'Original' }])
    mount(<EventFeedbackList slug="party" event={{ ...event, status: 'COMPLETED', registered: true }} />)
    await userEvent.click(await screen.findByRole('button', { name: 'Edit your feedback' }))
    fireEvent.change(screen.getByLabelText('Comment (optional)'), { target: { value: 'Unsaved' } })
    await userEvent.click(screen.getByRole('button', { name: 'Cancel edit' }))
    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(submitEventFeedback).not.toHaveBeenCalled()
  })
  it('shows an empty state', async () => {
    mount(<EventFeedbackList slug="party" />)
    expect(await screen.findByText('No feedback yet.')).toBeInTheDocument()
  })
  it('retries API errors', async () => {
    fetchEventFeedback.mockRejectedValueOnce(new Error('Unavailable')).mockResolvedValueOnce([])
    mount(<EventFeedbackList slug="party" />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable')
    await userEvent.click(screen.getByRole('button', { name: 'Retry feedback' }))
    expect(await screen.findByText('No feedback yet.')).toBeInTheDocument()
    expect(fetchEventFeedback).toHaveBeenCalledTimes(2)
  })
  it('reloads when feedback is submitted or the event changes', async () => {
    const view = render(<EventFeedbackList slug="party" refreshKey={0} />)
    await screen.findByText('No feedback yet.')
    view.rerender(<EventFeedbackList slug="party" refreshKey={1} />)
    await waitFor(() => expect(fetchEventFeedback).toHaveBeenCalledTimes(2))
    view.rerender(<EventFeedbackList slug="another-event" refreshKey={1} />)
    await waitFor(() => expect(fetchEventFeedback).toHaveBeenLastCalledWith('another-event'))
  })
})
