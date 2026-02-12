import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

/**
 * Supabase client using service role key.
 * Bypasses RLS — use only in trusted server contexts (cron jobs, admin actions).
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
