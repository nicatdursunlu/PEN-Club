import { mount, event } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import EventForm, { EMPTY_FORM } from '../../src/components/admin/EventForm'

describe('EventForm', () => {
  it('EventForm submits edited content and preserves it when status changes', async () => {
    const submit = vi.fn()
    const view = render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><EventForm initialValues={EMPTY_FORM} eventStatus="DRAFT" onSubmit={submit} /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText(/Event Title/), { target: { value: 'Edited event' } })
    await userEvent.click(screen.getByRole('button', { name: 'Create Event' }))
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Edited event' }))
    view.rerender(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><EventForm initialValues={EMPTY_FORM} eventStatus="PUBLISHED" onSubmit={submit} /></MemoryRouter>)
    expect(screen.getByLabelText(/Event Title/)).toHaveValue('Edited event')
    expect(screen.getByLabelText(/Status/)).toHaveValue('PUBLISHED')
    expect(screen.getByLabelText(/Status/)).toBeDisabled()
  })
  it('EventForm reset restores initial values only when confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mount(<EventForm onSubmit={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/Event Title/), { target: { value: 'Changed' } })
    await userEvent.click(screen.getByRole('button', { name: /Reset/ }))
    expect(screen.getByLabelText(/Event Title/)).toHaveValue('')
  })
})
