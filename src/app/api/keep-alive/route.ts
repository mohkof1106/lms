import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()

    // Lightweight query — count only, no row data returned
    const { count, error } = await supabase
      .from('company_settings')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('[keep-alive] Supabase query failed:', error.message)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      settings_count: count,
    })
  } catch (err) {
    console.error('[keep-alive] Unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
