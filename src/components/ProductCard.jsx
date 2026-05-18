'use client'

import Link from 'next/link'
import Image from 'next/image'

const LABEL_STYLES = {
  hot: { bg: '#FF0000', text: 'HOT' },
  new: { bg: '#FF6500', text: 'NEW' },
  best_seller: { bg: '#FFB800', text: 'BEST SELLER' },
}

export default function ProductCard({ product }) {
  const { id, name, slug, price, brand, label, image } = product
  // Make sure label exists in our mapping
  const labelKey = label && LABEL_STYLES[label] ? label : null
  const labelStyle = labelKey ? LABEL_STYLES[labelKey] : null

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)

  return (
    <Link
      href={`/products/${slug}`}
      id={`product-card-${id}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div
        style={{
          background: '#ffffff',
          cursor: 'pointer',
          transition: 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.border = '1px solid #FF6500'
          e.currentTarget.style.zIndex = '1'
          e.currentTarget.style.position = 'relative'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.border = '1px solid transparent'
          e.currentTarget.style.zIndex = 'auto'
        }}
      >
        {/* Image container */}
        <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f9fafb', overflow: 'hidden' }}>
          {image ? (
            <img
              src={image}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.75rem' }}>
              No Image
            </div>
          )}
          {/* Label badge */}
          {labelStyle && (
            <span style={{
              position: 'absolute', top: '10px', left: '10px',
              background: labelStyle.bg, color: '#fff',
              fontSize: '0.7rem', fontWeight: 700,
              padding: '4px 10px',
            }}>
              {labelStyle.text}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            color: '#111827', fontSize: '0.9rem', fontWeight: 700,
            lineHeight: 1.4, marginBottom: '4px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {name}
          </div>
          
          {brand && (
            <div style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
              {brand}
            </div>
          )}
          
          <div style={{ color: '#FF6500', fontWeight: 800, fontSize: '1rem', marginTop: 'auto' }}>
            {formattedPrice}
          </div>
        </div>
      </div>
    </Link>
  )
}
