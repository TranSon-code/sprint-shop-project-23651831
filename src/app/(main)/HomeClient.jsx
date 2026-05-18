'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ────────────────────────────────────────────────
// BANNER CAROUSEL
// ────────────────────────────────────────────────
function BannerCarousel({ banners }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % banners.length), [banners.length])
  const prev = () => setCurrent(c => (c - 1 + banners.length) % banners.length)

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [next, banners.length])

  if (!banners.length) return null

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#000' }}>
      {/* Slides */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/5' }}>
        {banners.map((b, i) => (
          <div key={b.id} style={{
            position: 'absolute', inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.6s ease',
            pointerEvents: i === current ? 'auto' : 'none',
          }}>
            <img
              src={b.image_url}
              alt={b.subtitle || `Banner ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prev} id="banner-prev-btn" style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer',
            width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2,
          }}>
            <ChevronLeft size={24} />
          </button>
          <button onClick={next} id="banner-next-btn" style={{
            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer',
            width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2,
          }}>
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '6px', zIndex: 2,
        }}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? '24px' : '8px', height: '8px',
              background: i === current ? '#FF6500' : 'rgba(255,255,255,0.5)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────
// BRANDS GRID
// ────────────────────────────────────────────────
function BrandsSection({ brands }) {
  return (
    <section style={{ background: '#000', padding: '3rem 0', borderBottom: '1px solid #1f2937' }}>
      <div className="container">
        <h2 style={{
          textAlign: 'center', color: '#fff', fontWeight: 800,
          fontSize: '1.1rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>THƯƠNG HIỆU</h2>
        <div style={{ width: '48px', height: '3px', background: '#FF6500', margin: '0 auto 2rem' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
        }}>
          {brands.map(brand => (
            <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.name)}`}
              style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#111', padding: '1.5rem 1rem',
                display: 'flex', alignItems: 'center',
                aspectRatio: '16/9', justifyContent: 'center',
                border: '1px solid #333',
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6500'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
              >
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name}
                    style={{ width: '100%', maxWidth: '80px', height: '40px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                ) : (
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', textAlign: 'center' }}>{brand.name}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .brands-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
          @media (max-width: 480px) {
            .brands-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────
// HOME CLIENT
// ────────────────────────────────────────────────
export default function HomeClient({ carouselBanners, promoBanner, brands, newProducts, featuredProducts, newArrivalBannerUrl }) {
  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingBottom: '4rem' }}>

      {/* 1. Banner Carousel */}
      <BannerCarousel banners={carouselBanners} />

      {/* 2. Sự kiện nổi bật (Promo Banner) */}
      {promoBanner && (
        <section style={{ padding: '3rem 0', borderBottom: '1px solid #1f2937' }}>
          <div className="container">
            <h2 style={{
              textAlign: 'center', color: '#fff', fontWeight: 800,
              fontSize: '1.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>SỰ KIỆN NỔI BẬT</h2>
            <div style={{ width: '60px', height: '3px', background: '#FF6500', margin: '0 auto 2rem' }} />
            <img
              src={promoBanner.image_url}
              alt={promoBanner.subtitle || 'Khuyến mãi'}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </section>
      )}

      {/* 3. Brands */}
      <BrandsSection brands={brands} />

      {/* 4. Bộ Sưu Tập Mới (New Arrival) */}
      <section style={{ padding: '3rem 0', borderBottom: '1px solid #1f2937' }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center', color: '#fff', fontWeight: 800,
            fontSize: '1.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>BỘ SƯU TẬP MỚI</h2>
          <div style={{ width: '60px', height: '3px', background: '#FF6500', margin: '0 auto 2rem' }} />
          
          <div style={{ marginBottom: '2rem' }}>
            <img
              src={newArrivalBannerUrl}
              alt="New Arrival"
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>

          {newProducts?.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}>
              {newProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Sản Phẩm Nổi Bật */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center', color: '#fff', fontWeight: 800,
            fontSize: '1.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>SẢN PHẨM NỔI BẬT</h2>
          <div style={{ width: '60px', height: '3px', background: '#FF6500', margin: '0 auto 2rem' }} />

          {featuredProducts?.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginBottom: '3rem'
            }}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link href="/products" style={{
              display: 'inline-block', padding: '12px 40px',
              background: 'transparent', border: '2px solid #FF6500', color: '#FF6500',
              textDecoration: 'none', fontWeight: 700,
              fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase',
              transition: 'background 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF6500'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF6500' }}
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          div[style*="repeat(6, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          div[style*="repeat(6, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
