import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OrderForm from './OrderForm'
import { vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabaseClient', () => ({
    supabase: {
        from: () => ({
            insert: vi.fn().mockResolvedValue({ error: null })
        })
    }
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn()
    })
}))

describe('OrderForm Component', () => {
    it('renders all form fields', () => {
        render(<OrderForm />)
        expect(screen.getByLabelText(/보내는 분 성함/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/보내는 분 연락처/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/받는 분 성함/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/받는 분 연락처/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/받는 분 주소/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /주문하기/i })).toBeInTheDocument()
    })

    // it('shows validation error errors on empty submit', async () => {
    //   render(<OrderForm />)
    //   const submitButton = screen.getByRole('button', { name: /주문하기/i })
    //   fireEvent.click(submitButton)

    //   // Expect HTML5 validation or custom logic
    //   // For now, testing basic render is priority.
    // })
})
