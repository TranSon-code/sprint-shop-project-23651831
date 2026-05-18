import { createServerClient } from '@/lib/supabase'
import ProductDetailClient from './ProductDetailClient'
import { notFound } from 'next/navigation'

// Revalidate 1 giờ một lần cho các trang chi tiết sản phẩm
export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = createServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true)

  if (!products) return []
  return products.map((p) => ({
    slug: p.slug,
  }))
}

export default async function ProductDetailPage({ params }) {
  // Await params if using Next.js 15+, but standard Next.js 14 params are synchronous. 
  // We'll safely destructure it.
  const resolvedParams = await params
  const { slug } = resolvedParams

  const supabase = createServerClient()

  // 1. Fetch Product
  const { data: product } = await supabase
    .from('products')
    .select('*, brands(name), categories(name)')
    .eq('slug', slug)
    .single()

  if (!product) {
    return notFound()
  }

  // 2. Fetch Images
  const { data: imagesData } = await supabase
    .from('product_images')
    .select('image_url, is_primary')
    .eq('product_id', product.id)
    .order('is_primary', { ascending: false }) // Primary ảnh đầu tiên

  const images = (imagesData || []).map(img => img.image_url)

  // 3. Fetch Variants (Sizes & Stock)
  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, size, stock_quantity')
    .eq('product_id', product.id)
    .order('size', { ascending: true })

  // 4. Fetch Label
  const { data: labelData } = await supabase
    .from('product_labels')
    .select('label')
    .eq('product_id', product.id)
    .single()

  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    description: product.description,
    brand: product.brands?.name || '',
    category: product.categories?.name || '',
    gender: product.gender,
    label: labelData?.label || null,
    images: images,
    variants: variants || []
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <ProductDetailClient product={productData} />
      </div>
    </div>
  )
}
