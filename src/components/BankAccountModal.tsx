"use client"

import { useState, useEffect } from 'react'

interface BankAccountModalProps {
    isOpen: boolean
    onClose: () => void
    amount?: number
}

export default function BankAccountModal({ isOpen, onClose, amount }: BankAccountModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gotgam-orange p-4 text-center">
                    <h3 className="text-xl font-bold text-white">입금 안내</h3>
                </div>
                <div className="p-6 text-center space-y-4">
                    <p className="text-gray-600">
                        아래 계좌로 입금해 주시면<br />
                        확인 후 배송 준비를 시작합니다.
                    </p>
                    
                    {amount && amount > 0 && (
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <p className="text-sm text-gray-600 mb-1">입금하실 금액</p>
                            <p className="text-2xl font-bold text-gotgam-orange">
                                {amount.toLocaleString()}원
                            </p>
                        </div>
                    )}

                    <div className="bg-gray-100 p-4 rounded-xl border-2 border-gotgam-orange/20">
                        <p className="text-sm text-gray-500 mb-1">우리은행</p>
                        <p className="text-2xl font-bold text-gray-800 tracking-wider">1002-857-852325</p>
                        <p className="text-sm text-gray-600 mt-1">예금주: 홍주희</p>
                    </div>
                    <p className="text-xs text-red-500">
                        * 주문자 성함과 입금자 성함이 다를 경우<br />
                        꼭 연락 부탁드립니다.
                    </p>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-gotgam-brown text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                        확인했습니다
                    </button>
                </div>
            </div>
        </div>
    )
}
