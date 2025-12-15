import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero Component', () => {
    it('renders the main heading', () => {
        render(<Hero />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toHaveTextContent(/영동 곶감/i)
    })

    it('renders the order button', () => {
        render(<Hero />)
        const button = screen.getByRole('button', { name: /주문하기/i })
        expect(button).toBeInTheDocument()
    })

    it('renders background image', () => {
        render(<Hero />)
        const img = screen.getByAltText(/영동 곶감 배경/i)
        expect(img).toBeInTheDocument()
    })
})
