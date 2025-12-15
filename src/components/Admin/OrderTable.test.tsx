import { render, screen, fireEvent } from '@testing-library/react'
import OrderTable from './OrderTable'

const mockOrders = [
    {
        id: '1',
        created_at: '2023-12-25T12:00:00Z',
        sender_name: '홍길동',
        sender_phone: '010-1234-5678',
        receiver_name: '김철수',
        receiver_phone: '010-9876-5432',
        address: '서울시 강남구',
        product_type: '30구',
        quantity: 2,
        message: '감사합니다',
        status: 'pending'
    }
]

describe('OrderTable Component', () => {
    it('renders order details', () => {
        render(<OrderTable orders={mockOrders} onUpdateStatus={() => { }} />)
        expect(screen.getByText('홍길동')).toBeInTheDocument()
        expect(screen.getByText('김철수')).toBeInTheDocument()
        expect(screen.getByText('30구')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('서울시 강남구')).toBeInTheDocument()
    })

    it('renders empty message when no orders', () => {
        render(<OrderTable orders={[]} onUpdateStatus={() => { }} />)
        expect(screen.getByText('주문 내역이 없습니다.')).toBeInTheDocument()
    })

    it('calls onDelete when delete button is clicked', () => {
        const handleDelete = vi.fn()
        // Mock window.confirm
        global.confirm = vi.fn(() => true)

        render(<OrderTable orders={mockOrders} onUpdateStatus={() => { }} onDelete={handleDelete} />)

        const deleteButton = screen.getByRole('button', { name: /삭제/i })
        fireEvent.click(deleteButton)

        expect(handleDelete).toHaveBeenCalledWith('1')
    })
})
