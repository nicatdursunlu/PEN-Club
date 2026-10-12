import { mount } from './helpers'
import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminNavbar from '../../src/components/admin/AdminNavbar'
import { logout } from '../../src/services/authService'

describe('AdminNavbar', () => {
  it.each([['/admin', 'Dashboard'], ['/admin/events', 'Events'], ['/admin/users', 'Users']])('marks the active page at %s', (path, label) => {
    mount(<AdminNavbar />, path)
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'New Event' })).toHaveAttribute('href', '/admin/events/new')
  })
  it('logs out and opens the shared login', async () => {
    mount(<AdminNavbar />, '/admin')
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }))
    expect(logout).toHaveBeenCalledOnce()
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
  })
})
