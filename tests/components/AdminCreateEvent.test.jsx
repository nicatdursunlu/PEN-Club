import { mount, event } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminCreateEvent from '../../src/pages/admin/AdminCreateEvent'
import * as api from '../../src/services/eventsService'

describe('AdminCreateEvent', () => {
  it('AdminCreateEvent sends an explicit draft', async () => {
    mount(<AdminCreateEvent />)
    fireEvent.change(screen.getByLabelText(/Event Title/), { target: { value: event.title } })
    fireEvent.change(screen.getByLabelText(/Event Date|^Date/), { target: { value: event.date } })
    fireEvent.change(screen.getByLabelText(/Short Description/i), { target: { value: event.description } })
    await userEvent.click(screen.getByRole('button', { name: 'Create Draft' }))
    expect(api.createEvent).toHaveBeenCalledWith(expect.objectContaining({ title: event.title, status: 'DRAFT' }))
  })
})
