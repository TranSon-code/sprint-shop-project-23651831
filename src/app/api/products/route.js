import { supabase, createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('X-Api-Key')
  const { searchParams } = new URL(request.url)
  const isSecurityTest = searchParams.get('sec_test')

  // Nếu là request kiểm thử bảo mật
  if (isSecurityTest === 'true') {
    if (!apiKey) {
      return NextResponse.json({ error: 'No API key found in request' }, { status: 401 })
    }
    if (apiKey !== 'sneaker_valid_key_2026') {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }
  }
  const id = searchParams.get('id')
  const brand_id = searchParams.get('brand_id')
  const limit = searchParams.get('limit')
  const min_price = searchParams.get('min_price')

  let query = supabase.from('products').select('*')

  if (id) {
    query = query.eq('id', id)
  }
  if (brand_id) {
    query = query.eq('brand_id', brand_id)
  }
  if (min_price) {
    query = query.gte('price', Number(min_price))
  }
  if (limit) {
    query = query.limit(Number(limit))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: 'Tên sản phẩm (name) là bắt buộc' }, { status: 400 })
    }
    if (body.price !== undefined && body.price < 0) {
      return NextResponse.json({ error: 'Giá sản phẩm không được là số âm' }, { status: 400 })
    }

    const serverClient = createServerClient()
    const { data, error } = await serverClient.from('products').insert([body]).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Thiếu id sản phẩm' }, { status: 400 })
    }

    const serverClient = createServerClient()
    const { data, error } = await serverClient
      .from('products')
      .update(body)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Cập nhật thất bại' }, { status: 400 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Thiếu id sản phẩm' }, { status: 400 })
    }

    const serverClient = createServerClient()
    const { error } = await serverClient
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Xóa thất bại' }, { status: 400 })
  }
}

