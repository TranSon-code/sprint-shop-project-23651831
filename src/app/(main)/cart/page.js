'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Bảo vệ route: Nếu chưa đăng nhập thì đẩy qua /login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart')
    }
  }, [status, router])

  if (!isMounted || status === 'loading') {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>
  }

  if (status === 'unauthenticated') return null

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <ShoppingBag size={64} color="#d1d5db" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Giỏ hàng của bạn đang trống</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link href="/products" style={{
          padding: '12px 24px', background: '#FF6500', color: '#fff', textDecoration: 'none',
          fontWeight: 600, borderRadius: '4px', transition: 'background 0.2s'
        }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(items.map(i => i.variantId))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (variantId) => {
    setSelectedItems(prev => 
      prev.includes(variantId) 
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    )
  }

  const selectedCartItems = items.filter(i => selectedItems.includes(i.variantId))
  const selectedTotal = selectedCartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!')
      return
    }
    const params = new URLSearchParams()
    params.set('items', selectedItems.join(','))
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="container" style={{ padding: '40px 16px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '30px' }}>GIỎ HÀNG</h1>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Cột trái: Danh sách sản phẩm */}
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <input 
              type="checkbox" 
              checked={selectedItems.length === items.length && items.length > 0}
              onChange={handleSelectAll}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#FF6500' }}
            />
            <span style={{ fontWeight: 600, color: '#374151' }}>
              {selectedItems.length === items.length && items.length > 0 ? 'Bỏ chọn tất cả' : `Chọn tất cả (${items.length} sản phẩm)`}
            </span>
          </div>

          {items.map((item) => (
            <div key={item.variantId} style={{ 
              display: 'flex', gap: '20px', padding: '20px', background: '#fff', 
              border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center' 
            }}>
              <input 
                type="checkbox" 
                checked={selectedItems.includes(item.variantId)}
                onChange={() => handleSelectItem(item.variantId)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#FF6500' }}
              />

              <Link href={`/products/${item.productId}`} style={{ flexShrink: 0, width: '100px', height: '100px', position: 'relative', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
              </Link>
              
              <div style={{ flex: 1 }}>
                <Link href={`/products/${item.productId}`} style={{ color: '#111', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>
                  {item.name}
                </Link>
                <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>Size: {item.size}</div>
                <div style={{ color: '#ef4444', fontWeight: 700 }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    style={{ width: '32px', height: '32px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >-</button>
                  <div style={{ width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db', fontSize: '0.9rem' }}>
                    {item.quantity}
                  </div>
                  <button 
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    style={{ width: '32px', height: '32px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >+</button>
                </div>
                
                <button 
                  onClick={() => {
                    removeItem(item.variantId)
                    setSelectedItems(prev => prev.filter(id => id !== item.variantId))
                  }}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => { clearCart(); setSelectedItems([]); }}
            style={{ 
              alignSelf: 'flex-start', background: 'none', border: 'none', color: '#6b7280', 
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' 
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        {/* Cột phải: Tổng quan đơn hàng */}
        <div style={{ 
          flex: '1 1 350px', background: '#f9fafb', padding: '24px', 
          borderRadius: '8px', border: '1px solid #e5e7eb', position: 'sticky', top: '90px' 
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            TỔNG QUAN ĐƠN HÀNG
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#4b5563' }}>
            <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
            <span style={{ fontWeight: 600, color: '#111' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#4b5563' }}>
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tổng cộng</span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#ef4444' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedTotal)}
            </span>
          </div>

          <button style={{
            width: '100%', padding: '16px', background: selectedItems.length > 0 ? '#FF6500' : '#ccc', color: '#fff',
            border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 700,
            cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: selectedItems.length > 0 ? '0 4px 6px rgba(255, 101, 0, 0.2)' : 'none'
          }}
          onMouseEnter={e => { if(selectedItems.length > 0) e.currentTarget.style.background = '#e65a00' }}
          onMouseLeave={e => { if(selectedItems.length > 0) e.currentTarget.style.background = '#FF6500' }}
          onClick={handleCheckout}
          >
            TIẾN HÀNH THANH TOÁN <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
