import { createServerClient } from '@/lib/supabase'
import ProductsClient from './ProductsClient'

export default async function ProductsPage({ searchParams }) {
  const supabase = createServerClient()
  
  // In Next.js 15, searchParams is a promise, so we await it
  const params = await searchParams || {}

  const page = parseInt(params.page) || 1
  const limit = 16
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select('id, name, slug, price, brand_id, category_id, gender', { count: 'exact' })
    .eq('is_active', true)

  // 1. Lọc Thương Hiệu
  // Lấy list brands trước để map ID
  const { data: allBrands } = await supabase.from('brands').select('id, name')
  const brandMap = Object.fromEntries((allBrands || []).map(b => [b.name, b.id]))
  const brandReverseMap = Object.fromEntries((allBrands || []).map(b => [b.id, b.name]))

  if (params.brand) {
    const brandNames = params.brand.split(',')
    const brandIds = brandNames.map(n => brandMap[n]).filter(Boolean)
    if (brandIds.length > 0) {
      query = query.in('brand_id', brandIds)
    }
  }

  // 2. Lọc Danh Mục
  const { data: allCategories } = await supabase.from('categories').select('id, name, slug')
  const catMap = Object.fromEntries((allCategories || []).map(c => [c.slug, c.id]))
  const catReverseMap = Object.fromEntries((allCategories || []).map(c => [c.id, c.slug]))

  if (params.category) {
    const catSlugs = params.category.split(',')
    const catIds = catSlugs.map(s => catMap[s]).filter(Boolean)
    if (catIds.length > 0) {
      query = query.in('category_id', catIds)
    }
  }

  // 3. Lọc Giới Tính
  if (params.gender) {
    const genders = params.gender.split(',')
    query = query.in('gender', genders)
  }

  // 4. Lọc Khoảng Giá
  if (params.price) {
    const prices = params.price.split(',')
    let orConditions = []
    prices.forEach(p => {
      if (p === 'under_1m') orConditions.push(`price.lt.1000000`)
      if (p === '1m_2m') orConditions.push(`and(price.gte.1000000,price.lt.2000000)`)
      if (p === '2m_3m') orConditions.push(`and(price.gte.2000000,price.lt.3000000)`)
      if (p === 'over_3m') orConditions.push(`price.gte.3000000`)
    })
    if (orConditions.length > 0) {
      query = query.or(orConditions.join(','))
    }
  }

  // 5. Sắp xếp
  const sort = params.sort || 'new'
  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    // new
    query = query.order('id', { ascending: false }) // Fallback since we might not have created_at
  }

  // Pagination
  query = query.range(offset, offset + limit - 1)

  const { data: products, count } = await query

  // Lấy ảnh
  let finalProducts = []
  if (products && products.length > 0) {
    const productIds = products.map(p => p.id)
    const { data: images } = await supabase
      .from('product_images')
      .select('product_id, image_url')
      .in('product_id', productIds)
      .eq('is_primary', true)
      
    const imageMap = Object.fromEntries((images || []).map(i => [i.product_id, i.image_url]))
    
    // Lấy label
    const { data: labels } = await supabase
      .from('product_labels')
      .select('product_id, label')
      .in('product_id', productIds)
      
    const labelMap = Object.fromEntries((labels || []).map(l => [l.product_id, l.label]))

    finalProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      brand: brandReverseMap[p.brand_id] || '',
      category_slug: catReverseMap[p.category_id] || '',
      gender: p.gender,
      image: imageMap[p.id] || null,
      label: labelMap[p.id] || null
    }))
  }

  const initialData = {
    products: finalProducts,
    totalCount: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <ProductsClient initialData={initialData} initialParams={params} />
      </div>
    </div>
  )
}
