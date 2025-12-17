"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

import { useRouter } from 'next/navigation'

import AddressSearchModal from './AddressSearchModal'

export default function OrderForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [senderPhone, setSenderPhone] = useState('')
    const [receiverPhone, setReceiverPhone] = useState('')
    const [senderName, setSenderName] = useState('')
    const [receiverName, setReceiverName] = useState('')
    
    // Address State Split
    const [senderBaseAddress, setSenderBaseAddress] = useState('')
    const [senderDetailAddress, setSenderDetailAddress] = useState('')
    const [receiverBaseAddress, setReceiverBaseAddress] = useState('')
    const [receiverDetailAddress, setReceiverDetailAddress] = useState('')

    // Address Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchTarget, setSearchTarget] = useState<'sender' | 'receiver'>('sender')

    const [isSameAsSender, setIsSameAsSender] = useState(false)

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/[^\d]/g, '')
        if (numbers.length <= 3) return numbers
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }

    const handleSenderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSenderName(value)
        if (isSameAsSender) {
            setReceiverName(value)
        }
    }

    const handleSenderPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = formatPhoneNumber(e.target.value)
        setSenderPhone(value)
        if (isSameAsSender) {
            setReceiverPhone(value)
        }
    }

    const handleSenderDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSenderDetailAddress(value)
        if (isSameAsSender) {
            setReceiverDetailAddress(value)
        }
    }

    // Modal Handlers
    const openSearch = (target: 'sender' | 'receiver') => {
        setSearchTarget(target)
        setIsSearchOpen(true)
    }

    const handleAddressComplete = (data: { address: string, zonecode: string }) => {
        if (searchTarget === 'sender') {
            setSenderBaseAddress(data.address)
            // If "same as sender" is checked, sync base address too
            if (isSameAsSender) {
                setReceiverBaseAddress(data.address)
            }
        } else {
            setReceiverBaseAddress(data.address)
        }
    }

    const handleSameAsSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        setIsSameAsSender(checked)
        if (checked) {
            setReceiverName(senderName)
            setReceiverPhone(senderPhone)
            setReceiverBaseAddress(senderBaseAddress)
            setReceiverDetailAddress(senderDetailAddress)
        }
    }

    const handleReceiverNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReceiverName(e.target.value)
    }

    const handleReceiverPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReceiverPhone(formatPhoneNumber(e.target.value))
    }

    const handleReceiverDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReceiverDetailAddress(e.target.value)
    }

    const [quantities, setQuantities] = useState<{ [key: string]: number }>({
        '30구': 1,
        '35구': 0
    })

    const handleQuantityChange = (product: string, val: number) => {
        if (val < 0) return
        setQuantities(prev => ({ ...prev, [product]: val }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const formData = new FormData(e.currentTarget)
        
        // Combine addresses
        const fullSenderAddress = `${senderBaseAddress} ${senderDetailAddress}`.trim()
        const fullReceiverAddress = `${receiverBaseAddress} ${receiverDetailAddress}`.trim()

        if (!senderBaseAddress || !receiverBaseAddress) {
            setMessage('주소를 검색하여 입력해주세요.')
            setLoading(false)
            return
        }

        const commonData = {
            sender_name: senderName,
            sender_phone: senderPhone,
            sender_address: fullSenderAddress,
            receiver_name: receiverName,
            receiver_phone: receiverPhone,
            address: fullReceiverAddress,
            message: formData.get('message'),
            status: 'pending'
        }

        // Prepare batch data
        const ordersToInsert = []
        let totalAmount = 0

        if (quantities['30구'] > 0) {
            ordersToInsert.push({ ...commonData, product_type: '30구', quantity: quantities['30구'] })
            totalAmount += quantities['30구'] * 40000
        }
        if (quantities['35구'] > 0) {
            ordersToInsert.push({ ...commonData, product_type: '35구', quantity: quantities['35구'] })
            totalAmount += quantities['35구'] * 40000
        }

        if (ordersToInsert.length === 0) {
            setMessage('최소 1개 이상의 상품을 선택해주세요.')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.from('orders').insert(ordersToInsert)
            if (error) throw error
            router.push(`/success?amount=${totalAmount}`)
        } catch (error) {
            console.error(error)
            setMessage('주문 접수 중 오류가 발생했습니다. 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="order-form" className="py-20 bg-white">
            <AddressSearchModal 
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onComplete={handleAddressComplete}
            />
            
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
                                    value={senderName}
                                    onChange={handleSenderNameChange}
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
                                    value={senderPhone}
                                    onChange={handleSenderPhoneChange}
                                    placeholder="010-0000-0000"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        
                        {/* Sender Address */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                보내는 분 주소
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={senderBaseAddress}
                                    placeholder="주소 검색을 클릭하세요"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none cursor-pointer"
                                    onClick={() => openSearch('sender')}
                                />
                                <button
                                    type="button"
                                    onClick={() => openSearch('sender')}
                                    className="px-4 py-2 bg-gotgam-brown text-white rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                                >
                                    주소 검색
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="상세 주소를 입력해주세요 (동, 호수 등)"
                                value={senderDetailAddress}
                                onChange={handleSenderDetailAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="bg-gotgam-cream/30 p-6 rounded-xl space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gotgam-brown">받는 분</h3>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="same_as_sender"
                                    checked={isSameAsSender}
                                    onChange={handleSameAsSenderChange}
                                    className="h-4 w-4 text-gotgam-orange focus:ring-gotgam-orange border-gray-300 rounded"
                                />
                                <label htmlFor="same_as_sender" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
                                    보내는 분과 동일
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="receiver_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    받는 분 성함
                                </label>
                                <input
                                    type="text"
                                    name="receiver_name"
                                    id="receiver_name"
                                    value={receiverName}
                                    onChange={handleReceiverNameChange}
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
                                    value={receiverPhone}
                                    onChange={handleReceiverPhoneChange}
                                    placeholder="010-0000-0000"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        
                        {/* Receiver Address */}
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">
                                받는 분 주소
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={receiverBaseAddress}
                                    placeholder="주소 검색을 클릭하세요"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none cursor-pointer"
                                    onClick={() => openSearch('receiver')}
                                />
                                <button
                                    type="button"
                                    onClick={() => openSearch('receiver')}
                                    className="px-4 py-2 bg-gotgam-brown text-white rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                                >
                                    주소 검색
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="상세 주소를 입력해주세요 (동, 호수 등)"
                                value={receiverDetailAddress}
                                onChange={handleReceiverDetailAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="bg-gotgam-cream/30 p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold text-gotgam-brown mb-4">주문 정보</h3>
                        <div className="space-y-6">
                            {/* Product 1: 30구 */}
                            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                <div>
                                    <p className="font-bold text-lg text-gray-800">30구 (대과)</p>
                                    <p className="text-gotgam-brown">40,000원</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange('30구', quantities['30구'] - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        value={quantities['30구']}
                                        onChange={(e) => handleQuantityChange('30구', parseInt(e.target.value) || 0)}
                                        className="w-16 text-center border border-gray-300 rounded-md py-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange('30구', quantities['30구'] + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Product 2: 35구 */}
                            <div className="flex justify-between items-center pb-2">
                                <div>
                                    <p className="font-bold text-lg text-gray-800">35구 (실속형)</p>
                                    <p className="text-gotgam-brown">40,000원</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange('35구', quantities['35구'] - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        value={quantities['35구']}
                                        onChange={(e) => handleQuantityChange('35구', parseInt(e.target.value) || 0)}
                                        className="w-16 text-center border border-gray-300 rounded-md py-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange('35구', quantities['35구'] + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total Price Estimate */}
                            <div className="bg-white p-4 rounded-lg flex justify-between items-center border border-orange-100">
                                <span className="font-bold text-gray-700">총 결제 예상 금액</span>
                                <span className="text-2xl font-bold text-gotgam-orange">
                                    {((quantities['30구'] * 40000) + (quantities['35구'] * 40000)).toLocaleString()}원
                                </span>
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
