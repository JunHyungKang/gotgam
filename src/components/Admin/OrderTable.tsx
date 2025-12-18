"use client"

import { useMemo } from 'react'

export default function OrderTable({ orders, onUpdateStatus, onDelete, onRestore, onPermanentDelete, viewMode = 'active' }: any) {
    if (!orders || orders.length === 0) {
        return <div className="p-8 text-center text-gray-500">
            {viewMode === 'active' ? '주문 내역이 없습니다.' : '휴지통이 비었습니다.'}
        </div>
    }

    const groupedOrders = useMemo(() => {
        const groups: { [key: string]: any[] } = {}
        orders.forEach((order: any) => {
            const key = order.group_id || order.id
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(order)
        })
        // Sort groups by the most recent order in the group
        return Object.values(groups).sort((a, b) => 
            new Date(b[0].created_at).getTime() - new Date(a[0].created_at).getTime()
        )
    }, [orders])

    const handleDeleteClick = (id: string, isGroup: boolean) => {
        if (confirm(isGroup ? '이 그룹의 모든 주문을 휴지통으로 이동하시겠습니까?' : '휴지통으로 이동하시겠습니까?')) {
            onDelete(id)
        }
    }

    const handlePermanentDeleteClick = (id: string, isGroup: boolean) => {
        if (confirm('정말로 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            onPermanentDelete(id)
        }
    }

    const handleRestoreClick = (id: string, isGroup: boolean) => {
        if (confirm('주문을 복구하시겠습니까?')) {
            onRestore(id)
        }
    }

    // Helper to process group actions
    // Since the parent handlers take a single ID, we might need to update the parent to handle bulk or loop here.
    // For now, let's assume the parent might need to be updated OR we just call it for each ID in the group.
    // However, the cleanest UI is to have one button per group.
    // Let's modify the local handlers to call the passed handlers for each item if it's a group action.
    
    // Actually, looking at the previous code, the handlers take an ID.
    // To support group actions, I'll iterate here.
    const onGroupUpdateStatus = (group: any[], status: string) => {
        group.forEach(order => onUpdateStatus(order.id, status))
    }
    
    const onGroupDelete = (group: any[]) => {
        if (confirm(`주문 ${group.length}건을 휴지통으로 이동하시겠습니까?`)) {
            group.forEach(order => onDelete(order.id))
        }
    }

    const onGroupRestore = (group: any[]) => {
        if (confirm(`주문 ${group.length}건을 복구하시겠습니까?`)) {
            group.forEach(order => onRestore(order.id))
        }
    }

    const onGroupPermanentDelete = (group: any[]) => {
        if (confirm(`주문 ${group.length}건을 영구 삭제하시겠습니까?`)) {
            group.forEach(order => onPermanentDelete(order.id))
        }
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gotgam-brown uppercase bg-gotgam-cream">
                    <tr>
                        <th className="px-6 py-3">주문일시</th>
                        <th className="px-6 py-3">보내는분</th>
                        <th className="px-6 py-3">연락처(보)</th>
                        <th className="px-6 py-3">주소</th>
                        <th className="px-6 py-3">받는분</th>
                        <th className="px-6 py-3">상품</th>
                        <th className="px-6 py-3">수량</th>
                        <th className="px-6 py-3">결제금액</th>
                        <th className="px-6 py-3">상태</th>
                        <th className="px-6 py-3">관리</th>
                        <th className="px-6 py-3">삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedOrders.map((group) => {
                        const totalQuantity = group.reduce((sum, o) => sum + o.quantity, 0)
                        const productTotal = totalQuantity * 40000
                        const shippingFee = totalQuantity === 1 ? 4000 : 0
                        const totalAmount = productTotal + shippingFee
                        const firstOrder = group[0]
                        const isGroup = group.length > 1

                        return group.map((order, index) => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                {index === 0 && (
                                    <>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top border-r border-gray-100">
                                            {new Date(firstOrder.created_at).toLocaleDateString()}
                                            {isGroup && <span className="block text-xs text-gotgam-orange font-bold mt-1">(묶음)</span>}
                                        </td>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top font-medium text-gray-900">
                                            {firstOrder.sender_name}
                                        </td>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top">
                                            {firstOrder.sender_phone}
                                        </td>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top whitespace-normal break-words max-w-[200px]">
                                            <div className="text-xs text-gray-500 mb-1">보내는분: {firstOrder.sender_address || '-'}</div>
                                            <div className="text-xs text-gray-500">받는분: {firstOrder.address}</div>
                                        </td>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top">
                                            {firstOrder.receiver_name}<br/>
                                            <span className="text-xs text-gray-400">{firstOrder.receiver_phone}</span>
                                        </td>
                                    </>
                                )}
                                <td className="px-6 py-4 border-l border-gray-100">
                                    {order.product_type}
                                </td>
                                <td className="px-6 py-4">
                                    {order.quantity}
                                </td>
                                {index === 0 && (
                                    <td rowSpan={group.length} className="px-6 py-4 align-top font-bold text-gray-900 border-l border-gray-100">
                                        {totalAmount.toLocaleString()}원
                                        {shippingFee > 0 && <span className="block text-xs text-gray-400 font-normal">(배송비 4,000)</span>}
                                    </td>
                                )}
                                {index === 0 && (
                                    <>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top">
                                            <span className={`px-2 py-1 rounded text-xs font-bold
                                                ${firstOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    firstOrder.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                                        firstOrder.status === 'shipped' ? 'bg-green-100 text-green-800' :
                                                            firstOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                                                {firstOrder.status === 'pending' ? '접수' :
                                                    firstOrder.status === 'paid' ? '입금' :
                                                        firstOrder.status === 'shipped' ? '발송' :
                                                            firstOrder.status === 'cancelled' ? '취소' : firstOrder.status}
                                            </span>
                                        </td>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top">
                                            {viewMode === 'active' ? (
                                                <select
                                                    value={firstOrder.status}
                                                    onChange={(e) => onGroupUpdateStatus(group, e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-gotgam-orange focus:border-gotgam-orange block w-full p-2.5"
                                                >
                                                    <option value="pending">접수</option>
                                                    <option value="paid">입금확인</option>
                                                    <option value="shipped">발송완료</option>
                                                </select>
                                            ) : (
                                                <button
                                                    onClick={() => onGroupRestore(group)}
                                                    className="text-green-600 hover:text-green-800 font-medium text-xs border border-green-200 hover:border-green-400 px-3 py-1 rounded transition-colors"
                                                >
                                                    복구
                                                </button>
                                            )}
                                        </td>
                                        <td rowSpan={group.length} className="px-6 py-4 align-top">
                                            {viewMode === 'active' ? (
                                                <button
                                                    onClick={() => onGroupDelete(group)}
                                                    className="text-gray-500 hover:text-red-600 font-medium text-xs border border-gray-200 hover:border-red-300 px-3 py-1 rounded transition-colors"
                                                >
                                                    휴지통
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onGroupPermanentDelete(group)}
                                                    className="text-red-600 hover:text-red-800 font-bold text-xs border border-red-200 hover:border-red-400 px-3 py-1 rounded transition-colors bg-red-50"
                                                >
                                                    영구삭제
                                                </button>
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    })}
                </tbody>
            </table>
        </div>
    )
}
