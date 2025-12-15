"use client"

import { useState } from 'react'

export default function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onLogin(password)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <h2 className="text-2xl font-bold text-gotgam-brown">관리자 로그인</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm p-8 bg-white rounded-xl shadow-lg border border-gotgam-cream">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    비밀번호
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                    required
                />
                <button
                    type="submit"
                    className="bg-gotgam-brown text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors font-bold"
                >
                    로그인
                </button>
            </form>
        </div>
    )
}
