import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders initials from a full name', () => {
    render(<Avatar name="Carlos Rodríguez" />)
    expect(screen.getByText('CR')).toBeInTheDocument()
  })

  it('renders initials from a single name', () => {
    render(<Avatar name="Carlos" />)
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders initials uppercased', () => {
    render(<Avatar name="maría fernanda" />)
    expect(screen.getByText('MF')).toBeInTheDocument()
  })

  it('uses at most 2 initials', () => {
    render(<Avatar name="Juan Carlos Pérez Gómez" />)
    expect(screen.getByText('JC')).toBeInTheDocument()
  })

  it('renders sm size', () => {
    render(<Avatar name="Test" size="sm" data-testid="av" />)
    const el = screen.getByTestId('av')
    expect(el).toHaveStyle({ width: 'var(--yes-size-avatar-sm)' })
  })

  it('renders md size by default', () => {
    render(<Avatar name="Test" data-testid="av" />)
    const el = screen.getByTestId('av')
    expect(el).toHaveStyle({ width: 'var(--yes-size-avatar-md)' })
  })

  it('renders lg size', () => {
    render(<Avatar name="Test" size="lg" data-testid="av" />)
    const el = screen.getByTestId('av')
    expect(el).toHaveStyle({ width: 'var(--yes-size-avatar-lg)' })
  })

  it('shows image when src is provided', () => {
    render(<Avatar name="Test" src="https://example.com/img.jpg" alt="Foto de Test" />)
    expect(screen.getByRole('img', { name: 'Foto de Test' })).toBeInTheDocument()
  })

  it('passes data-testid to root', () => {
    render(<Avatar name="Test" data-testid="my-avatar" />)
    expect(screen.getByTestId('my-avatar')).toBeInTheDocument()
  })

  it('produces consistent color for the same name', () => {
    const { container: c1 } = render(<Avatar name="Carlos" data-testid="a1" />)
    const { container: c2 } = render(<Avatar name="Carlos" data-testid="a2" />)
    const bg1 = (c1.firstChild as HTMLElement).style.backgroundColor
    const bg2 = (c2.firstChild as HTMLElement).style.backgroundColor
    expect(bg1).toBe(bg2)
  })
})
