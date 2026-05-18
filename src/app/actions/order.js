'use server'

import { createServerClient } from '@/lib/supabase'
import { auth } from '@/lib/auth'

export async function createOrder(data) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: 'Bạn phải đăng nhập để đặt hàng.' }
    }

    const supabase = createServerClient()
    const userId = session.user.id

    const { items, phone, address, province } = data
    if (!items || items.length === 0) return { error: 'Đơn hàng trống.' }

    // Tính lại tổng tiền từ Database để bảo mật (không tin tưởng giá từ Client)
    const variantIds = items.map(i => i.variantId)
    const { data: dbVariants, error: varError } = await supabase
      .from('product_variants')
      .select('id, stock_quantity, products(price)')
      .in('id', variantIds)

    if (varError || !dbVariants) {
      return { error: 'Lỗi khi lấy thông tin sản phẩm.' }
    }

    let totalAmount = 0
    const orderItemsToInsert = []

    for (const item of items) {
      const dbVar = dbVariants.find(v => v.id === item.variantId)
      if (!dbVar) return { error: 'Sản phẩm không tồn tại.' }
      if (dbVar.stock_quantity < item.quantity) {
        return { error: `Sản phẩm này không đủ số lượng trong kho.` }
      }

      const price = dbVar.products.price
      totalAmount += price * item.quantity

      orderItemsToInsert.push({
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: price
      })
    }

    const fullAddress = `${address}, ${province}`

    // 1. Tạo Order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        final_amount: totalAmount,
        status: 'pending',
        shipping_address: fullAddress,
        phone: phone,
      })
      .select('id')
      .single()

    if (orderError) throw orderError

    // 2. Tạo Order Items
    const finalOrderItems = orderItemsToInsert.map(oi => ({
      ...oi,
      order_id: newOrder.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(finalOrderItems)

    if (itemsError) throw itemsError

    // 3. Tạo Payment
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        order_id: newOrder.id,
        amount: totalAmount,
        status: 'pending'
      })

    if (paymentError) throw paymentError

    // 4. Trừ Stock (Tạm thời trừ thẳng)
    for (const item of items) {
      const dbVar = dbVariants.find(v => v.id === item.variantId)
      await supabase
        .from('product_variants')
        .update({ stock_quantity: dbVar.stock_quantity - item.quantity })
        .eq('id', item.variantId)
    }

    return { success: true, orderId: newOrder.id }
  } catch (err) {
    console.error('Lỗi khi tạo đơn hàng:', err)
    return { error: 'Đã xảy ra lỗi hệ thống khi đặt hàng.' }
  }
}
