"use client"

export default function OrderTable({ orders, onUpdateStatus, onDelete }: any) {
    if (!orders || orders.length === 0) {
        return <div className="p-8 text-center text-gray-500">주문 내역이 없습니다.</div>
    }

    const handleDeleteClick = (id: string) => {
        if (confirm('정말로 이 주문을 삭제하시겠습니까? 복구할 수 없습니다.')) {
            onDelete(id)
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
                        <th className="px-6 py-3">받는분</th>
                        <th className="px-6 py-3">연락처(받)</th>
                        <th className="px-6 py-3">주소</th>
                        <th className="px-6 py-3">상품</th>
                        <th className="px-6 py-3">수량</th>
                        <th className="px-6 py-3">상태</th>
                        <th className="px-6 py-3">관리</th>
                        <th className="px-6 py-3">삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order: any) => (
                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">
                                {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {order.sender_name}
                            </td>
                            <td className="px-6 py-4">{order.sender_phone}</td>
                            <td className="px-6 py-4">{order.receiver_name}</td>
                            <td className="px-6 py-4">{order.receiver_phone}</td>
                            <td className="px-6 py-4 truncate max-w-xs" title={order.address}>
                                {order.address}
                            </td>
                            <td className="px-6 py-4">{order.product_type}</td>
                            <td className="px-6 py-4">{order.quantity}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold
                  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'shipped' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                    {order.status === 'pending' ? '접수' :
                                        order.status === 'paid' ? '입금확인' :
                                            order.status === 'shipped' ? '발송완료' : order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <select
                                    value={order.status}
                                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-gotgam-orange focus:border-gotgam-orange block w-full p-2.5"
                                >
                                    <option value="pending">접수</option>
                                    <option value="paid">입금확인</option>
                                    <option value="shipped">발송완료</option>
                                </select>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleDeleteClick(order.id)}
                                    className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 hover:border-red-400 px-3 py-1 rounded transition-colors"
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
