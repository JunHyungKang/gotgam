import { render, screen } from '@testing-library/react'
import ProductSection from './ProductSection'

describe('ProductSection Component', () => {
    it('renders product options', () => {
        render(<ProductSection />)
        expect(screen.getByText('프리미엄 선물세트 (30구)')).toBeInTheDocument()
        expect(screen.getByText('실속형 (35구)')).toBeInTheDocument()
    })

    it('renders prices', () => {
        render(<ProductSection />)
        const prices = screen.getAllByText('40,000원')
        expect(prices).toHaveLength(2)
    })

    it('does not render packaging info', () => {
        render(<ProductSection />)
        const packagingInfos = screen.queryAllByText(/고급 보자기 포장/i)
        expect(packagingInfos).toHaveLength(0)
    })
})
