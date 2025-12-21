"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AddressSearchModal from './AddressSearchModal'
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

type Recipient = {
    id: string
    name: string
    phone: string
    baseAddress: string
    detailAddress: string
    quantity30: number
    quantity35: number
    message: string
}

export default function OrderForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // Sender State
    const [senderName, setSenderName] = useState('')
    const [senderPhone, setSenderPhone] = useState('')
    const [senderBaseAddress, setSenderBaseAddress] = useState('')
    const [senderDetailAddress, setSenderDetailAddress] = useState('')

    // Multi-Recipient State
    const [recipients, setRecipients] = useState<Recipient[]>([{
        id: crypto.randomUUID(),
        name: '',
        phone: '',
        baseAddress: '',
        detailAddress: '',
        quantity30: 1, // Default to 1 box of 30구
        quantity35: 0,
        message: ''
    }])

    // Address Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchTargetIndex, setSearchTargetIndex] = useState<number | 'sender'>('sender')
    const [showConfirmation, setShowConfirmation] = useState(false)

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/[^\d]/g, '')
        if (numbers.length <= 3) return numbers
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }

    // Sender Handlers
    const handleSenderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSenderName(e.target.value)
    }

    const handleSenderPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSenderPhone(formatPhoneNumber(e.target.value))
    }

    const handleSenderDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSenderDetailAddress(e.target.value)
    }

    // Recipient Management
    const handleAddRecipient = () => {
        setRecipients(prev => [...prev, {
            id: crypto.randomUUID(),
            name: '',
            phone: '',
            baseAddress: '',
            detailAddress: '',
            quantity30: 0,
            quantity35: 0,
            message: ''
        }])
    }

    const handleRemoveRecipient = (index: number) => {
        if (recipients.length <= 1) return
        setRecipients(prev => prev.filter((_, i) => i !== index))
    }

    const handleRecipientChange = (index: number, field: keyof Recipient, value: string | number) => {
        setRecipients(prev => {
            const newRecipients = [...prev]
            if (field === 'phone' && typeof value === 'string') {
                newRecipients[index] = { ...newRecipients[index], [field]: formatPhoneNumber(value) }
            } else {
                newRecipients[index] = { ...newRecipients[index], [field]: value }
            }
            return newRecipients
        })
    }

    // "Same as Sender" Handler for specific recipient
    const handleSameAsSender = (index: number, checked: boolean) => {
        if (checked) {
            setRecipients(prev => {
                const newRecipients = [...prev]
                newRecipients[index] = {
                    ...newRecipients[index],
                    name: senderName,
                    phone: senderPhone,
                    baseAddress: senderBaseAddress,
                    detailAddress: senderDetailAddress
                }
                return newRecipients
            })
        }
    }

    // Address Search Handlers
    const openSearch = (targetIndex: number | 'sender') => {
        setSearchTargetIndex(targetIndex)
        setIsSearchOpen(true)
    }

    const handleAddressComplete = (data: { address: string, zonecode: string }) => {
        if (searchTargetIndex === 'sender') {
            setSenderBaseAddress(data.address)
        } else if (typeof searchTargetIndex === 'number') {
            handleRecipientChange(searchTargetIndex, 'baseAddress', data.address)
        }
    }

    // Calculation Logic
    const calculateRecipientCost = (r: Recipient) => {
        const productTotal = (r.quantity30 * 40000) + (r.quantity35 * 40000)
        const totalQuantity = r.quantity30 + r.quantity35
        // Shipping is free if quantity >= 2 for THIS recipient
        const shippingFee = totalQuantity >= 2 ? 0 : (totalQuantity > 0 ? 4000 : 0)

        return { productTotal, shippingFee, total: productTotal + shippingFee }
    }

    const totalStats = recipients.reduce((acc, r) => {
        const cost = calculateRecipientCost(r)
        return {
            productTotal: acc.productTotal + cost.productTotal,
            shippingFee: acc.shippingFee + cost.shippingFee,
            totalAmount: acc.totalAmount + cost.total,
            totalQuantity: acc.totalQuantity + r.quantity30 + r.quantity35
        }
    }, { productTotal: 0, shippingFee: 0, totalAmount: 0, totalQuantity: 0 })


    const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage('')

        const fullSenderAddress = `${senderBaseAddress} ${senderDetailAddress}`.trim()

        if (!senderBaseAddress) {
            setMessage('보내는 분 주소를 입력해주세요.')
            setLoading(false)
            return
        }

        // Validate Recipients
        for (let i = 0; i < recipients.length; i++) {
            const r = recipients[i]
            if (!r.baseAddress) {
                setMessage(`배송지 ${i + 1}의 주소를 입력해주세요.`)
                setLoading(false)
                return
            }
            if ((r.quantity30 + r.quantity35) === 0) {
                setMessage(`배송지 ${i + 1}의 상품 수량을 선택해주세요.`)
                setLoading(false)
                return
            }
        }

        // All validations passed, show confirmation modal
        setShowConfirmation(true)
    }

    const handleFinalSubmit = async () => {
        setLoading(true)
        const totalAmount = totalStats.totalAmount

        const groupId = crypto.randomUUID()
        const ordersToInsert = []

        for (const r of recipients) {
            const fullReceiverAddress = `${r.baseAddress} ${r.detailAddress}`.trim()
            const fullSenderAddress = `${senderBaseAddress} ${senderDetailAddress}`.trim()

            const commonData = {
                group_id: groupId,
                sender_name: senderName,
                sender_phone: senderPhone,
                sender_address: fullSenderAddress,
                receiver_name: r.name,
                receiver_phone: r.phone,
                address: fullReceiverAddress,
                message: r.message,
                status: 'pending'
            }

            if (r.quantity30 > 0) {
                ordersToInsert.push({ ...commonData, product_type: '30구', quantity: r.quantity30 })
            }
            if (r.quantity35 > 0) {
                ordersToInsert.push({ ...commonData, product_type: '35구', quantity: r.quantity35 })
            }
        }

        try {
            const { error } = await supabase.from('orders').insert(ordersToInsert)
            if (error) throw error

            // Send SMS Notification (Fire and Forget)
            const orderDetailsStr = recipients.map((r, i) => {
                const items = []
                if (r.quantity30 > 0) items.push(`- 프리미엄 선물세트(30구): ${r.quantity30}개`)
                if (r.quantity35 > 0) items.push(`- 실속형(35구): ${r.quantity35}개`)
                return `[배송지 ${i + 1}: ${r.name}]\n${items.join('\n')}\n주소: ${r.baseAddress} ${r.detailAddress}`
            }).join('\n\n')

            fetch('/api/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: senderPhone, // Notify the sender (buyer)
                    name: senderName,
                    orderDetails: orderDetailsStr,
                    totalAmount: totalAmount
                }),
            }).catch(err => console.error('SMS sending failed:', err))

            router.push(`/success?amount=${totalAmount}`)
        } catch (error) {
            console.error(error)
            setMessage('주문 접수 중 오류가 발생했습니다. 다시 시도해주세요.')
            setShowConfirmation(false)
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

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 bg-gotgam-brown text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">주문 내용 확인</h3>
                            <button onClick={() => setShowConfirmation(false)} className="text-white/80 hover:text-white transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                            <div className="space-y-4">
                                {recipients.map((r, i) => (
                                    <div key={r.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="mb-3 border-b border-gray-200 pb-2">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-gray-800">받는 분: {r.name}</span>
                                                <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-md whitespace-nowrap">배송지 {i + 1}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{r.baseAddress} {r.detailAddress}</p>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            {r.quantity30 > 0 && (
                                                <div className="flex justify-between">
                                                    <span>프리미엄 선물세트 (30구)</span>
                                                    <span className="font-bold">{r.quantity30}개</span>
                                                </div>
                                            )}
                                            {r.quantity35 > 0 && (
                                                <div className="flex justify-between">
                                                    <span>실속형 (35구)</span>
                                                    <span className="font-bold">{r.quantity35}개</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>총 수량</span>
                                    <span>{totalStats.totalQuantity}박스</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>상품 금액</span>
                                    <span>{totalStats.productTotal.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>배송비</span>
                                    <span>{totalStats.shippingFee.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between items-end pt-2 text-xl font-bold text-gotgam-brown">
                                    <span>총 결제 금액</span>
                                    <span className="text-gotgam-orange">{totalStats.totalAmount.toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={handleFinalSubmit}
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-gotgam-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? '처리중...' : '결제하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gotgam-brown mb-12">
                    주문하기
                </h2>

                <form onSubmit={handleInitialSubmit} className="space-y-8">
                    {/* Sender Info */}
                    <div className="bg-gotgam-cream/30 p-6 md:p-8 rounded-2xl space-y-6">
                        <h3 className="text-2xl font-bold text-gotgam-brown mb-4 border-b border-gotgam-brown/10 pb-4">보내는 분</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    성함
                                </label>
                                <input
                                    type="text"
                                    id="sender_name"
                                    value={senderName}
                                    onChange={handleSenderNameChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none transition-shadow"
                                    placeholder="홍길동"
                                />
                            </div>
                            <div>
                                <label htmlFor="sender_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    연락처
                                </label>
                                <input
                                    type="tel"
                                    id="sender_phone"
                                    value={senderPhone}
                                    onChange={handleSenderPhoneChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none transition-shadow"
                                    placeholder="010-0000-0000"
                                />
                            </div>
                        </div>

                        {/* Sender Address */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                주소
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={senderBaseAddress}
                                    placeholder="주소를 검색해주세요"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
                                    onClick={() => openSearch('sender')}
                                />
                                <button
                                    type="button"
                                    onClick={() => openSearch('sender')}
                                    className="px-4 py-3 bg-gotgam-brown text-white rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                                >
                                    검색
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="상세 주소를 입력해주세요"
                                value={senderDetailAddress}
                                onChange={handleSenderDetailAddressChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange focus:border-transparent outline-none transition-shadow"
                            />
                        </div>
                    </div>

                    {/* Recipients List */}
                    <div className="space-y-6">
                        {recipients.map((recipient, index) => (
                            <div key={recipient.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative">
                                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800">배송지 {index + 1}</h3>
                                    {recipients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRecipient(index)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            title="배송지 삭제"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                <div className="p-6 md:p-8 space-y-6">

                                    {/* Same as sender option */}
                                    <div className="flex justify-end">
                                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => handleSameAsSender(index, e.target.checked)}
                                                className="w-4 h-4 text-gotgam-orange rounded border-gray-300 focus:ring-gotgam-orange"
                                            />
                                            <span className="text-sm text-gray-500">보내는 분 정보와 동일</span>
                                        </label>
                                    </div>

                                    {/* Recipient Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">받는 분 성함</label>
                                            <input
                                                type="text"
                                                value={recipient.name}
                                                onChange={(e) => handleRecipientChange(index, 'name', e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">받는 분 연락처</label>
                                            <input
                                                type="tel"
                                                value={recipient.phone}
                                                onChange={(e) => handleRecipientChange(index, 'phone', e.target.value)}
                                                required
                                                placeholder="010-0000-0000"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Recipient Address */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">주소</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={recipient.baseAddress}
                                                placeholder="주소를 검색해주세요"
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
                                                onClick={() => openSearch(index)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => openSearch(index)}
                                                className="px-4 py-3 bg-gotgam-brown text-white rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                                            >
                                                검색
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="상세 주소를 입력해주세요"
                                            value={recipient.detailAddress}
                                            onChange={(e) => handleRecipientChange(index, 'detailAddress', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gotgam-orange outline-none"
                                        />
                                    </div>

                                    {/* Products */}
                                    <div className="bg-orange-50/50 p-6 rounded-xl space-y-4">
                                        <h4 className="font-bold text-gotgam-brown mb-2">주문 상품</h4>
                                        <div className="space-y-3">
                                            {/* 30구 */}
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-800">프리미엄 선물세트 (30구)</p>
                                                    <p className="text-sm text-gray-500">40,000원</p>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white px-2 py-1 rounded-lg border border-orange-100">
                                                    <button type="button" onClick={() => handleRecipientChange(index, 'quantity30', Math.max(0, recipient.quantity30 - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gotgam-orange font-bold text-xl">-</button>
                                                    <span className="w-8 text-center font-bold text-gray-800">{recipient.quantity30}</span>
                                                    <button type="button" onClick={() => handleRecipientChange(index, 'quantity30', recipient.quantity30 + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gotgam-orange font-bold text-xl">+</button>
                                                </div>
                                            </div>

                                            {/* 35구 */}
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-800">실속형 (35구)</p>
                                                    <p className="text-sm text-gray-500">40,000원</p>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white px-2 py-1 rounded-lg border border-orange-100">
                                                    <button type="button" onClick={() => handleRecipientChange(index, 'quantity35', Math.max(0, recipient.quantity35 - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gotgam-orange font-bold text-xl">-</button>
                                                    <span className="w-8 text-center font-bold text-gray-800">{recipient.quantity35}</span>
                                                    <button type="button" onClick={() => handleRecipientChange(index, 'quantity35', recipient.quantity35 + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gotgam-orange font-bold text-xl">+</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="pt-2">
                                            <input
                                                type="text"
                                                placeholder="배송 희망일(최대한 맞춰드립니다) / 포장용 보자기가 필요하면 동봉해드립니다"
                                                value={recipient.message}
                                                onChange={(e) => handleRecipientChange(index, 'message', e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-gotgam-orange outline-none"
                                            />
                                        </div>

                                        {/* Individual Stats */}
                                        <div className="pt-4 border-t border-orange-100 flex justify-between items-center text-sm">
                                            <span className="text-gray-600">배송비</span>
                                            <span className={`font-bold ${calculateRecipientCost(recipient).shippingFee === 0 ? 'text-gotgam-orange' : 'text-gray-800'}`}>
                                                {calculateRecipientCost(recipient).shippingFee === 0 ? '무료' : '4,000원'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Recipient Button */}
                    <button
                        type="button"
                        onClick={handleAddRecipient}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-gotgam-orange hover:text-gotgam-orange hover:bg-orange-50 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                        <PlusIcon className="w-5 h-5" />
                        배송지 추가하기
                    </button>

                    {/* Total Summary Sticky Card */}
                    <div className="sticky bottom-4 z-10">
                        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-lg bg-opacity-95">
                            <div className="flex justify-between items-end mb-4">
                                <div className="text-gray-400 text-sm">
                                    <p>총 {recipients.length}곳 배송</p>
                                    <p>상품 {totalStats.totalQuantity}박스</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 mb-1">총 결제 금액</p>
                                    <p className="text-3xl font-bold text-gotgam-orange leading-none">
                                        {totalStats.totalAmount.toLocaleString()}원
                                    </p>
                                </div>
                            </div>

                            {message && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || totalStats.totalQuantity === 0}
                                className="w-full bg-gotgam-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                {loading ? '처리중...' : '주문하기'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}
