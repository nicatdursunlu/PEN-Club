import { mount } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import AdminPanel from '../../src/pages/admin/AdminPanel'
import * as api from '../../src/services/eventsService'

describe('AdminPanel', () => {
  it('AdminPanel displays dashboard totals', async () => {
    mount(<AdminPanel />)
    await waitFor(() => expect(within(screen.getByText('Total Events').parentElement).getByText('5')).toBeInTheDocument())
    expect(api.fetchDashboard).toHaveBeenCalledOnce()
    expect(screen.getByText('Total Events')).toBeInTheDocument()
  })
})
