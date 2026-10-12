import { mount, event } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Events from '../../src/pages/Events'
import * as api from '../../src/services/eventsService'

describe('Events', () => {
  it('Events renders API events and links to details', async () => {
    mount(<Events />)
    expect(await screen.findByText(event.title)).toBeInTheDocument()
    expect(api.fetchUpcomingEvents).toHaveBeenCalledOnce()
    expect(api.fetchPastEvents).toHaveBeenCalledOnce()
    await userEvent.click(screen.getByRole('button', { name: 'View Details' }))
    expect(screen.getByTestId('location')).toHaveTextContent('/events/party')
  })
})
