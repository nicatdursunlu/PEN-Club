import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardCharts from '../../src/components/admin/DashboardCharts'

describe('DashboardCharts', () => {
  it('renders category counts and upcoming/past proportions from API data', () => {
    render(<DashboardCharts eventsByCategory={{ PLAY: 4, ENJOY: 2, NETWORK: 1 }} upcomingCount={3} pastCount={7} />)
    expect(screen.getByRole('img', { name: 'Events by category: Play 4, Enjoy 2, Network 1' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Upcoming 3, past 7, total 10 events' })).toBeInTheDocument()
    expect(screen.getByText('Upcoming: 3 (30%)')).toBeInTheDocument()
    expect(screen.getByText('Past: 7 (70%)')).toBeInTheDocument()
  })
  it('handles missing/zero counts without drawing invalid charts', () => {
    render(<DashboardCharts />)
    expect(screen.getByText('No categorized events yet.')).toBeInTheDocument()
    expect(screen.getByText('No upcoming or past events yet.')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
  it('shows loading instead of misleading empty charts', () => {
    render(<DashboardCharts loading />)
    expect(screen.getByText('Loading category chart…')).toBeInTheDocument()
    expect(screen.getByText('Loading event timing chart…')).toBeInTheDocument()
    expect(screen.queryByText('No categorized events yet.')).not.toBeInTheDocument()
  })
  it.each([[5, 0, 'Upcoming: 5 (100%)'], [0, 5, 'Past: 5 (100%)']])('handles single-segment donut counts %s/%s', (upcomingCount, pastCount, legend) => {
    render(<DashboardCharts upcomingCount={upcomingCount} pastCount={pastCount} eventsByCategory={{ PLAY: 1 }} />)
    expect(screen.getByText(legend)).toBeInTheDocument()
  })
})
