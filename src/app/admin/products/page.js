'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, price, is_active,
          brands (name),
          categories (name),
          product_images (image_url)
        `)
        .order('created_at', { ascending: false })

      if (data) {
        // Lấy ảnh chính (hoặc ảnh đầu tiên)
        const formatted = data.map(p => ({
          ...p,
          mainImage: p.product_images?.[0]?.image_url || '/placeholder.jpg'
        }))
        setProducts(formatted)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id)
      
      if (!error) {
        setProducts(products.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Đang tải sản phẩm...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111' }}>Quản lý Sản Phẩm</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FF6500', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, width: '80px' }}>ẢNH</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>TÊN SẢN PHẨM</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>THƯƠNG HIỆU</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>GIÁ BÁN</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>TRẠNG THÁI</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ width: '50px', height: '50px', position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#f3f4f6' }}>
                    <Image src={product.mainImage} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                </td>
                <td style={{ padding: '16px', fontWeight: 600, color: '#111', fontSize: '0.9rem' }}>
                  {product.name}
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 400, marginTop: '4px' }}>{product.categories?.name}</div>
                </td>
                <td style={{ padding: '16px', color: '#4b5563', fontSize: '0.9rem' }}>{product.brands?.name}</td>
                <td style={{ padding: '16px', fontWeight: 700, color: '#111' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                <td style={{ padding: '16px' }}>
                  <button 
                    onClick={() => toggleStatus(product.id, product.is_active)}
                    style={{ 
                      padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                      background: product.is_active ? '#d1fae5' : '#fee2e2', 
                      color: product.is_active ? '#059669' : '#dc2626'
                    }}>
                    {product.is_active ? 'Đang bán' : 'Tạm ẩn'}
                  </button>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '16px' }} title="Sửa">
                    <Edit size={18} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
