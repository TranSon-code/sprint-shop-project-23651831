'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Plus, Edit, Trash2, X } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Thêm size và stock_quantity vào Form Data
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand_id: '',
    category_id: '',
    gender: 'unisex',
    description: '',
    image_url: '',
    size: '40',          // Default size
    stock_quantity: '10' // Default stock
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [{ data: bData }, { data: cData }, { data: pData }] = await Promise.all([
        supabase.from('brands').select('id, name'),
        supabase.from('categories').select('id, name'),
        supabase.from('products').select(`
          id, name, price, is_active, description, gender, brand_id, category_id,
          brands (name),
          categories (name),
          product_images (image_url),
          product_variants (id, size, stock_quantity)
        `).order('created_at', { ascending: false })
      ])

      if (bData) setBrands(bData)
      if (cData) setCategories(cData)
      if (pData) {
        const formatted = pData.map(p => ({
          ...p,
          mainImage: p.product_images?.[0]?.image_url || 'https://via.placeholder.com/150',
          // Lấy variant đầu tiên làm mặc định để hiển thị/sửa
          firstVariant: p.product_variants?.[0] || null
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
    const { error } = await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id)
    if (!error) setProducts(products.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p))
  }

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Mọi dữ liệu liên quan (Hình ảnh, Biến thể) sẽ bị xóa.')) return
    
    try {
      // 1. Xóa ảnh
      await supabase.from('product_images').delete().eq('product_id', id)
      // 2. Xóa biến thể (kích thước, tồn kho)
      await supabase.from('product_variants').delete().eq('product_id', id)
      // 3. Xóa sản phẩm
      const { error } = await supabase.from('products').delete().eq('id', id)
      
      if (error) throw error
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      alert('Lỗi xóa sản phẩm: ' + err.message)
    }
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({ 
      name: '', price: '', brand_id: brands[0]?.id || '', category_id: categories[0]?.id || '', 
      gender: 'unisex', description: '', image_url: '', size: '40', stock_quantity: '10' 
    })
    setIsModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      price: product.price,
      brand_id: product.brand_id,
      category_id: product.category_id,
      gender: product.gender || 'unisex',
      description: product.description || '',
      image_url: product.mainImage,
      size: product.firstVariant?.size || '40',
      stock_quantity: product.firstVariant?.stock_quantity || '0'
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    
    const productPayload = {
      name: formData.name,
      slug: slug,
      price: Number(formData.price),
      brand_id: formData.brand_id,
      category_id: formData.category_id,
      gender: formData.gender,
      description: formData.description,
      is_active: true
    }

    try {
      if (editingId) {
        // UPDATE PRODUCT
        const { error: pErr } = await supabase.from('products').update(productPayload).eq('id', editingId)
        if (pErr) throw pErr

        // UPDATE IMAGE
        if (formData.image_url) {
          await supabase.from('product_images').delete().eq('product_id', editingId)
          await supabase.from('product_images').insert({ product_id: editingId, image_url: formData.image_url, is_primary: true })
        }

        // UPDATE VARIANT (Stock & Size)
        const product = products.find(p => p.id === editingId)
        if (product?.firstVariant) {
          await supabase.from('product_variants').update({ size: formData.size, stock_quantity: Number(formData.stock_quantity) }).eq('id', product.firstVariant.id)
        } else {
          await supabase.from('product_variants').insert({ product_id: editingId, size: formData.size, stock_quantity: Number(formData.stock_quantity) })
        }
        
        alert('Cập nhật thành công!')
      } else {
        // CREATE PRODUCT
        const { data: newProd, error } = await supabase.from('products').insert(productPayload).select().single()
        if (error) throw error

        if (newProd) {
          // INSERT IMAGE
          if (formData.image_url) {
            await supabase.from('product_images').insert({ product_id: newProd.id, image_url: formData.image_url, is_primary: true })
          }
          // INSERT VARIANT
          await supabase.from('product_variants').insert({ product_id: newProd.id, size: formData.size, stock_quantity: Number(formData.stock_quantity) })
        }
        
        alert('Thêm sản phẩm thành công!')
      }
      
      setIsModalOpen(false)
      fetchData() // Refresh
    } catch (err) {
      alert('Đã xảy ra lỗi: ' + err.message)
    }
  }

  if (loading) return <div style={{ padding: '40px' }}>Đang tải dữ liệu...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111' }}>Quản lý Sản Phẩm</h1>
        <button onClick={handleAddNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FF6500', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, width: '80px' }}>ẢNH</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>TÊN SẢN PHẨM</th>
              <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>KHO & SIZE</th>
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
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 400, marginTop: '4px' }}>{product.brands?.name} • {product.categories?.name}</div>
                </td>
                <td style={{ padding: '16px', color: '#4b5563', fontSize: '0.9rem' }}>
                  Size: {product.firstVariant?.size || 'N/A'}<br/>
                  <span style={{ color: '#FF6500', fontWeight: 600 }}>Kho: {product.firstVariant?.stock_quantity || 0}</span>
                </td>
                <td style={{ padding: '16px', fontWeight: 700, color: '#111' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                <td style={{ padding: '16px' }}>
                  <button 
                    onClick={() => toggleStatus(product.id, product.is_active)}
                    style={{ 
                      padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                      background: product.is_active ? '#d1fae5' : '#fee2e2', color: product.is_active ? '#059669' : '#dc2626'
                    }}>
                    {product.is_active ? 'Đang bán' : 'Tạm ẩn'}
                  </button>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '16px' }} title="Sửa">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Tên sản phẩm *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Giá bán (VNĐ) *</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Giới tính</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="kids">Trẻ em</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Size giày *</label>
                  <input type="text" required value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} placeholder="VD: 40" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Số lượng kho *</label>
                  <input type="number" required value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Thương hiệu</label>
                  <select value={formData.brand_id} onChange={e => setFormData({...formData, brand_id: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Danh mục</label>
                  <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Link Ảnh (URL)</label>
                <input placeholder="https://..." value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Mô tả</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#FF6500', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  {editingId ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
