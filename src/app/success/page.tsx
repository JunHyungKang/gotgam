"use client"

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BankAccountModal from '@/components/BankAccountModal'

function SuccessContent() {
    const [showModal, setShowModal] = useState(true)
    const searchParams = useSearchParams()
    const amount = searchParams.get('amount') ? Number(searchParams.get('amount')) : undefined

    return (
        <>
            <BankAccountModal isOpen={showModal} onClose={() => setShowModal(false)} amount={amount} />

            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-gotgam-orange/20">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gotgam-brown mb-4">주문이 완료되었습니다!</h1>
                <p className="text-gray-600 mb-6">
                    영동 곶감을 찾아주셔서 감사합니다.<br />
                    아래 계좌로 입금해 주시면<br />
                    확인 후 정성껏 포장하여 발송해 드리겠습니다.
                </p>

                {/* Persistent Bank Info */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                    <h3 className="font-bold text-gray-700 mb-2">입금 계좌 안내</h3>
                    <p className="text-sm text-gray-500 mb-1">우리은행</p>
                    <p className="text-xl font-bold text-gotgam-brown tracking-wider mb-2">1002-857-852325</p>
                    <p className="text-sm text-gray-600">예금주: 홍주희</p>
                </div>

                <Link
                    href="/"
                    className="inline-block bg-gotgam-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors w-full"
                >
                    메인으로 돌아가기
                </Link>
            </div>
        </>
    )
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gotgam-cream p-4">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    )
}
