import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from '../components/Dashboard'

describe('Dashboard Component', () => {
  it('renders dashboard without crashing', () => {
    render(<Dashboard />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays tab navigation', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('ISS Tracking')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Alerts')).toBeInTheDocument()
  })

  it('has correct initial tab selected', () => {
    render(<Dashboard />)
    const dashboardTab = screen.getByText('Dashboard').closest('button')
    expect(dashboardTab).toHaveClass('bg-gradient-to-r')
  })
})
