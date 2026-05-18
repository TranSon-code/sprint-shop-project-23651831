'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, MapPin, Mail, LogOut, Package, Clock } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile(session.user.email)
    }
  }, [session])

  const fetchProfile = async (email) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()
      
      if (data) setProfile(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>
  }

  if (status === 'unauthenticated' || !profile) return null

  return (
    <div className="container" style={{ padding: '40px 16px', minHeight: '80vh', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '30px' }}>TÀI KHOẢN CỦA TÔI</h1>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Cột trái: Menu & Avatar */}
        <div style={{ flex: '1 1 250px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ width: '80px', height: '80px', background: '#FF6500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>
              {profile.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>{profile.full_name}</div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Vai trò: {profile.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '4px', color: '#FF6500', fontWeight: 600, textDecoration: 'none' }}>
              <User size={18} /> Thông tin cá nhân
            </Link>
            <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '4px', color: '#4b5563', fontWeight: 500, textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <Package size={18} /> Đơn hàng của tôi
            </Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '4px', color: '#ef4444', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'Inter, sans-serif' }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Cột phải: Chi tiết */}
        <div style={{ flex: '1 1 400px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            Hồ Sơ Cá Nhân
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <User size={20} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>Họ và tên</div>
                <div style={{ fontWeight: 600, color: '#111' }}>{profile.full_name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Mail size={20} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>Email</div>
                <div style={{ fontWeight: 600, color: '#111' }}>{profile.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <MapPin size={20} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>Địa chỉ giao hàng mặc định</div>
                <div style={{ fontWeight: 600, color: '#111' }}>
                  {profile.address ? `${profile.address}, ${profile.province}` : 'Chưa cập nhật'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <User size={20} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>Giới tính</div>
                <div style={{ fontWeight: 600, color: '#111' }}>{profile.gender || 'Chưa cập nhật'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Clock size={20} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>Ngày tham gia</div>
                <div style={{ fontWeight: 600, color: '#111' }}>{new Date(profile.created_at).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
