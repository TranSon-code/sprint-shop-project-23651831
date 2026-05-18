'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  createProductRecord, 
  updateProductRecord, 
  deleteProductRecord, 
  toggleProductStatusRecord,
  uploadImageAction,
  saveProductImageRecord,
  deleteProductImageRecord,
  setPrimaryImageRecord
} from './actions'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand_id: '',
    category_id: '',
    gender: 'unisex',
    description: '',
    size: '40',          
    stock_quantity: '10',
    label: '',
    is_active: true
  })

  // State for Images
  const [images, setImages] = useState([]) // { id?: string, image_url: string, file?: File, isDeleted?: boolean }

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterBrand, setFilterBrand] = useState('all')

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
          product_images (id, image_url, is_primary),
          product_variants (id, size, stock_quantity),
          product_labels (id, label)
        `).order('created_at', { ascending: false })
      ])

      if (bData) setBrands(bData)
      if (cData) setCategories(cData)
      if (pData) {
        const formatted = pData.map(p => {
          const primaryImg = p.product_images?.find(img => img.is_primary) || p.product_images?.[0]
          return {
            ...p,
            mainImage: primaryImg?.image_url || '/placeholder.png',
            firstVariant: p.product_variants?.[0] || null,
            label: p.product_labels?.[0]?.label || ''
          }
        })
        setProducts(formatted)
      }
    } catch (err) {
      console.error(err)
      toast.error('Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      await toggleProductStatusRecord(id, currentStatus)
      setProducts(products.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p))
      toast.success('Đã cập nhật trạng thái')
    } catch (err) {
      toast.error('Lỗi cập nhật trạng thái: ' + err.message)
    }
  }

  const executeDelete = async () => {
    if (!confirmDeleteId) return
    const id = confirmDeleteId
    setConfirmDeleteId(null) // Đóng modal ngay lập tức

    const loadingToast = toast.loading('Đang xóa sản phẩm...')
    try {
      await deleteProductRecord(id)
      setProducts(products.filter(p => p.id !== id))
      toast.success('Xóa sản phẩm thành công!', { id: loadingToast })
    } catch (err) {
      toast.error('Lỗi xóa sản phẩm: ' + err.message, { id: loadingToast })
    }
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormData({ 
      name: '', price: '', brand_id: brands[0]?.id || '', category_id: categories[0]?.id || '', 
      gender: 'unisex', description: '', size: '40', stock_quantity: '10', label: '', is_active: true 
    })
    setImages([])
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
      size: product.firstVariant?.size || '40',
      stock_quantity: product.firstVariant?.stock_quantity || '0',
      label: product.label || '',
      is_active: product.is_active
    })
    
    const existingImages = (product.product_images || []).map(img => ({
      id: img.id,
      image_url: img.image_url
    }))
    setImages(existingImages)
    setIsModalOpen(true)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newImages = files.map(file => ({
      file,
      image_url: URL.createObjectURL(file) 
    }))
    
    setImages([...images, ...newImages])
  }

  const handleDeleteImage = (index) => {
    const updated = [...images]
    if (updated[index].id) {
      updated[index].isDeleted = true
    } else {
      updated.splice(index, 1)
    }
    setImages(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const loadingToast = toast.loading(editingId ? 'Đang cập nhật sản phẩm...' : 'Đang thêm sản phẩm mới...')
    
    const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    
    const productPayload = {
      name: formData.name,
      slug: slug,
      price: Number(formData.price),
      brand_id: formData.brand_id,
      category_id: formData.category_id,
      gender: formData.gender,
      description: formData.description,
      is_active: formData.is_active
    }

    try {
      let productId = editingId

      if (editingId) {
        // UPDATE PRODUCT
        const product = products.find(p => p.id === editingId)
        const variantPayload = {
          id: product?.firstVariant?.id,
          size: formData.size,
          stock_quantity: Number(formData.stock_quantity)
        }
        await updateProductRecord(editingId, productPayload, variantPayload, { label: formData.label })
      } else {
        // CREATE PRODUCT
        const variantPayload = { size: formData.size, stock_quantity: Number(formData.stock_quantity) }
        productId = await createProductRecord(productPayload, variantPayload, { label: formData.label })
      }

      // PROCESS IMAGES
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        
        if (img.isDeleted && img.id) {
          await deleteProductImageRecord(img.id)
        } 
        else if (img.file) {
          const fileExt = img.file.name.split('.').pop()
          const fileName = `${productId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          
          // Use formData to send file to server action
          const uploadFormData = new FormData()
          uploadFormData.append('file', img.file)
          uploadFormData.append('fileName', fileName)
          
          const publicUrl = await uploadImageAction(uploadFormData)
          await saveProductImageRecord(productId, publicUrl, false)
        }
      }

      // SET PRIMARY IMAGE
      await setPrimaryImageRecord(productId)
      
      toast.success(editingId ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!', { id: loadingToast })
      setIsModalOpen(false)
      fetchData() // Refresh
    } catch (err) {
      toast.error('Đã xảy ra lỗi: ' + err.message, { id: loadingToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Lọc và sắp xếp sản phẩm ở Client
  let filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBrand = filterBrand === 'all' || p.brand_id === filterBrand
    return matchesSearch && matchesBrand
  })
  
  if (sortBy === 'a-z') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === 'z-a') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'stock_desc') {
    filteredProducts.sort((a, b) => (b.firstVariant?.stock_quantity || 0) - (a.firstVariant?.stock_quantity || 0))
  } else if (sortBy === 'stock_asc') {
    filteredProducts.sort((a, b) => (a.firstVariant?.stock_quantity || 0) - (b.firstVariant?.stock_quantity || 0))
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

      {/* Thanh công cụ: Tìm kiếm, Lọc Hãng và Sắp xếp */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên sản phẩm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 16px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
          />
        </div>
        
        <select 
          value={filterBrand} 
          onChange={(e) => setFilterBrand(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', cursor: 'pointer', background: '#f9fafb', minWidth: '150px' }}
        >
          <option value="all">Tất cả thương hiệu</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', cursor: 'pointer', background: '#f9fafb', minWidth: '180px' }}
        >
          <option value="newest">Mới nhất</option>
          <option value="a-z">Tên: A - Z</option>
          <option value="z-a">Tên: Z - A</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao xuống Thấp</option>
          <option value="stock_desc">Tồn kho: Nhiều nhất</option>
          <option value="stock_asc">Tồn kho: Ít nhất</option>
        </select>
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
            {filteredProducts.map(product => (
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
                  <button onClick={() => setConfirmDeleteId(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                  Không tìm thấy sản phẩm nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Xác nhận Xóa */}
      {confirmDeleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111' }}>Xác nhận xóa</h3>
            <p style={{ color: '#4b5563', margin: '16px 0', lineHeight: 1.5 }}>
              Bạn có chắc chắn muốn xóa sản phẩm này? Mọi dữ liệu liên quan (Hình ảnh, Biến thể) sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>
                Hủy
              </button>
              <button onClick={executeDelete} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Xóa Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      )}

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
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Nhãn nổi bật</label>
                  <select value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                    <option value="">(Không có)</option>
                    <option value="new">Mới (NEW)</option>
                    <option value="hot">Nóng (HOT)</option>
                    <option value="best_seller">Bán chạy (BEST SELLER)</option>
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

              {/* Hình ảnh Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Hình ảnh sản phẩm</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {images.filter(img => !img.isDeleted).map((img, index) => {
                    const originalIndex = images.findIndex(orig => orig === img);
                    return (
                      <div key={originalIndex} style={{ width: '80px', height: '80px', position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <Image src={img.image_url} alt="preview" fill style={{ objectFit: 'cover' }} unoptimized />
                        <button type="button" onClick={() => handleDeleteImage(originalIndex)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                          <X size={14} />
                        </button>
                      </div>
                    )
                  })}
                  
                  <label style={{ width: '80px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d1d5db', borderRadius: '6px', cursor: 'pointer', color: '#6b7280', background: '#f9fafb' }}>
                    <Upload size={20} style={{ marginBottom: '4px' }} />
                    <span style={{ fontSize: '0.7rem' }}>Tải ảnh lên</span>
                    <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
                  </label>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px' }}>Bạn có thể chọn nhiều ảnh cùng lúc. Ảnh đầu tiên sẽ được làm ảnh đại diện.</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Mô tả</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                <input 
                  type="checkbox" 
                  id="isActiveCheck" 
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }} 
                />
                <label htmlFor="isActiveCheck" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
                  Hiển thị sản phẩm (Đang bán)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Hủy</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: isSubmitting ? '#ccc' : '#FF6500', color: '#fff', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Đang Xử Lý...' : (editingId ? 'Lưu Thay Đổi' : 'Thêm Mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
