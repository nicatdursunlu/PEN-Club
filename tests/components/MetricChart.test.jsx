import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricChart } from '../../src/components/admin/DashboardAnalytics'

describe('MetricChart', () => {
  it('renders a single-point line chart with an accessible value', () => {
    render(<MetricChart title="Growth" line items={[{ label: '2026-01', value: 3 }]} />)
    expect(screen.getByRole('img', { name: 'Growth: 2026-01 3' })).toBeInTheDocument()
    expect(screen.getByText('2026-01')).toBeInTheDocument()
  })
  it('handles zero values', () => {
    render(<MetricChart title="Growth" items={[{ label: '2026-01', value: 0 }]} />)
    expect(screen.getByText('No data yet.')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
