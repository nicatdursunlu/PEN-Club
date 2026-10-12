import './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { Input } from '../../src/components/admin/EventForm'

describe('Input', () => {
  it('forwards input attributes and values', () => {
    render(<Input aria-label="Name" disabled defaultValue="Jane" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('textbox')).toHaveValue('Jane')
  })
})
