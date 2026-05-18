'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin' && callbackUrl === '/') {
        router.replace('/admin')
      } else {
        router.replace(callbackUrl)
      }
    }
  }, [status, session, router, callbackUrl])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })

      if (res?.error) {
        toast.error('Email hoặc mật khẩu không chính xác')
      } else {
        toast.success('Đăng nhập thành công!')
        // router.push/refresh are handled by useEffect when session status changes
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f9fafb' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px', color: '#111' }}>ĐĂNG NHẬP</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginBottom: '30px' }}>Chào mừng bạn quay lại Sprint Shop</p>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email</label>
            <input 
              type="email"
              {...register('email')}
              placeholder="Nhập email của bạn"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Mật khẩu</label>
            <input 
              type="password"
              {...register('password')}
              placeholder="Nhập mật khẩu"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            {errors.password && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '14px', background: loading ? '#ccc' : '#FF6500', color: '#fff', 
              border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px', transition: 'background 0.2s'
            }}
          >
            {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#4b5563' }}>
          Chưa có tài khoản? <Link href="/register" style={{ color: '#FF6500', fontWeight: 700, textDecoration: 'none' }}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  )
}
