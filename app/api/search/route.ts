import { type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const searchText = searchParams.get('query')

  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseKey = process.env.SUPABASE_KEY as string
  const supabaseClient = createClient(supabaseUrl, supabaseKey)
  
  const { data: phrases } = await supabaseClient
  .from('phrase')
  .select("name")
  .ilike('name', searchText+'%')
  .limit(10)
  .order('name', { ascending: true })
  
  return Response.json(phrases)
}