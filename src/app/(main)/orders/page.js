'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders(session.user.id)
    }
  }, [session])

  const fetchOrders = async (userId) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, total_amount, status, ordered_at,
          order_items (
            id, quantity, unit_price,
            product_variants (
              id, size,
              products (id, name, images)
            )
          )
        `)
        .eq('user_id', userId)
        .order('ordered_at', { ascending: false })

      if (data) {
        setOrders(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải danh sách đơn hàng...</div>
  }

  if (status === 'unauthenticated') return null

  const getStatusDisplay = (statusStr) => {
    switch (statusStr) {
      case 'pending': return <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><Clock size={16} /> Chờ xử lý</span>
      case 'processing': return <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><Package size={16} /> Đang chuẩn bị</span>
      case 'shipped': return <span style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><Package size={16} /> Đang giao hàng</span>
      case 'delivered': return <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><CheckCircle2 size={16} /> Đã giao</span>
      case 'cancelled': return <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><XCircle size={16} /> Đã hủy</span>
      default: return <span style={{ color: '#6b7280' }}>{statusStr}</span>
    }
  }

  return (
    <div className="container" style={{ padding: '40px 16px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '30px' }}>ĐƠN HÀNG CỦA TÔI</h1>
      
      {orders.length === 0 ? (
        <div style={{ background: '#f9fafb', padding: '60px 20px', borderRadius: '8px', textAlign: 'center' }}>
          <Package size={64} color="#d1d5db" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.2rem', color: '#374151', marginBottom: '16px' }}>Bạn chưa có đơn hàng nào</h2>
          <Link href="/products" style={{ padding: '10px 20px', background: '#FF6500', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}>
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>Mã đơn: <strong style={{ color: '#111' }}>{order.id.split('-')[0].toUpperCase()}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Ngày đặt: {new Date(order.ordered_at).toLocaleDateString('vi-VN')}</div>
                </div>
                <div>
                  {getStatusDisplay(order.status)}
                </div>
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {order.order_items?.map(item => {
                  const product = item.product_variants?.products
                  const size = item.product_variants?.size
                  const image = product?.images?.[0] || '/placeholder.jpg'
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <Link href={`/products/${product?.id}`} style={{ flexShrink: 0, width: '80px', height: '80px', position: 'relative', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                        <Image src={image} alt={product?.name || 'Product'} fill style={{ objectFit: 'cover' }} unoptimized />
                      </Link>
                      <div style={{ flex: 1 }}>
                        <Link href={`/products/${product?.id}`} style={{ fontWeight: 600, color: '#111', fontSize: '1rem', textDecoration: 'none' }}>{product?.name}</Link>
                        <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>Size: {size} x {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#111' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price)}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                <div style={{ fontSize: '1.1rem' }}>
                  Tổng tiền: <strong style={{ color: '#ef4444', fontSize: '1.25rem' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}</strong>
                </div>
                <Link href={`/checkout?items=${order.order_items?.map(i => i.product_variants?.id).join(',')}`} style={{
                  padding: '10px 20px', background: '#FF6500', color: '#fff', textDecoration: 'none',
                  fontWeight: 600, borderRadius: '4px', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e65a00'}
                onMouseLeave={e => e.currentTarget.style.background = '#FF6500'}>
                  MUA LẠI
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
