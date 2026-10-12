import { mount, setSession, member, event } from './helpers'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventFeedbackForm from '../../src/components/EventFeedbackForm'
import { submitEventFeedback } from '../../src/services/eventsService'

const completed = { ...event, registered: true, status: 'COMPLETED' }
describe('EventFeedbackForm', () => {
  it('submits rating and optional comment for a completed event', async () => {
    setSession(member)
    mount(<EventFeedbackForm event={completed} slug="party" />)
    expect(screen.getByRole('button', { name: 'Submit feedback' })).toBeDisabled()
    await userEvent.click(screen.getByRole('radio', { name: '5 stars' }))
    fireEvent.change(screen.getByLabelText('Comment (optional)'), { target: { value: 'Great evening!' } })
    await userEvent.click(screen.getByRole('button', { name: 'Submit feedback' }))
    expect(submitEventFeedback).toHaveBeenCalledWith('party', { rating: 5, comment: 'Great evening!' })
    expect(await screen.findByText('Thank you for your feedback!')).toHaveTextContent('Thank you')
    expect(screen.getByRole('button', { name: 'Update feedback' })).toBeEnabled()
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }))
    fireEvent.change(screen.getByLabelText('Comment (optional)'), { target: { value: 'Updated comment' } })
    await userEvent.click(screen.getByRole('button', { name: 'Update feedback' }))
    expect(submitEventFeedback).toHaveBeenLastCalledWith('party', { rating: 4, comment: 'Updated comment' })
    expect(submitEventFeedback).toHaveBeenCalledTimes(2)
    expect(await screen.findByText('Your feedback has been updated.')).toBeInTheDocument()
  })
  it.each([false, undefined])('hides feedback when registration is %s', (registered) => {
    setSession(member)
    mount(<EventFeedbackForm event={{ ...completed, registered }} slug="party" />)
    expect(screen.queryByRole('group', { name: 'Rating' })).not.toBeInTheDocument()
    expect(submitEventFeedback).not.toHaveBeenCalled()
  })
  it('prefills the current member feedback from the response list', async () => {
    setSession(member)
    mount(<EventFeedbackForm event={completed} slug="party" feedback={[
      { eventSlug: 'party', email: member.email, rating: 4, comment: 'My previous feedback' },
      { eventSlug: 'party', email: 'other@example.com', rating: 1, comment: 'Someone else' },
    ]} />)
    expect(screen.getByRole('radio', { name: '4 stars' })).toBeChecked()
    expect(screen.getByLabelText('Comment (optional)')).toHaveValue('My previous feedback')
    await userEvent.click(screen.getByRole('button', { name: 'Update feedback' }))
    expect(submitEventFeedback).toHaveBeenCalledWith('party', { rating: 4, comment: 'My previous feedback' })
  })
  it('permits feedback on past published events', () => {
    setSession(member)
    mount(<EventFeedbackForm event={{ ...event, registered: true, date: '2000-01-01' }} slug="party" />)
    expect(screen.getByRole('group', { name: 'Rating' })).toBeInTheDocument()
    expect(screen.getByLabelText('Comment (optional)')).toHaveAttribute('maxlength', '2000')
  })
  it.each(['DRAFT', 'CANCELLED', 'PUBLISHED'])('hides feedback for ineligible %s events', (status) => {
    setSession(member)
    mount(<EventFeedbackForm event={{ ...event, status }} slug="party" />)
    expect(screen.queryByRole('group', { name: 'Rating' })).not.toBeInTheDocument()
  })
  it.each([null, { ...member, role: 'ADMIN' }])('hides feedback for non-member sessions', (session) => {
    setSession(session)
    mount(<EventFeedbackForm event={completed} slug="party" />)
    expect(screen.queryByRole('group', { name: 'Rating' })).not.toBeInTheDocument()
  })
  it('retains feedback after API errors and permits retry', async () => {
    setSession(member)
    submitEventFeedback.mockRejectedValueOnce(new Error('Feedback unavailable')).mockResolvedValueOnce({})
    mount(<EventFeedbackForm event={completed} slug="party" />)
    await userEvent.click(screen.getByRole('radio', { name: '3 stars' }))
    await userEvent.click(screen.getByRole('button', { name: 'Submit feedback' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Feedback unavailable')
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeChecked()
    await userEvent.click(screen.getByRole('button', { name: 'Submit feedback' }))
    expect(await screen.findByText('Thank you for your feedback!')).toHaveTextContent('Thank you')
  })
  it('disables submission while a request is pending', async () => {
    setSession(member)
    submitEventFeedback.mockReturnValue(new Promise(() => {}))
    mount(<EventFeedbackForm event={completed} slug="party" />)
    await userEvent.click(screen.getByRole('radio', { name: '1 star' }))
    await userEvent.click(screen.getByRole('button', { name: 'Submit feedback' }))
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
    expect(screen.getByRole('group', { name: 'Rating' })).toBeDisabled()
    expect(submitEventFeedback).toHaveBeenCalledOnce()
  })
})
