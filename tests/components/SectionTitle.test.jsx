import './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { SectionTitle } from '../../src/components/admin/EventForm'

describe('SectionTitle', () => {
  it('renders a section heading', () => {
    render(<SectionTitle>Details</SectionTitle>)
    expect(screen.getByRole('heading', { name: 'Details' })).toBeInTheDocument()
  })
})
