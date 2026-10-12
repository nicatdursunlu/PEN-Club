import './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { Textarea } from '../../src/components/admin/EventForm'

describe('Textarea', () => {
  it('forwards textarea values and attributes', () => {
    render(<Textarea aria-label="Notes" defaultValue="Hello" rows={5} />)
    expect(screen.getByRole('textbox')).toHaveValue('Hello')
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
  })
})
