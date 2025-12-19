"use client"

import { useMemo } from 'react'

export default function OrderTable({ orders, onUpdateStatus, onDelete, onRestore, onPermanentDelete, viewMode = 'active' }: any) {
    if (!orders || orders.length === 0) {
        return <div className="p-8 text-center text-gray-500">
            {viewMode === 'active' ? '주문 내역이 없습니다.' : '휴지통이 비었습니다.'}
        </div>
    }

    // Advanced Grouping: Group by ID -> Then by Recipient
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
        const sortedGroups = Object.values(groups).sort((a, b) => 
            new Date(b[0].created_at).getTime() - new Date(a[0].created_at).getTime()
        )

        // Process each group to structure it for rendering
        return sortedGroups.map(group => {
            // Sub-group by Recipient (Name + Address)
            const recipientMap: { [key: string]: any[] } = {}
            const recipientOrder: string[] = [] // To maintain order
            
            group.forEach(order => {
                const key = `${order.receiver_name}|${order.address}`
                if (!recipientMap[key]) {
                    recipientMap[key] = []
                    recipientOrder.push(key)
                }
                recipientMap[key].push(order)
            })

            return {
                groupItems: group,
                recipientGroups: recipientOrder.map(key => recipientMap[key])
            }
        })
    }, [orders])

    // Bulk Actions
    const onGroupUpdateStatus = (group: any[], status: string) => {
        if (!confirm('이 그룹의 모든 주문 상태를 변경하시겠습니까?')) return
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
                        
                        <th className="px-6 py-3 border-l border-gray-200">받는분</th>
                        <th className="px-6 py-3">연락처(받)</th>
                        <th className="px-6 py-3">주소</th>
                        <th className="px-6 py-3">상품</th>
                        <th className="px-6 py-3">수량</th>
                        <th className="px-6 py-3 text-right">금액</th>
                        
                        <th className="px-6 py-3 border-l border-gray-200">상태</th>
                        <th className="px-6 py-3">관리</th>
                        <th className="px-6 py-3">삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedOrders.map((groupData, groupIndex) => {
                        const { groupItems, recipientGroups } = groupData
                        const totalGroupRows = groupItems.length
                        const firstOrder = groupItems[0]
                        const isGroup = totalGroupRows > 1

                        // Calculate total group amount for reference if needed, 
                        // but usually we want per-row or per-recipient breakdown?
                        // Let's show Recipient-level calculation in the Amount column.

                        return recipientGroups.map((rGroup, rIndex) => {
                            // rGroup contains items for ONE recipient
                            return rGroup.map((order, oIndex) => {
                                const isFirstOfGroup = (rIndex === 0 && oIndex === 0)
                                const isFirstOfRecipient = (oIndex === 0)
                                
                                // Calculate cost for this recipient
                                const rTotalQty = rGroup.reduce((sum: number, o: any) => sum + o.quantity, 0)
                                const rShipping = rTotalQty >= 2 ? 0 : 4000
                                const rProductTotal = rGroup.reduce((sum: number, o: any) => sum + (o.quantity * 40000), 0)
                                const rTotalAmount = rProductTotal + rShipping

                                return (
                                    <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                        {/* Sender Columns - RowSpan for entire Order Group */}
                                        {isFirstOfGroup && (
                                            <>
                                                <td rowSpan={totalGroupRows} className="px-6 py-4 align-top border-r border-gray-100 bg-gray-50/30">
                                                    {new Date(firstOrder.created_at).toLocaleDateString()}
                                                    {isGroup && <span className="block text-xs text-gotgam-orange font-bold mt-1">({recipientGroups.length}곳)</span>}
                                                </td>
                                                <td rowSpan={totalGroupRows} className="px-6 py-4 align-top font-medium text-gray-900 bg-gray-50/30">
                                                    {firstOrder.sender_name}
                                                </td>
                                                <td rowSpan={totalGroupRows} className="px-6 py-4 align-top bg-gray-50/30">
                                                    {firstOrder.sender_phone}
                                                    <div className="text-xs text-gray-400 mt-1">{firstOrder.sender_address}</div>
                                                </td>
                                            </>
                                        )}

                                        {/* Recipient Columns - RowSpan for Recipient Group */}
                                        {isFirstOfRecipient && (
                                            <>
                                                <td rowSpan={rGroup.length} className="px-6 py-4 align-top border-l border-gray-100 font-medium text-gray-900">
                                                    {order.receiver_name}
                                                </td>
                                                <td rowSpan={rGroup.length} className="px-6 py-4 align-top">
                                                    {order.receiver_phone}
                                                </td>
                                                <td rowSpan={rGroup.length} className="px-6 py-4 align-top whitespace-normal max-w-[200px]">
                                                    {order.address}
                                                    {order.message && (
                                                        <div className="text-xs text-blue-500 mt-1 bg-blue-50 p-1 rounded">
                                                            Msg: {order.message}
                                                        </div>
                                                    )}
                                                </td>
                                            </>
                                        )}

                                        {/* Product Columns - Individual */}
                                        <td className="px-6 py-4 border-l border-gray-50">
                                            {order.product_type}
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {order.quantity}
                                        </td>

                                        {/* Amount - RowSpan for Recipient Group to show total for that address */}
                                        {isFirstOfRecipient && (
                                            <td rowSpan={rGroup.length} className="px-6 py-4 align-top text-right border-l border-gray-50">
                                                <div className="font-bold text-gray-900">{rTotalAmount.toLocaleString()}원</div>
                                                <div className={`text-xs mt-1 ${rShipping === 0 ? 'text-gotgam-orange' : 'text-gray-400'}`}>
                                                    {rShipping === 0 ? '배송비 무료' : '배송비 4,000'}
                                                </div>
                                            </td>
                                        )}

                                        {/* Actions - RowSpan for entire Order Group (Assuming status is managed per group usually, but code allows individual) */}
                                        {/* Actually, for 'Group Update', we want one control for the whole group.
                                            Let's put it on the first row of the group. */}
                                        {isFirstOfGroup && (
                                            <>
                                                <td rowSpan={totalGroupRows} className="px-6 py-4 align-top border-l border-gray-200 bg-gray-50/30">
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
                                                <td rowSpan={totalGroupRows} className="px-6 py-4 align-top bg-gray-50/30">
                                                    {viewMode === 'active' ? (
                                                        <select
                                                            value={firstOrder.status}
                                                            onChange={(e) => onGroupUpdateStatus(groupItems, e.target.value)}
                                                            className="bg-white border border-gray-300 text-gray-900 text-xs rounded focus:ring-gotgam-orange focus:border-gotgam-orange block w-full p-2"
                                                        >
                                                            <option value="pending">접수</option>
                                                            <option value="paid">입금확인</option>
                                                            <option value="shipped">발송완료</option>
                                                            <option value="cancelled">취소</option>
                                                        </select>
                                                    ) : (
                                                        <button
                                                            onClick={() => onGroupRestore(groupItems)}
                                                            className="text-green-600 hover:text-green-800 font-medium text-xs border border-green-200 hover:border-green-400 px-3 py-1 rounded transition-colors"
                                                        >
                                                            복구
                                                        </button>
                                                    )}
                                                </td>
                                                <td rowSpan={totalGroupRows} className="px-6 py-4 align-top bg-gray-50/30">
                                                    {viewMode === 'active' ? (
                                                        <button
                                                            onClick={() => onGroupDelete(groupItems)}
                                                            className="text-gray-500 hover:text-red-600 font-medium text-xs border border-gray-200 hover:border-red-300 px-3 py-1 rounded transition-colors"
                                                        >
                                                            휴지통
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => onGroupPermanentDelete(groupItems)}
                                                            className="text-red-600 hover:text-red-800 font-bold text-xs border border-red-200 hover:border-red-400 px-3 py-1 rounded transition-colors bg-red-50"
                                                        >
                                                            영구삭제
                                                        </button>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                )
                            })
                        })
                    })}
                </tbody>
            </table>
        </div>
    )
}
