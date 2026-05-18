'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1f2937', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '3rem 1rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{
                width: 32, height: 32, background: '#FF6500',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '1rem', color: '#fff'
              }}>S</div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                SPRINT<span style={{ color: '#FF6500' }}>SHOP</span>
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
              Giày thể thao chính hãng từ các thương hiệu hàng đầu thế giới. Chất lượng đảm bảo, giao hàng nhanh.
            </p>
          </div>

          {/* Danh mục */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Danh mục</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Chạy bộ', 'Bóng rổ', 'Bóng đá', 'Tập gym', 'Lifestyle', 'Outdoor'].map(c => (
                <Link key={c} href={`/products?category=${c.toLowerCase().replace(/ /g, '-')}`}
                  style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FF6500'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >{c}</Link>
              ))}
            </div>
          </div>

          {/* Thương hiệu */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thương hiệu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Nike', 'Adidas', 'HOKA', 'New Balance', 'Puma', 'Converse'].map(b => (
                <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`}
                  style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FF6500'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >{b}</Link>
              ))}
            </div>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hỗ trợ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Tài khoản', href: '/profile' },
                { label: 'Đơn hàng', href: '/orders' },
                { label: 'Chính sách đổi trả', href: '#' },
                { label: 'Hướng dẫn chọn size', href: '#' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FF6500'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >{item.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: '#4b5563', fontSize: '0.8rem', margin: 0 }}>
            © 2025 Sprint Shop. Tất cả quyền được bảo lưu.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#4b5563', fontSize: '0.8rem' }}>Nike · Adidas · HOKA · Puma · New Balance · Converse</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
