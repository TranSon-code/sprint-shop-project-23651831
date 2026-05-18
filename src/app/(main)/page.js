import { createServerClient } from '@/lib/supabase'
import HomeClient from './HomeClient'

const SUPABASE_STORAGE = 'https://zpjhtkmwtkgrkyptmovs.supabase.co/storage/v1/object/public'

export const metadata = {
  title: 'Sprint Shop - Giày thể thao chính hãng',
  description: 'Mua giày thể thao Nike, Adidas, HOKA, Puma, New Balance, Converse chính hãng. Giá tốt, giao hàng nhanh.',
}

async function getData() {
  const supabase = createServerClient()

  // All banners
  const { data: allBanners, error: bannerError } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    
  if (bannerError) console.error("Banner error:", bannerError)

  const carouselBanners = (allBanners || []).filter(b => b.sort_order !== 3)
  const promoBanner = (allBanners || []).find(b => b.sort_order === 3) || null

  // Brands
  const { data: brands, error: brandError } = await supabase
    .from('brands')
    .select('id, name, logo_url')
    .order('name')

  // New arrival products: get IDs from labels first
  const { data: newLabels } = await supabase
    .from('product_labels')
    .select('product_id')
    .eq('label', 'new')
    .limit(4)

  let newProducts = []
  if (newLabels?.length) {
    const ids = newLabels.map(l => l.product_id)

    // Get products
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug, price, brand_id')
      .in('id', ids)
      .eq('is_active', true)

    // Get brand names
    const { data: brandsData } = await supabase
      .from('brands')
      .select('id, name')

    // Get primary images for these products
    const { data: images } = await supabase
      .from('product_images')
      .select('product_id, image_url, is_primary')
      .in('product_id', ids)
      .eq('is_primary', true)

    const brandMap = Object.fromEntries((brandsData || []).map(b => [b.id, b.name]))
    const imageMap = Object.fromEntries((images || []).map(i => [i.product_id, i.image_url]))

    newProducts = (products || []).map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      brand: brandMap[p.brand_id] || '',
      image: imageMap[p.id] || null,
      label: 'new',
    }))
  }

  // Featured products (8 items) - mix of hot, best_seller, new
  const { data: featuredLabels } = await supabase
    .from('product_labels')
    .select('product_id, label')
    .in('label', ['hot', 'new', 'best_seller'])
    .limit(8)
    
  let featuredProducts = []
  if (featuredLabels?.length) {
    const featuredIds = featuredLabels.map(l => l.product_id)
    const { data: fProducts } = await supabase
      .from('products')
      .select('id, name, slug, price, brand_id')
      .in('id', featuredIds)
      .eq('is_active', true)
      
    // Get brand names and images for featured
    const { data: fBrandsData } = await supabase.from('brands').select('id, name')
    const { data: fImages } = await supabase.from('product_images').select('product_id, image_url, is_primary').in('product_id', featuredIds).eq('is_primary', true)
    
    const fBrandMap = Object.fromEntries((fBrandsData || []).map(b => [b.id, b.name]))
    const fImageMap = Object.fromEntries((fImages || []).map(i => [i.product_id, i.image_url]))
    
    featuredProducts = (fProducts || []).map(p => {
      const labelData = featuredLabels.find(l => l.product_id === p.id)
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        brand: fBrandMap[p.brand_id] || '',
        image: fImageMap[p.id] || null,
        label: labelData ? labelData.label : null,
      }
    })
  }

  return { carouselBanners, promoBanner, brands: brands || [], newProducts, featuredProducts }
}


export default async function HomePage() {
  const { carouselBanners, promoBanner, brands, newProducts, featuredProducts } = await getData()

  const newArrivalBannerUrl = `${SUPABASE_STORAGE}/banners/banner/banner%20new%20arrival.png`

  return (
    <HomeClient
      carouselBanners={carouselBanners}
      promoBanner={promoBanner}
      brands={brands}
      newProducts={newProducts}
      featuredProducts={featuredProducts}
      newArrivalBannerUrl={newArrivalBannerUrl}
    />
  )
}
