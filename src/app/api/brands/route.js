import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET /api/brands
export async function GET() {
  const { data, error } = await supabase.from('brands').select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}
