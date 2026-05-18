'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { registerUser } from '@/app/actions/auth'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  gender: z.string().min(1, 'Vui lòng chọn giới tính'),
  address: z.string().min(5, 'Địa chỉ cụ thể phải có ít nhất 5 ký tự'),
  province: z.string().min(2, 'Vui lòng nhập Tỉnh/Thành phố')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
})

export default function RegisterPage() {
  const router = useRouter()
  const { status } = useSession()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [status, router])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { gender: '' }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await registerUser(data)

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Đăng ký thành công! Hãy đăng nhập.')
        router.push('/login')
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f9fafb', padding: '40px 0' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px', color: '#111' }}>ĐĂNG KÝ TÀI KHOẢN</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginBottom: '30px' }}>Gia nhập cộng đồng Sprint Shop ngay</p>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Họ và tên *</label>
            <input 
              type="text"
              {...register('fullName')}
              placeholder="Nhập họ và tên"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.fullName ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            {errors.fullName && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.fullName.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email *</label>
            <input 
              type="email"
              {...register('email')}
              placeholder="Nhập email của bạn"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.email.message}</p>}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Mật khẩu *</label>
              <input 
                type="password"
                {...register('password')}
                placeholder="Ít nhất 6 ký tự"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
              />
              {errors.password && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.password.message}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Xác nhận *</label>
              <input 
                type="password"
                {...register('confirmPassword')}
                placeholder="Nhập lại mật khẩu"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
              />
              {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '30%' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Giới tính *</label>
              <select 
                {...register('gender')}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.gender ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff' }}
              >
                <option value="" disabled>Chọn</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              {errors.gender && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.gender.message}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Tỉnh/Thành phố *</label>
              <input 
                type="text"
                {...register('province')}
                placeholder="Ví dụ: Hà Nội"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: errors.province ? '1px solid #ef4444' : '1px solid #d1d5db', outline: 'none', fontFamily: 'Inter, sans-serif' }}
              />
              {errors.province && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{errors.province.message}</p>}
            </div>
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

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '14px', background: loading ? '#ccc' : '#FF6500', color: '#fff', 
              border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px', transition: 'background 0.2s'
            }}
          >
            {loading ? 'ĐANG XỬ LÍ...' : 'ĐĂNG KÝ TÀI KHOẢN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#4b5563' }}>
          Đã có tài khoản? <Link href="/login" style={{ color: '#FF6500', fontWeight: 700, textDecoration: 'none' }}>Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  )
}
