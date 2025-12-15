import { render, screen } from '@testing-library/react'
import ProductSection from './ProductSection'

describe('ProductSection Component', () => {
    it('renders product options', () => {
        render(<ProductSection />)
        expect(screen.getByText('30구 (대과)')).toBeInTheDocument()
        expect(screen.getByText('35구 (실속형)')).toBeInTheDocument() // Adjusted text for 35 count
    })

    it('renders prices', () => {
        render(<ProductSection />)
        const prices = screen.getAllByText('40,000원')
        expect(prices).toHaveLength(2)
    })

    it('renders packaging info', () => {
        render(<ProductSection />)
        const packagingInfos = screen.getAllByText(/고급 보자기 포장/i)
        expect(packagingInfos).toHaveLength(2)
    })
})
