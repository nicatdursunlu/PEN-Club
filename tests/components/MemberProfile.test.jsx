import { mount, setSession, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MemberProfile from '../../src/pages/member/MemberProfile'
import * as profile from '../../src/services/memberProfileService'

describe('MemberProfile', () => {
  it('MemberProfile loads server fields and saves edits', async () => {
    setSession(member)
    mount(<MemberProfile />)
    await waitFor(() => expect(screen.getByLabelText(/First name/)).toHaveValue('Jane'))
    fireEvent.change(screen.getByLabelText(/First name/), { target: { value: 'Janet' } })
    await userEvent.click(screen.getByRole('button', { name: /Save/ }))
    expect(profile.updateMemberProfile).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Janet', email: member.email }))
  })
})
