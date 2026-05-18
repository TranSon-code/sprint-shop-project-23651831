'use server'

import { createServerClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function registerUser(data) {
  const supabase = createServerClient()
  
  // Kiểm tra email tồn tại (dùng maybeSingle để tránh lỗi 0 rows)
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', data.email)
    .maybeSingle()

  if (existingUser) {
    return { error: 'Email đã được sử dụng' }
  }

  // Mã hóa mật khẩu
  const password_hash = await bcrypt.hash(data.password, 10)

  // Lưu user
  const { error } = await supabase
    .from('users')
    .insert({
      full_name: data.fullName,
      email: data.email,
      password_hash: password_hash,
      role: 'user',
      gender: data.gender,
      address: data.address,
      province: data.province,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('Lỗi đăng ký:', error)
    return { error: 'Không thể tạo tài khoản lúc này. Hãy đảm bảo chạy lệnh GRANT.' }
  }

  return { success: true }
}
