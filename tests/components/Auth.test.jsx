import { mount, setSession, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Auth from '../../src/pages/Auth'
import * as auth from '../../src/services/authService'
import * as profile from '../../src/services/memberProfileService'

describe('Auth', () => {
  it.each([false, true])('Auth toggles password visibility (register=%s)', async (register) => {
    mount(<Auth register={register} />)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    expect(auth.login).not.toHaveBeenCalled()
  })
  it.each([['ADMIN', '/admin'], ['MEMBER', '/profile']])('Auth routes %s after sign in', async (role, destination) => {
    auth.login.mockImplementation(async () => setSession({ ...member, role }))
    mount(<Auth />, '/login')
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: member.email } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(destination))
    expect(auth.login).toHaveBeenCalledWith(member.email, 'password123')
  })
  it('Auth shows backend sign-in errors', async () => {
    auth.login.mockRejectedValue(new Error('Invalid credentials'))
    mount(<Auth />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: member.email } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
  })
  it('Auth registers the entered account', async () => {
    auth.register.mockResolvedValue(false)
    mount(<Auth register />, '/register')
    for (const [label, value] of [['First name', 'Jane'], ['Last name', 'Doe'], ['Email', member.email], ['Password', 'password123']]) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    }
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))
    expect(auth.register).toHaveBeenCalledWith({ firstName: 'Jane', lastName: 'Doe', email: member.email, password: 'password123' })
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'))
  })
})
