'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <CheckCircle size={80} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '16px' }}>ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Cảm ơn bạn đã mua sắm tại Sprint Shop. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/products" style={{
            padding: '16px', background: '#FF6500', color: '#fff', textDecoration: 'none',
            fontWeight: 700, borderRadius: '4px', transition: 'background 0.2s', display: 'block'
          }}>
            TIẾP TỤC MUA SẮM
          </Link>
          <Link href="/orders" style={{
            padding: '16px', background: '#fff', color: '#111', textDecoration: 'none',
            fontWeight: 700, borderRadius: '4px', border: '1px solid #d1d5db', transition: 'background 0.2s', display: 'block'
          }}>
            QUẢN LÝ ĐƠN HÀNG
          </Link>
        </div>
      </div>
    </div>
  )
}
