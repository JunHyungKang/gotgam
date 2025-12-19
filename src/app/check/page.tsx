"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import BankAccountModal from '@/components/BankAccountModal'

type Order = {
    id: string
    created_at: string
    sender_name: string
    sender_phone: string
    sender_address: string
    receiver_name: string
    receiver_phone: string
    address: string
    product_type: string
    quantity: number
    status: string
    group_id?: string
    message?: string
}

export default function CheckOrderPage() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState<Order[]>([])
    const [searched, setSearched] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0)

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/[^\d]/g, '')
        if (numbers.length <= 3) return numbers
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhoneNumber(e.target.value))
    }

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSearched(true)
        setOrders([])
        setShowModal(false)
        setTotalAmount(0)

        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('sender_name', name)
                .eq('sender_phone', phone)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
            
            if (data && data.length > 0) {
                // Calculate Total Pending Amount
                const pendingOrders = data.filter((order: Order) => order.status === 'pending')
                
                // Group by Group ID first
                const groups: { [key: string]: Order[] } = {}
                pendingOrders.forEach((order: Order) => {
                    const key = order.group_id || order.id
                    if (!groups[key]) groups[key] = []
                    groups[key].push(order)
                })

                let pendingTotal = 0
                
                Object.values(groups).forEach(group => {
                    // Within a group, we need to group by Recipient (Address/Name) to calculate shipping
                    // Key: receiver_name + address
                    const recipientGroups: { [key: string]: Order[] } = {}
                    group.forEach(order => {
                        const key = `${order.receiver_name}-${order.address}`
                        if (!recipientGroups[key]) recipientGroups[key] = []
                        recipientGroups[key].push(order)
                    })

                    Object.values(recipientGroups).forEach(rGroup => {
                        const rQty = rGroup.reduce((sum, o) => sum + o.quantity, 0)
                        const rProductTotal = rGroup.reduce((sum, o) => sum + (o.quantity * 40000), 0)
                        const rShipping = rQty >= 2 ? 0 : 4000
                        pendingTotal += rProductTotal + rShipping
                    })
                })
                
                setTotalAmount(pendingTotal)
                setShowModal(true)
            }
        } catch (err) {
            console.error(err)
            alert('조회 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gotgam-cream/20 py-20 px-4">
            <BankAccountModal isOpen={showModal} onClose={() => setShowModal(false)} amount={totalAmount} />
            
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gotgam-orange/10">
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
                                onChange={handlePhoneChange}
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
                            
                            {/* Bank Info Section */}
                            {orders.length > 0 && (
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <span className="w-2 h-2 bg-gotgam-orange rounded-full mr-2"></span>
                                        입금 계좌 안내
                                    </h3>
                                    {totalAmount > 0 ? (
                                        <div className="mb-3 pb-3 border-b border-yellow-200">
                                            <p className="text-sm text-gray-600">총 입금하실 금액 (배송비 포함)</p>
                                            <p className="text-xl font-bold text-gotgam-orange">{totalAmount.toLocaleString()}원</p>
                                        </div>
                                    ) : (
                                        <div className="mb-3 pb-3 border-b border-yellow-200">
                                            <p className="text-sm text-gray-600">모든 주문이 결제 완료되었습니다.</p>
                                        </div>
                                    )}
                                    <div className="text-sm space-y-1 text-gray-700 ml-4">
                                        <p>우리은행 <span className="font-bold text-lg text-gotgam-brown ml-1">1002-857-852325</span></p>
                                        <p>예금주: 홍주희</p>
                                    </div>
                                </div>
                            )}

                            <h2 className="font-bold text-lg mb-4 text-gray-800">조회 결과</h2>
                            {orders.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">일치하는 주문 내역이 없습니다.</p>
                            ) : (
                                <div className="space-y-6">
                                    {(() => {
                                        // Group by Group ID
                                        const groups: { [key: string]: Order[] } = {}
                                        orders.forEach((order) => {
                                            const key = order.group_id || order.id
                                            if (!groups[key]) groups[key] = []
                                            groups[key].push(order)
                                        })
                                        
                                        return Object.values(groups).map((group, groupIndex) => {
                                            const firstOrder = group[0]
                                            
                                            // Sub-group by Recipient Address/Name for calculation
                                            const recipientGroups: { [key: string]: Order[] } = {}
                                            group.forEach(order => {
                                                const key = `${order.receiver_name}-${order.address}`
                                                if (!recipientGroups[key]) recipientGroups[key] = []
                                                recipientGroups[key].push(order)
                                            })
                                            
                                            const recipientKeys = Object.keys(recipientGroups)
                                            let totalGroupAmount = 0
                                            
                                            // Pre-calculate total amount
                                            Object.values(recipientGroups).forEach(rGroup => {
                                                const qty = rGroup.reduce((sum, o) => sum + o.quantity, 0)
                                                const shipping = qty >= 2 ? 0 : 4000
                                                const prod = rGroup.reduce((sum, o) => sum + (o.quantity * 40000), 0)
                                                totalGroupAmount += prod + shipping
                                            })

                                            return (
                                                <div key={groupIndex} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                    
                                                    {/* Header */}
                                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(firstOrder.created_at).toLocaleDateString()}
                                                            <span className="mx-2">|</span>
                                                            <span className="font-bold text-gotgam-brown">{recipientKeys.length}곳 배송</span>
                                                        </div>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded
                                                            ${firstOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                firstOrder.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                                                    firstOrder.status === 'shipped' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                                            {firstOrder.status === 'pending' ? '접수완료' :
                                                                firstOrder.status === 'paid' ? '입금확인' :
                                                                    firstOrder.status === 'shipped' ? '발송완료' : firstOrder.status}
                                                        </span>
                                                    </div>

                                                    {/* Recipient Lists */}
                                                    <div className="divide-y divide-gray-100">
                                                        {Object.values(recipientGroups).map((rGroup, idx) => {
                                                            const rFirst = rGroup[0]
                                                            const rQty = rGroup.reduce((sum, o) => sum + o.quantity, 0)
                                                            const shippingFee = rQty >= 2 ? 0 : 4000
                                                            
                                                            return (
                                                                <div key={idx} className="p-4">
                                                                    <div className="flex justify-between mb-2">
                                                                        <div>
                                                                            <p className="font-bold text-gray-800">{rFirst.receiver_name}</p>
                                                                            <p className="text-xs text-gray-400">{rFirst.address}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className={`text-xs px-2 py-1 rounded-full ${shippingFee === 0 ? 'bg-orange-100 text-gotgam-orange' : 'bg-gray-100 text-gray-500'}`}>
                                                                                {shippingFee === 0 ? '배송비 무료' : '배송비 4,000원'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Products for this recipient */}
                                                                    <div className="space-y-1 ml-2 border-l-2 border-gray-100 pl-3">
                                                                        {rGroup.map((item) => (
                                                                            <div key={item.id} className="flex justify-between text-sm">
                                                                                <span className="text-gray-600">{item.product_type} <span className="text-gray-400">x {item.quantity}</span></span>
                                                                                <span className="font-medium">{(item.quantity * 40000).toLocaleString()}원</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Footer Summary */}
                                                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-sm">
                                                        <span className="text-gray-600">총 결제 금액</span>
                                                        <span className="text-lg font-bold text-gotgam-orange">{totalGroupAmount.toLocaleString()}원</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    })()}
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
