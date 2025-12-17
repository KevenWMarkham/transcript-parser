import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    const titleElement = screen.getByText(/Transcript Parser/i)
    expect(titleElement).toBeInTheDocument()
  })

  it('renders the counter button', () => {
    render(<App />)
    const buttonElement = screen.getByRole('button', { name: /count is 0/i })
    expect(buttonElement).toBeInTheDocument()
  })
})
