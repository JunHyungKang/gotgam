"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function CheckOrderPage() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [searched, setSearched] = useState(false)

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSearched(true)
        setOrders([])

        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('sender_name', name)
                .eq('sender_phone', phone)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (err) {
            console.error(err)
            alert('조회 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gotgam-cream/20 py-20 px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gotgam-orange/10">
                <div className="bg-gotgam-brown p-6 text-center">
                    <h1 className="text-2xl font-bold text-white">주문 조회</h1>
                    <p className="text-gotgam-cream/80 text-sm mt-1">비회원 주문 내역 확인</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleLookup} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                주문자 성함 (보내는 분)
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                placeholder="예: 홍길동"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                주문자 연락처
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                placeholder="예: 010-1234-5678"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gotgam-orange text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? '조회 중...' : '내역 확인하기'}
                        </button>
                    </form>

                    {searched && (
                        <div className="mt-8 border-t pt-6">
                            <h2 className="font-bold text-lg mb-4 text-gray-800">조회 결과</h2>
                            {orders.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">일치하는 주문 내역이 없습니다.</p>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                                <span className={`text-xs font-bold px-2 py-1 rounded
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'shipped' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                                    {order.status === 'pending' ? '접수완료' :
                                                        order.status === 'paid' ? '입금확인' :
                                                            order.status === 'shipped' ? '발송완료' : order.status}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-700">
                                                <p><span className="font-medium">상품:</span> {order.product_type} ({order.quantity}개)</p>
                                                <p><span className="font-medium">받는 분:</span> {order.receiver_name}</p>
                                                <p><span className="font-medium">주소:</span> {order.address}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-gotgam-orange underline">
                            메인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
