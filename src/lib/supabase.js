import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ninfirtfoilzbijocutn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmZpcnRmb2lsemJpam9jdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzY5MjUsImV4cCI6MjA5MDAxMjkyNX0.AWjABVIWdCjylsVtUg4aKGmbivk_gsfIBnmr03Qrleo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
