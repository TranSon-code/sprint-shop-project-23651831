'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCart, Search, User, ChevronDown, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const categories = [
  { name: 'Chạy bộ', slug: 'chay-bo' },
  { name: 'Bóng rổ', slug: 'bong-ro' },
  { name: 'Bóng đá', slug: 'bong-da' },
  { name: 'Tập gym', slug: 'tap-gym' },
  { name: 'Lifestyle', slug: 'lifestyle' },
  { name: 'Outdoor', slug: 'outdoor' },
]

const brands = ['Nike', 'Adidas', 'HOKA', 'New Balance', 'Puma', 'Converse']

export default function Navbar() {
  const { data: session } = useSession()
  const cartCount = useCartStore((s) => s.totalItems())
  const [isMounted, setIsMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  const [brandOpen, setBrandOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const catRef = useRef(null)
  const brandRef = useRef(null)
  const userRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(search.trim())}`
    }
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#000', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '1.5rem' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, background: '#FF6500',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '-1px'
          }}>S</div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
            SPRINT<span style={{ color: '#FF6500' }}>SHOP</span>
          </span>
        </Link>

        {/* Nav Links - Desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="desktop-nav">

          {/* Sản phẩm */}
          <Link href="/products" style={{
            color: '#fff', textDecoration: 'none', padding: '8px 12px',
            fontWeight: 500, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
            borderRadius: '4px', transition: 'background 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,101,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Sản phẩm
          </Link>

          {/* Danh mục */}
          <div ref={catRef} style={{ position: 'relative' }}
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button
              style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px',
                fontWeight: 500, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                borderRadius: '4px', transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,101,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Danh mục <ChevronDown size={14} />
            </button>
            {catOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, background: '#111',
                border: '1px solid #333', minWidth: '160px', zIndex: 100, marginTop: '0px'
              }}>
                {categories.map(c => (
                  <Link key={c.slug} href={`/products?category=${c.slug}`}
                    onClick={() => setCatOpen(false)}
                    style={{
                      display: 'block', padding: '10px 16px', color: '#e5e7eb',
                      textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                      borderBottom: '1px solid #222', transition: 'background 0.1s, color 0.1s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FF6500'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e5e7eb' }}
                  >{c.name}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Thương hiệu */}
          <div ref={brandRef} style={{ position: 'relative' }}
            onMouseEnter={() => setBrandOpen(true)}
            onMouseLeave={() => setBrandOpen(false)}
          >
            <button
              style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px',
                fontWeight: 500, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                borderRadius: '4px', transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,101,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Thương hiệu <ChevronDown size={14} />
            </button>
            {brandOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, background: '#111',
                border: '1px solid #333', minWidth: '160px', zIndex: 100, marginTop: '0px'
              }}>
                {brands.map(b => (
                  <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`}
                    onClick={() => setBrandOpen(false)}
                    style={{
                      display: 'block', padding: '10px 16px', color: '#e5e7eb',
                      textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                      borderBottom: '1px solid #222', transition: 'background 0.1s, color 0.1s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FF6500'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e5e7eb' }}
                  >{b}</Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '340px', display: 'flex' }} className="desktop-nav">
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Tìm kiếm giày..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 40px 8px 14px',
                background: '#1a1a1a', border: '1.5px solid #333',
                color: '#fff', fontSize: '0.875rem', outline: 'none',
                fontFamily: 'Inter, sans-serif', borderRadius: 0
              }}
              onFocus={e => e.target.style.borderColor = '#FF6500'}
              onBlur={e => e.target.style.borderColor = '#333'}
            />
            <button type="submit" style={{
              position: 'absolute', right: 0, top: 0, height: '100%', padding: '0 12px',
              background: '#FF6500', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}>
              <Search size={16} color="#fff" />
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>

          {/* Cart */}
          <Link href="/cart" id="navbar-cart-btn" style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 42, height: 42, color: '#fff', textDecoration: 'none', borderRadius: '4px',
            transition: 'background 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,101,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ShoppingCart size={22} />
            {isMounted && cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                background: '#FF6500', color: '#fff', borderRadius: '50%',
                width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cartCount > 9 ? '9+' : cartCount}</span>
            )}
          </Link>

          {/* User */}
          {session ? (
            <div ref={userRef} style={{ position: 'relative' }}>
              <button onClick={() => setUserOpen(v => !v)} style={{
                display: 'flex', alignItems: 'center', gap: '6px', background: 'none',
                border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 8px',
                fontFamily: 'Inter, sans-serif', borderRadius: '4px'
              }}>
                <div style={{
                  width: 32, height: 32, background: '#FF6500', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem'
                }}>
                  {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </button>
              {userOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, background: '#111',
                  border: '1px solid #333', minWidth: '180px', zIndex: 100, marginTop: '4px'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{session.user.name}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{session.user.email}</div>
                  </div>
                  {[
                    { href: '/profile', label: 'Tài khoản' },
                    { href: '/orders', label: 'Đơn hàng' },
                    ...(session.user.role === 'admin' ? [{ href: '/admin', label: 'Quản trị' }] : []),
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setUserOpen(false)}
                      style={{
                        display: 'block', padding: '10px 16px', color: '#e5e7eb',
                        textDecoration: 'none', fontSize: '0.875rem', borderBottom: '1px solid #222'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FF6500'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e5e7eb' }}
                    >{item.label}</Link>
                  ))}
                  <button onClick={() => {
                    useCartStore.getState().clearCart()
                    signOut()
                  }} style={{
                    width: '100%', padding: '10px 16px', background: 'none', border: 'none',
                    color: '#ef4444', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" id="navbar-login-btn" style={{
              padding: '8px 16px', background: '#FF6500', color: '#fff',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', borderRadius: 0
            }}>
              Đăng nhập
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(v => !v)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: '#111', borderTop: '1px solid #333', padding: '1rem' }} className="mobile-menu">
          <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex' }}>
              <input type="text" placeholder="Tìm kiếm..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontFamily: 'Inter, sans-serif', borderRadius: 0 }} />
              <button type="submit" style={{ padding: '8px 12px', background: '#FF6500', border: 'none', cursor: 'pointer' }}>
                <Search size={16} color="#fff" />
              </button>
            </div>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link href="/products" onClick={() => setMobileOpen(false)}
              style={{ color: '#FF6500', textDecoration: 'none', padding: '12px 4px', fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid #1f2937' }}>
              TẤT CẢ SẢN PHẨM
            </Link>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', padding: '4px 0', marginTop: '8px' }}>Danh mục</div>
            {categories.map(c => (
              <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setMobileOpen(false)}
                style={{ color: '#e5e7eb', textDecoration: 'none', padding: '8px 4px', fontSize: '0.9rem', borderBottom: '1px solid #1f2937' }}>
                {c.name}
              </Link>
            ))}
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', padding: '4px 0', marginTop: '8px' }}>Thương hiệu</div>
            {brands.map(b => (
              <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`} onClick={() => setMobileOpen(false)}
                style={{ color: '#e5e7eb', textDecoration: 'none', padding: '8px 4px', fontSize: '0.9rem', borderBottom: '1px solid #1f2937' }}>
                {b}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  )
}
