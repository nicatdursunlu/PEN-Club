import { mount } from './helpers'
import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
import { PopularEventsTable } from '../../src/components/admin/DashboardAnalytics'

describe('PopularEventsTable', () => {
  it('preserves server ranking and shows unrated events without a zero-star rating', () => {
    mount(<PopularEventsTable entries={[
      { eventSlug: 'first', eventTitle: 'First', registrations: 3, averageRating: 0, feedbackCount: 0 },
      { eventSlug: 'second', eventTitle: 'Second', registrations: 8, averageRating: 4, feedbackCount: 1 },
    ]} />)
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByRole('link', { name: 'First' })).toBeInTheDocument()
    expect(within(rows[1]).getByText('—')).toBeInTheDocument()
    expect(within(rows[2]).getByText('4.0 / 5')).toBeInTheDocument()
  })
})
