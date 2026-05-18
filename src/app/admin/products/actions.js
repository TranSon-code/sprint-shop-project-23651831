'use server'

import { createServerClient } from '@/lib/supabase'

export async function createProductRecord(payload, variantPayload, labelPayload) {
  const supabase = createServerClient()
  
  // 1. Create product
  const { data: product, error: pError } = await supabase
    .from('products')
    .insert(payload)
    .select()
    .single()
    
  if (pError) throw new Error(pError.message)
  
  // 2. Create variant
  const { error: vError } = await supabase
    .from('product_variants')
    .insert({ ...variantPayload, product_id: product.id })
    
  if (vError) throw new Error(vError.message)
  
  // 3. Create label
  if (labelPayload && labelPayload.label) {
    await supabase
      .from('product_labels')
      .insert({ product_id: product.id, label: labelPayload.label })
  }
  
  return product.id
}

export async function updateProductRecord(id, payload, variantPayload, labelPayload) {
  const supabase = createServerClient()
  
  // 1. Update product
  const { error: pError } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    
  if (pError) throw new Error(pError.message)
  
  // 2. Update variant
  if (variantPayload.id) {
    await supabase.from('product_variants')
      .update({ size: variantPayload.size, stock_quantity: variantPayload.stock_quantity })
      .eq('id', variantPayload.id)
  } else {
    await supabase.from('product_variants')
      .insert({ product_id: id, size: variantPayload.size, stock_quantity: variantPayload.stock_quantity })
  }
  
  // 3. Update label
  await supabase.from('product_labels').delete().eq('product_id', id)
  if (labelPayload && labelPayload.label) {
    await supabase.from('product_labels').insert({ product_id: id, label: labelPayload.label })
  }
  
  return id
}

export async function deleteProductRecord(id) {
  const supabase = createServerClient()
  
  // DB CASCADE is not set, so we delete manually
  await supabase.from('product_images').delete().eq('product_id', id)
  await supabase.from('product_variants').delete().eq('product_id', id)
  await supabase.from('product_labels').delete().eq('product_id', id)
  
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  return true
}

export async function toggleProductStatusRecord(id, currentStatus) {
  const supabase = createServerClient()
  const { error } = await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

export async function uploadImageAction(formData) {
  const supabase = createServerClient()
  const file = formData.get('file')
  const fileName = formData.get('fileName')
  
  // Convert File to ArrayBuffer (supported by Supabase JS in Node)
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true
    })
    
  if (error) throw new Error(error.message)
  
  const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
  return publicUrl
}

export async function saveProductImageRecord(productId, imageUrl, isPrimary) {
  const supabase = createServerClient()
  const { error } = await supabase.from('product_images').insert({
    product_id: productId,
    image_url: imageUrl,
    is_primary: isPrimary
  })
  if (error) throw new Error(error.message)
  return true
}

export async function deleteProductImageRecord(imageId) {
  const supabase = createServerClient()
  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) throw new Error(error.message)
  return true
}

export async function setPrimaryImageRecord(productId) {
  const supabase = createServerClient()
  
  const { data: finalImages } = await supabase.from('product_images').select('id').eq('product_id', productId).order('created_at', { ascending: true })
  if (finalImages && finalImages.length > 0) {
    await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId)
    await supabase.from('product_images').update({ is_primary: true }).eq('id', finalImages[0].id)
  }
  return true
}
