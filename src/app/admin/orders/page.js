'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { updateOrderStatus } from './actions'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, final_amount, status, ordered_at, shipping_address, phone,
          users (full_name, email),
          order_items (
            quantity, unit_price,
            product_variants (size, products (name))
          )
        `)
        .order('ordered_at', { ascending: false })

      if (data) setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      alert('Cập nhật trạng thái thành công!')
    } catch (err) {
      alert('Lỗi cập nhật: ' + err.message)
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Chờ xử lý', bg: '#fef3c7', color: '#d97706' },
      processing: { label: 'Đang chuẩn bị', bg: '#dbeafe', color: '#2563eb' },
      shipped: { label: 'Đang giao', bg: '#ede9fe', color: '#7c3aed' },
      delivered: { label: 'Đã giao', bg: '#d1fae5', color: '#059669' },
      cancelled: { label: 'Đã hủy', bg: '#fee2e2', color: '#dc2626' },
    }
    const s = map[status] || { label: status, bg: '#f3f4f6', color: '#4b5563' }
    return <span style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
  }

  if (loading) return <div>Đang tải đơn hàng...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111' }}>Quản lý Đơn Hàng</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>MÃ ĐƠN</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>KHÁCH HÀNG</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>NGÀY ĐẶT</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>TỔNG TIỀN</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>TRẠNG THÁI</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', fontWeight: 600, color: '#111', fontSize: '0.9rem' }}>#{order.id.split('-')[0].toUpperCase()}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.users?.full_name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{order.users?.email}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{order.phone}</div>
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#4b5563' }}>{new Date(order.ordered_at).toLocaleString('vi-VN')}</td>
                <td style={{ padding: '16px', fontWeight: 700, color: '#ef4444' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.final_amount)}</td>
                <td style={{ padding: '16px' }}>{getStatusBadge(order.status)}</td>
                <td style={{ padding: '16px' }}>
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang chuẩn bị</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Chưa có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
