import { mount, setSession, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import MemberRoute from '../../src/components/member/MemberRoute'
import * as profile from '../../src/services/memberProfileService'
import { AUTH_CHANGE_EVENT } from '../../src/services/authStorage'

describe('MemberRoute', () => {
  it('MemberRoute restricts profile access to members', () => {
    setSession(member)
    mount(<MemberRoute><p>Profile content</p></MemberRoute>, '/profile')
    expect(screen.getByText('Profile content')).toBeInTheDocument()
    setSession(null)
    act(() => window.dispatchEvent(new Event(AUTH_CHANGE_EVENT)))
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
  })
})
