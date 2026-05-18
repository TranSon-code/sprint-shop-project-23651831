'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'

export default function ProductDetailClient({ product }) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const addItem = useCartStore(s => s.addItem)
  
  const [mainImage, setMainImage] = useState(product.images[0] || '/placeholder.png')
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSizeClick = (variant) => {
    setSelectedVariant(variant)
    setQuantity(1)
    setErrorMsg('')
  }

  const handleQuantity = (type) => {
    if (!selectedVariant) return
    if (type === 'minus' && quantity > 1) {
      setQuantity(q => q - 1)
    }
    if (type === 'plus' && quantity < selectedVariant.stock_quantity) {
      setQuantity(q => q + 1)
    }
  }

  const validateBeforeCart = () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return false
    }
    if (!selectedVariant) {
      setErrorMsg('Vui lòng chọn kích thước trước.')
      return false
    }
    if (selectedVariant.stock_quantity <= 0) {
      setErrorMsg('Sản phẩm này đã hết hàng.')
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!validateBeforeCart()) return

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedVariant.size,
      image: mainImage,
      quantity: quantity
    })
    
    toast.success('Đã thêm vào giỏ hàng thành công!')
  }

  const handleBuyNow = () => {
    if (!validateBeforeCart()) return

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedVariant.size,
      image: mainImage,
      quantity: quantity
    })
    
    const params = new URLSearchParams()
    params.set('items', selectedVariant.id)
    router.push(`/checkout?${params.toString()}`)
  }

  const [validImages, setValidImages] = useState(product.images)

  const handleImageError = (failedImg) => {
    setValidImages(prev => prev.filter(img => img !== failedImg))
    if (mainImage === failedImg) {
      const remaining = validImages.filter(img => img !== failedImg)
      if (remaining.length > 0) setMainImage(remaining[0])
      else setMainImage('/placeholder.png')
    }
  }

  return (
    <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
      
      {/* Cột trái: Ảnh sản phẩm */}
      <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
        {/* Ảnh chính */}
        <div style={{ 
          width: '100%', aspectRatio: '1/1', background: '#f3f4f6', 
          position: 'relative', borderRadius: '8px', overflow: 'hidden',
          marginBottom: '16px'
        }}>
          {mainImage && mainImage !== '/placeholder.png' ? (
            <Image 
              src={mainImage} 
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
              onError={() => handleImageError(mainImage)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Image</div>
          )}
        </div>

        {/* Thumbnails */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
          {validImages.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setMainImage(img)}
              style={{ 
                width: '80px', height: '80px', flexShrink: 0, 
                position: 'relative', borderRadius: '4px', overflow: 'hidden',
                cursor: 'pointer', border: mainImage === img ? '2px solid #FF6500' : '1px solid #e5e7eb',
                background: '#f3f4f6'
              }}
            >
              <Image 
                src={img} 
                alt={`${product.name} thumbnail ${idx}`}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
                onError={() => handleImageError(img)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Thông tin sản phẩm */}
      <div style={{ flex: '1 1 400px' }}>
        <div style={{ color: '#FF6500', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          {product.brand}
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '16px', lineHeight: 1.2 }}>
          {product.name}
        </h1>
        
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', marginBottom: '24px' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </div>

        {/* Chọn Size */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>Chọn kích thước</span>
            {selectedVariant && (
              <span style={{ fontSize: '0.85rem', color: selectedVariant.stock_quantity > 0 ? '#10b981' : '#ef4444' }}>
                {selectedVariant.stock_quantity > 0 ? `Còn ${selectedVariant.stock_quantity} sản phẩm` : 'Hết hàng'}
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {product.variants.map(v => (
              <button
                key={v.id}
                onClick={() => handleSizeClick(v)}
                disabled={v.stock_quantity <= 0}
                style={{
                  padding: '12px 0', width: '60px',
                  background: selectedVariant?.id === v.id ? '#111' : '#fff',
                  color: selectedVariant?.id === v.id ? '#fff' : (v.stock_quantity <= 0 ? '#9ca3af' : '#111'),
                  border: selectedVariant?.id === v.id ? '1px solid #111' : '1px solid #d1d5db',
                  borderRadius: '4px', fontWeight: 600, cursor: v.stock_quantity <= 0 ? 'not-allowed' : 'pointer',
                  opacity: v.stock_quantity <= 0 ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        {/* Chọn số lượng */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Số lượng</span>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
            <button 
              onClick={() => handleQuantity('minus')}
              style={{ width: '40px', height: '40px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600 }}
            >-</button>
            <div style={{ width: '50px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db' }}>
              {quantity}
            </div>
            <button 
              onClick={() => handleQuantity('plus')}
              style={{ width: '40px', height: '40px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600 }}
            >+</button>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        {/* Các Nút Hành Động */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleBuyNow}
            style={{
              width: '100%', padding: '16px', background: '#FF6500', color: '#fff',
              border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 700,
              cursor: 'pointer', transition: 'background 0.2s',
              boxShadow: '0 4px 6px rgba(255, 101, 0, 0.2)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e65a00'}
            onMouseLeave={e => e.currentTarget.style.background = '#FF6500'}
          >
            MUA NGAY
          </button>
          
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%', padding: '16px', background: '#fff', color: '#FF6500',
              border: '2px solid #FF6500', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff5f0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff'
            }}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>

        {/* Mô tả */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Mô tả sản phẩm</h3>
          <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
            {product.description}
          </p>
        </div>
      </div>
      
    </div>
  )
}
