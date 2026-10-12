import './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { Label } from '../../src/components/admin/EventForm'

describe('Label', () => {
  it('associates a label with its input and shows optional text', () => {
    render(<><Label htmlFor="name" optional>Name</Label><input id="name" /></>)
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })
})
