import { mount } from './helpers'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import Hero from '../../src/components/Hero'

describe('Hero', () => {
  it('Hero links to events and about', () => {
    mount(<Hero />)
    expect(screen.getByRole('link', { name: 'Explore Events' })).toHaveAttribute('href', '/events')
    expect(screen.getByRole('link', { name: 'Learn More' })).toHaveAttribute('href', '/about')
  })
})
