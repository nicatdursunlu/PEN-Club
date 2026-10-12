import { mount, page } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import Router from '../../src/components/Router'
import * as api from '../../src/services/eventsService'

describe('Router', () => {
  it('Router renders the shared login page', () => {
    mount(<Router />, '/login', 'router')
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
  })
  it('Router protects admin pages', () => {
    mount(<Router />, '/admin/events', 'router')
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
    expect(api.fetchAllEvents).not.toHaveBeenCalled()
  })
})
