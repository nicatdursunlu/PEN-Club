import { mount } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import Home from '../../src/pages/Home'

describe('Home', () => {
  it('renders its main content', () => {
    mount(<Home />)
    expect(screen.getByRole('heading', { name: 'What We Offer' })).toBeInTheDocument()
  })
})
