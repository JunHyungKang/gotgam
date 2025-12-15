"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

import { useRouter } from 'next/navigation'

export default function OrderForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const formData = new FormData(e.currentTarget)
        const data = {
            sender_name: formData.get('sender_name'),
            sender_phone: formData.get('sender_phone'),
            receiver_name: formData.get('receiver_name'),
            receiver_phone: formData.get('receiver_phone'),
            address: formData.get('address'),
            product_type: formData.get('product_type'),
            quantity: Number(formData.get('quantity')),
            message: formData.get('message'),
            status: 'pending' // Default status
        }

        try {
            const { error } = await supabase.from('orders').insert([data])
            if (error) throw error
            router.push('/success')
        } catch (error) {
            console.error(error)
            setMessage('주문 접수 중 오류가 발생했습니다. 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="order-form" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gotgam-brown mb-12">
                    주문하기
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sender Info */}
                    <div className="bg-gotgam-cream/30 p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold text-gotgam-brown mb-4">보내는 분</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    보내는 분 성함
                                </label>
                                <input
                                    type="text"
                                    name="sender_name"
                                    id="sender_name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="sender_phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    보내는 분 연락처
                                </label>
                                <input
                                    type="tel"
                                    name="sender_phone"
                                    id="sender_phone"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="bg-gotgam-cream/30 p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold text-gotgam-brown mb-4">받는 분</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="receiver_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    받는 분 성함
                                </label>
                                <input
                                    type="text"
                                    name="receiver_name"
                                    id="receiver_name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="receiver_phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    받는 분 연락처
                                </label>
                                <input
                                    type="tel"
                                    name="receiver_phone"
                                    id="receiver_phone"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                받는 분 주소
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="bg-gotgam-cream/30 p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold text-gotgam-brown mb-4">주문 정보</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">상품 선택</label>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="product_type"
                                        id="opt30"
                                        value="30구"
                                        defaultChecked
                                        className="h-4 w-4 text-gotgam-orange focus:ring-gotgam-orange border-gray-300"
                                    />
                                    <label htmlFor="opt30" className="ml-2 block text-gray-700">
                                        30구 (대과) - 40,000원
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="product_type"
                                        id="opt35"
                                        value="35구"
                                        className="h-4 w-4 text-gotgam-orange focus:ring-gotgam-orange border-gray-300"
                                    />
                                    <label htmlFor="opt35" className="ml-2 block text-gray-700">
                                        35구 (실속형) - 40,000원
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                수량
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                min="1"
                                defaultValue="1"
                                required
                                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                남기실 말씀 (선택)
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none resize-none"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg text-center ${message.includes('성공') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gotgam-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {loading ? '처리중...' : '주문하기'}
                    </button>
                </form>
            </div>
        </section>
    )
}
