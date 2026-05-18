'use server'

import { createClient } from '@supabase/supabase-js'

// Dùng Secret Key (Service Role) để có toàn quyền Update xuyên qua RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { db: { schema: 'sneaker_shop' } }
)

export async function updateOrderStatus(orderId, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    
  if (error) {
    console.error('Lỗi update order:', error)
    throw new Error('Không thể cập nhật trạng thái đơn hàng')
  }
  
  return { success: true }
}
