'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { createOrder } from '@/app/actions/order'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

import { supabase } from '@/lib/supabase'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  province: z.string().min(2, 'Vui lòng nhập Tỉnh/Thành phố'),
  address: z.string().min(5, 'Địa chỉ cụ thể phải có ít nhất 5 ký tự'),
})

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checkoutItems, setCheckoutItems] = useState([])
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { items, removeItem } = useCartStore()

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(checkoutSchema)
  })

  useEffect(() => {
    setIsMounted(true)
    if (session?.user?.name) {
      setValue('fullName', session.user.name)
      // Fetch address and province from db
      if (session.user.email) {
        supabase.from('users').select('address, province').eq('email', session.user.email).maybeSingle()
          .then(({ data, error }) => {
            if (error) console.error('Error fetching user:', error)
            if (data) {
              if (data.address) setValue('address', data.address)
              if (data.province) setValue('province', data.province)
            }
          })
      }
    }
  }, [session, setValue, supabase])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
    }
  }, [status, router])

  useEffect(() => {
    if (!isMounted) return
    const itemIds = searchParams.get('items')
    if (!itemIds) {
      router.push('/cart')
      return
    }
    const idArray = itemIds.split(',')
    
    // First try to get from cart
    let selected = items.filter(i => idArray.includes(i.variantId))
    
    if (selected.length === idArray.length) {
      setCheckoutItems(selected)
    } else {
      // If not in cart (e.g. clicking 'Mua lại'), fetch from DB
      const fetchItems = async () => {
        const { data, error } = await supabase
          .from('product_variants')
          .select('id, size, products(id, name, price, images)')
          .in('id', idArray)
        
        if (data && !error) {
          const dbItems = data.map(v => ({
            variantId: v.id,
            productId: v.products.id,
            name: v.products.name,
            price: v.products.price,
            size: v.size,
            image: v.products.images?.[0] || '/placeholder.jpg',
            quantity: 1 // Default quantity for re-order
          }))
          setCheckoutItems(dbItems)
        } else {
          router.push('/cart')
        }
      }
      fetchItems()
    }
  }, [isMounted, searchParams, items, supabase, router])

  if (!isMounted || status === 'loading' || checkoutItems.length === 0) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>
  }

  const totalPrice = checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const orderData = {
        items: checkoutItems.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
        phone: data.phone,
        address: data.address,
        province: data.province,
      }

      const res = await createOrder(orderData)

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Đặt hàng thành công!')
        router.push('/success')
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '40px 16px', minHeight: '80vh' }}>
      
      <button onClick={() => router.back()} style={{ 
        display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', 
        color: '#4b5563', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginBottom: '24px'
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#111'}
      onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
        <ArrowLeft size={20} /> QUAY LẠI GIỎ HÀNG
      </button>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '30px' }}>THANH TOÁN</h1>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Cột trái: Form thông tin */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ background: '#f9fafb', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', marginBottom: '20px' }}>Thông tin giao hàng</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Họ và tên người nhận *</label>
                <input 
                  type="text"
                  {...register('fullName')}
                  placeholder="Nhập họ và tên"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.fullName ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                />
                {errors.fullName && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.fullName.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Số điện thoại *</label>
                <input 
                  type="text"
                  {...register('phone')}
                  placeholder="Nhập số điện thoại liên lạc"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                />
                {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.phone.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Tỉnh/Thành phố *</label>
                <input 
                  type="text"
                  {...register('province')}
                  placeholder="Ví dụ: Hà Nội"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.province ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                />
                {errors.province && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.province.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Địa chỉ cụ thể *</label>
                <input 
                  type="text"
                  {...register('address')}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.address ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                />
                {errors.address && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.address.message}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Cột phải: Review đơn hàng */}
        <div style={{ flex: '1 1 400px', background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            ĐƠN HÀNG CỦA BẠN ({checkoutItems.length} sản phẩm)
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {checkoutItems.map((item) => (
              <div key={item.variantId} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, width: '64px', height: '64px', position: 'relative', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#111', fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Size: {item.size} x {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#4b5563' }}>
            <span>Tạm tính</span>
            <span style={{ fontWeight: 600, color: '#111' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#4b5563' }}>
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tổng cộng</span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#ef4444' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </span>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={loading}
            style={{
              width: '100%', padding: '16px', background: loading ? '#ccc' : '#FF6500', color: '#fff',
              border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 4px 6px rgba(255, 101, 0, 0.2)'
            }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#e65a00' }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#FF6500' }}
          >
            {loading ? 'ĐANG XỬ LÝ...' : <><CheckCircle2 size={20} /> XÁC NHẬN ĐẶT HÀNG</>}
          </button>
        </div>
      </div>
    </div>
  )
}
