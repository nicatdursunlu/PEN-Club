import { mount } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import Gallery from '../../src/pages/Gallery'

describe('Gallery', () => {
  it('renders its main content', () => {
    mount(<Gallery />)
    expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument()
  })
})
