'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = [
  { id: 'chay-bo', label: 'Chạy bộ' },
  { id: 'bong-ro', label: 'Bóng rổ' },
  { id: 'bong-da', label: 'Bóng đá' },
  { id: 'tap-gym', label: 'Tập gym' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'outdoor', label: 'Outdoor' }
]

const BRANDS = ['Nike', 'Adidas', 'HOKA', 'New Balance', 'Puma', 'Converse']

const GENDERS = [
  { id: 'male', label: 'Nam' },
  { id: 'female', label: 'Nữ' },
  { id: 'kids', label: 'Trẻ em' }
]

const PRICES = [
  { id: 'under_1m', label: 'Dưới 1.000.000₫' },
  { id: '1m_2m', label: '1.000.000₫ - 2.000.000₫' },
  { id: '2m_3m', label: '2.000.000₫ - 3.000.000₫' },
  { id: 'over_3m', label: 'Trên 3.000.000₫' }
]

const SORTS = [
  { id: 'new', label: 'Mới nhất' },
  { id: 'price_asc', label: 'Giá: Thấp đến cao' },
  { id: 'price_desc', label: 'Giá: Cao xuống thấp' }
]

export default function ProductsClient({ initialData, initialParams }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { products, totalCount, page, totalPages } = initialData

  // Trạng thái bộ lọc từ URL
  const currentCategory = searchParams.get('category') ? searchParams.get('category').split(',') : []
  const currentBrand = searchParams.get('brand') ? searchParams.get('brand').split(',') : []
  const currentGender = searchParams.get('gender') ? searchParams.get('gender').split(',') : []
  const currentPrice = searchParams.get('price') ? searchParams.get('price').split(',') : []
  const currentSort = searchParams.get('sort') || 'new'

  const updateQuery = (key, values) => {
    const params = new URLSearchParams(searchParams.toString())
    if (values.length > 0) {
      params.set(key, values.join(','))
    } else {
      params.delete(key)
    }
    // Khi thay đổi filter, luôn reset về trang 1
    params.set('page', '1')
    router.push(pathname + '?' + params.toString(), { scroll: false })
  }

  const handleToggle = (key, id, currentList) => {
    let newList = [...currentList]
    if (newList.includes(id)) {
      newList = newList.filter(v => v !== id)
    } else {
      newList.push(id)
    }
    updateQuery(key, newList)
  }

  const handleSortChange = (e) => {
    const val = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', val)
    params.set('page', '1')
    router.push(pathname + '?' + params.toString(), { scroll: false })
  }

  const changePage = (p) => {
    if (p < 1 || p > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', p.toString())
    router.push(pathname + '?' + params.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderCheckboxList = (items, key, currentList) => {
    return items.map(item => {
      const id = typeof item === 'string' ? item : item.id
      const label = typeof item === 'string' ? item : item.label
      const checked = currentList.includes(id)
      
      return (
        <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
          <input 
            type="checkbox" 
            checked={checked}
            onChange={() => handleToggle(key, id, currentList)}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#FF6500' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#374151', textTransform: typeof item === 'string' ? 'uppercase' : 'none', fontWeight: checked ? 600 : 400 }}>
            {label}
          </span>
        </label>
      )
    })
  }

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      
      {/* 1. Sidebar Lọc */}
      <div style={{ width: '250px', flexShrink: 0, background: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} className="sidebar-filter">
        <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', borderBottom: '2px solid #FF6500', paddingBottom: '10px', display: 'inline-block' }}>
          Bộ Lọc
        </h3>

        {/* Danh mục */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', marginBottom: '12px' }}>DANH MỤC</div>
          {renderCheckboxList(CATEGORIES, 'category', currentCategory)}
        </div>

        {/* Thương hiệu */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', marginBottom: '12px' }}>THƯƠNG HIỆU</div>
          {renderCheckboxList(BRANDS, 'brand', currentBrand)}
        </div>

        {/* Giới tính */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', marginBottom: '12px' }}>GIỚI TÍNH</div>
          {renderCheckboxList(GENDERS, 'gender', currentGender)}
        </div>

        {/* Mức giá */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', marginBottom: '12px' }}>MỨC GIÁ</div>
          {renderCheckboxList(PRICES, 'price', currentPrice)}
        </div>
      </div>

      {/* 2. Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        
        {/* Sort Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '12px 20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: 500 }}>
            Tìm thấy <strong style={{ color: '#FF6500' }}>{totalCount}</strong> sản phẩm
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>Sắp xếp:</span>
            <select 
              value={currentSort} 
              onChange={handleSortChange}
              style={{ padding: '6px 12px', fontSize: '0.85rem', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
            >
              {SORTS.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Sản Phẩm */}
        {products.length === 0 ? (
          <div style={{ background: '#fff', padding: '40px', textAlign: 'center', borderRadius: '4px', color: '#6b7280' }}>
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
          </div>
        ) : (
          <>
            <div className="products-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '40px'
            }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                <button 
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  style={{ padding: '8px 16px', background: page === 1 ? '#f3f4f6' : '#fff', border: '1px solid #d1d5db', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, color: page === 1 ? '#9ca3af' : '#111' }}
                >
                  Trang trước
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Simple pagination: show all if few, or limit
                  return (
                    <button 
                      key={p} 
                      onClick={() => changePage(p)}
                      style={{ 
                        width: '36px', height: '36px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: page === p ? '#FF6500' : '#fff', 
                        color: page === p ? '#fff' : '#111',
                        border: page === p ? '1px solid #FF6500' : '1px solid #d1d5db', 
                        cursor: 'pointer', fontWeight: 700 
                      }}
                    >
                      {p}
                    </button>
                  )
                })}

                <button 
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  style={{ padding: '8px 16px', background: page === totalPages ? '#f3f4f6' : '#fff', border: '1px solid #d1d5db', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontWeight: 600, color: page === totalPages ? '#9ca3af' : '#111' }}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .sidebar-filter { display: none; } /* On mobile, we might need a button to toggle, but for now hide to keep it simple */
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  )
}
