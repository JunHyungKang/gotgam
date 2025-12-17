import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

test('Home page renders correctly', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 2, name: /주문하기/i })).toBeDefined()
})
