import './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from '../../src/App'

describe('App', () => {
  it('App shows public navigation on login', () => {
    window.history.replaceState({}, '', '/login')
    render(<App />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    window.history.replaceState({}, '', '/')
  })
})
