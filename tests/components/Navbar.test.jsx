import { mount, setSession, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../../src/components/Navbar'
import * as auth from '../../src/services/authService'
import * as profile from '../../src/services/memberProfileService'
import { AUTH_CHANGE_EVENT } from '../../src/services/authStorage'

describe('Navbar', () => {
  it('Navbar toggles mobile menu and responds to authentication changes', async () => {
    const user = userEvent.setup()
    mount(<Navbar />)
    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true')
    setSession(member)
    act(() => window.dispatchEvent(new Event(AUTH_CHANGE_EVENT)))
    expect(screen.getByRole('link', { name: 'My profile' })).toHaveAttribute('href', '/profile')
    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(auth.logout).toHaveBeenCalledOnce()
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
  })
  it('Navbar gives admins an admin panel link', () => {
    setSession({ ...member, role: 'ADMIN' })
    mount(<Navbar />)
    expect(screen.getByRole('link', { name: 'Admin panel' })).toHaveAttribute('href', '/admin')
  })
})
