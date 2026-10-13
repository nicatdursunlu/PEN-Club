import { mount } from './helpers'
import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { EventMetricChart } from '../../src/components/admin/DashboardAnalytics'

describe('EventMetricChart', () => {
  it('uses event DTO field names and links to the event editor', () => {
    mount(<EventMetricChart title="Registrations" entries={[{ eventSlug: 'new year', eventTitle: 'New Year', registrations: 8 }]} field="registrations" />)
    expect(screen.getByRole('link', { name: 'New Year' })).toHaveAttribute('href', '/admin/events/new%20year')
    expect(screen.getByLabelText('New Year: 8 registrations')).toBeInTheDocument()
  })
  it('shows feedback counts and fixed five-point ratings', () => {
    mount(<EventMetricChart title="Ratings" entries={[{ eventSlug: 'party', eventTitle: 'Party', averageRating: 4.5, feedbackCount: 2 }]} field="averageRating" rating />)
    expect(screen.getByText('4.5 / 5')).toBeInTheDocument()
    expect(screen.getByText('2 feedback entries')).toBeInTheDocument()
  })
})
