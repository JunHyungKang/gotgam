import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer Component', () => {
    it('renders contact info', () => {
        render(<Footer />)
        expect(screen.getByText(/영동 곶감/i)).toBeInTheDocument()
        expect(screen.getByText(/계좌 안내/i)).toBeInTheDocument()
    })
})
