import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
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

    const { data, error } = await supabase.from('products').insert([body]).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }
}
