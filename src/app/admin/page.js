'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      // 1. Doanh thu & Đơn hàng
      const { data: orders } = await supabase.from('orders').select('final_amount, status')
      let revenue = 0
      let pending = 0
      if (orders) {
        orders.forEach(o => {
          if (o.status !== 'cancelled') revenue += o.final_amount
          if (o.status === 'pending') pending++
        })
      }

      // 2. Số lượng sản phẩm
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })

      setStats({
        totalRevenue: revenue,
        totalOrders: orders?.length || 0,
        pendingOrders: pending,
        totalProducts: productCount || 0
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Đang tải dữ liệu...</div>
  }

  const statCards = [
    { title: 'Tổng Doanh Thu', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue), icon: <DollarSign size={24} color="#10b981" />, bg: '#d1fae5' },
    { title: 'Tổng Đơn Hàng', value: stats.totalOrders, icon: <ShoppingBag size={24} color="#3b82f6" />, bg: '#dbeafe' },
    { title: 'Đơn Chờ Xử Lý', value: stats.pendingOrders, icon: <Package size={24} color="#f59e0b" />, bg: '#fef3c7' },
    { title: 'Tổng Sản Phẩm', value: stats.totalProducts, icon: <TrendingUp size={24} color="#8b5cf6" />, bg: '#ede9fe' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111', marginBottom: '24px' }}>Tổng Quan Hệ Thống</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {statCards.map((card, index) => (
          <div key={index} style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>{card.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Hướng dẫn quản trị</h2>
        <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '12px' }}>Chào mừng bạn đến với trang Quản trị (Admin Dashboard). Tại đây bạn có thể:</p>
        <ul style={{ color: '#4b5563', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li><strong>Đơn hàng:</strong> Xem danh sách khách đặt mua, thay đổi trạng thái (Chờ xử lý &rarr; Đang giao &rarr; Đã giao).</li>
          <li><strong>Sản phẩm:</strong> Quản lý kho hàng, thêm sản phẩm mới, cập nhật giá và số lượng, xóa các mẫu cũ.</li>
        </ul>
      </div>
    </div>
  )
}
