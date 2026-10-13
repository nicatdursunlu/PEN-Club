import { mount } from './helpers'
import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import DashboardAnalytics from '../../src/components/admin/DashboardAnalytics'

describe('DashboardAnalytics', () => {
  it('renders the supplied API aggregates and sorts months chronologically', () => {
    mount(<DashboardAnalytics data={{ totalMembers: 12, totalAdmins: 2, totalAttendees: 30, averageFeedbackRating: 4.2,
      eventsByStatus: { DRAFT: 1, PUBLISHED: 4, CANCELLED: 1, COMPLETED: 2 },
      eventsPerMonth: { '2026-02': 3, '2026-01': 2 }, memberGrowth: { '2026-02': 5, '2026-01': 7 },
      ratingDistribution: { '5': 8, '4': 2 }, registrationsPerEvent: [{ eventSlug: 'party', eventTitle: 'Party', registrations: 20 }],
      averageRatingByEvent: [{ eventSlug: 'party', eventTitle: 'Party', averageRating: 4.5, feedbackCount: 10 }],
      mostPopularEvents: [{ eventSlug: 'party', eventTitle: 'Party', registrations: 20, averageRating: 4.5, feedbackCount: 10 }],
    }} />)
    expect(screen.getByText('4.2 / 5')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Events by status: Draft 1, Published 4, Cancelled 1, Completed 2' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Events per month: 2026-01 2, 2026-02 3' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Member growth: 2026-01 7, 2026-02 5' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Party: 20 registrations' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Party: 4.5 out of 5' })).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
  it('handles missing data and zero ratings', () => {
    mount(<DashboardAnalytics />)
    expect(screen.getByText('No ratings yet')).toBeInTheDocument()
    expect(screen.getAllByText('No data yet.')).toHaveLength(7)
  })
  it('shows loading without empty data messages', () => {
    mount(<DashboardAnalytics loading />)
    expect(screen.queryByText('No data yet.')).not.toBeInTheDocument()
    expect(screen.getByText('Loading member growth…')).toBeInTheDocument()
  })
})
