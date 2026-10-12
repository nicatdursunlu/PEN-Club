import { mount, setSession, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import ProtectedRoute from '../../src/components/admin/ProtectedRoute'
import * as profile from '../../src/services/memberProfileService'
import { AUTH_CHANGE_EVENT } from '../../src/services/authStorage'

describe('ProtectedRoute', () => {
  it.each([[null, '/login'], [member, '/profile']])('ProtectedRoute redirects unauthorized sessions', (session, destination) => {
    setSession(session)
    mount(<ProtectedRoute><p>Secret</p></ProtectedRoute>, '/admin')
    expect(screen.getByTestId('location')).toHaveTextContent(destination)
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })
  it('ProtectedRoute renders admin content and reacts to logout', () => {
    setSession({ ...member, role: 'ADMIN' })
    mount(<ProtectedRoute><p>Secret</p></ProtectedRoute>, '/admin')
    expect(screen.getByText('Secret')).toBeInTheDocument()
    setSession(null)
    act(() => window.dispatchEvent(new Event(AUTH_CHANGE_EVENT)))
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
  })
})
