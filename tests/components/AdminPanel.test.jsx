import { mount } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPanel from '../../src/pages/admin/AdminPanel'
import * as api from '../../src/services/eventsService'

describe('AdminPanel', () => {
  it('AdminPanel displays dashboard totals', async () => {
    mount(<AdminPanel />)
    await waitFor(() => expect(within(screen.getByText('Total Events').parentElement).getByText('5')).toBeInTheDocument())
    expect(api.fetchDashboard).toHaveBeenCalledOnce()
    expect(screen.getByText('Total Events')).toBeInTheDocument()
  })
  it('groups analytics into tabs without refetching the dashboard', async () => {
    mount(<AdminPanel />)
    await waitFor(() => expect(api.fetchDashboard).toHaveBeenCalledOnce())
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: 'Events' }))
    expect(screen.getByRole('heading', { name: 'Events by category' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Events by status' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Member growth' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Feedback' }))
    expect(screen.getByRole('heading', { name: 'Rating distribution' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Events by category' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Members' }))
    expect(screen.getByRole('heading', { name: 'Member growth' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Participation' }))
    expect(screen.getByRole('heading', { name: 'Registrations per event' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Most popular events' })).toBeInTheDocument()
    expect(api.fetchDashboard).toHaveBeenCalledOnce()
  })
  it('supports arrow-key navigation between tabs', async () => {
    mount(<AdminPanel />)
    screen.getByRole('tab', { name: 'Overview' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Events' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Events' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Members' })).toHaveFocus()
  })
})
