import { mount, member } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from '../../src/pages/Contact'

describe('Contact', () => {
  it('renders its main content', () => {
    mount(<Contact />)
    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument()
  })
  it('Contact submits entered fields and clears the form', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    mount(<Contact />)
    for (const [label, value] of [['Name', 'Jane'], ['Email', member.email], ['Subject', 'Hello'], ['Message', 'Test message']]) {
      fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value } })
    }
    await userEvent.click(screen.getByRole('button', { name: /Send Message/ }))
    expect(alert).toHaveBeenCalledOnce()
    expect(screen.getByLabelText(/Name/)).toHaveValue('')
  })
})
