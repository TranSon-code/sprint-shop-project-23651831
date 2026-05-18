'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Users, Home } from 'lucide-react'

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === 'loading') {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>
  }

  // Chặn nếu chưa đăng nhập hoặc không phải admin
  if (status === 'unauthenticated' || (session?.user && session.user.role !== 'admin')) {
    if (typeof window !== 'undefined') {
      router.replace('/')
    }
    return null
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20} /> },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#111827', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #374151' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF6500' }}>SPRINT SHOP</div>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500 }}>Bảng Điều Khiển</div>
        </div>
        
        <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map(item => {
            const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path)
            return (
              <Link key={item.path} href={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '8px', textDecoration: 'none',
                background: isActive ? '#FF6500' : 'transparent',
                color: isActive ? '#fff' : '#d1d5db',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#374151' }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                {item.icon} {item.name}
              </Link>
            )
          })}
        </div>
        
        <div style={{ padding: '24px 16px', borderTop: '1px solid #374151' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', fontWeight: 500, borderRadius: '8px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Home size={20} /> Về trang chủ
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: '70px', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>{session?.user?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Quản trị viên</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FF6500', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              A
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
