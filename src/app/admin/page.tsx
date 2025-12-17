"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import LoginForm from '@/components/Admin/LoginForm'
import OrderTable from '@/components/Admin/OrderTable'

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const [viewMode, setViewMode] = useState<'active' | 'trash'>('active')

    const checkLogin = (password: string) => {
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'lovegotgam'
        if (password === adminPassword) {
            setIsAuthenticated(true)
            fetchOrders()
        } else {
            alert('비밀번호가 올바르지 않습니다.')
        }
    }

    const fetchOrders = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching orders:', error)
            alert('주문 목록을 불러오는데 실패했습니다.')
        } else {
            setOrders(data || [])
        }
        setLoading(false)
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)

        if (error) {
            console.error('Error updating status:', error)
            alert('상태 업데이트 실패')
        } else {
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
        }
    }

    const handleSoftDelete = async (id: string) => {
        await handleUpdateStatus(id, 'cancelled')
    }

    const handleRestore = async (id: string) => {
        await handleUpdateStatus(id, 'pending')
    }

    const handlePermanentDelete = async (id: string) => {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting order:', error)
            alert('삭제 실패했습니다.')
        } else {
            setOrders(orders.filter(o => o.id !== id))
        }
    }

    if (!isAuthenticated) {
        return <LoginForm onLogin={checkLogin} />
    }

    const filteredOrders = orders.filter(order => 
        viewMode === 'active' ? order.status !== 'cancelled' : order.status === 'cancelled'
    )

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gotgam-brown">주문 관리 대시보드</h1>
                    <div className="flex gap-4">
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                            <button
                                onClick={() => setViewMode('active')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'active' ? 'bg-gotgam-orange text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                🗂️ 전체 주문
                            </button>
                            <button
                                onClick={() => setViewMode('trash')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'trash' ? 'bg-red-500 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                🗑️ 휴지통
                            </button>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="bg-white px-4 py-2 rounded shadow text-sm font-medium hover:bg-gray-50 border border-gray-200"
                        >
                            새로고침
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="text-center py-12">로딩중...</div>
                ) : (
                    <OrderTable 
                        orders={filteredOrders} 
                        onUpdateStatus={handleUpdateStatus} 
                        onDelete={handleSoftDelete}
                        onRestore={handleRestore}
                        onPermanentDelete={handlePermanentDelete}
                        viewMode={viewMode}
                    />
                )}
            </div>
        </div>
    )
}
