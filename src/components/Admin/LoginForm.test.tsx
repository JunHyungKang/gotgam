import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from './LoginForm'
import { vi } from 'vitest'

describe('LoginForm Component', () => {
    it('renders password input and login button', () => {
        render(<LoginForm onLogin={vi.fn()} />)
        expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument()
    })

    it('calls onLogin with password when submitted', () => {
        const handleLogin = vi.fn()
        render(<LoginForm onLogin={handleLogin} />)

        const input = screen.getByLabelText(/비밀번호/i)
        const button = screen.getByRole('button', { name: /로그인/i })

        fireEvent.change(input, { target: { value: 'secret123' } })
        fireEvent.click(button)

        expect(handleLogin).toHaveBeenCalledWith('secret123')
    })
})
