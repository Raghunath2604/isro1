import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../components/Header'
import { ThemeProvider } from '../context/ThemeContext'

describe('Header Component', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    )
  }

  it('renders header without crashing', () => {
    renderWithTheme(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('displays AS³ Platform title', () => {
    renderWithTheme(<Header />)
    const title = screen.queryByText(/AS³/i)
    expect(title).toBeInTheDocument()
  })

  it('shows connection status indicator', () => {
    renderWithTheme(<Header />)
    expect(screen.getByText(/Connected|Offline/i)).toBeInTheDocument()
  })

  it('displays current time', () => {
    renderWithTheme(<Header />)
    const timeElements = screen.queryAllByText(/\d{2}:\d{2}:\d{2}/)
    expect(timeElements.length).toBeGreaterThan(0)
  })
})
