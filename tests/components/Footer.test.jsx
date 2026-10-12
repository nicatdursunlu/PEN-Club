import { mount } from './helpers'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import Footer from '../../src/components/Footer'

describe('Footer', () => {
  it('Footer exposes navigation and safely opens social links', () => {
    mount(<Footer />)
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events')
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()} PEN Club`))).toBeInTheDocument()
  })
})
