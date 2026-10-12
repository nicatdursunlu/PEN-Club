import { mount } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import About from '../../src/pages/About'

describe('About', () => {
  it('renders its main content', () => {
    mount(<About />)
    expect(screen.getByRole('heading', { name: 'About PEN Club' })).toBeInTheDocument()
  })
})
