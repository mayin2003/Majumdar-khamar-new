import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Hardcoded fallback configuration for production / Cloud Run environments
const FALLBACK_SUPABASE_URL = 'https://kmtcucgwensdaeohikps.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdGN1Y2d3ZW5zZGFlb2hpa3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDEwMzMsImV4cCI6MjEwMzk3NzAzM30.r-RfrK1XQJ58SEYzjI8ihYmccRAJ3iTMRXYsKVWO9k0';

function sanitizeSupabaseUrl(raw: unknown): string {
  if (!raw || typeof raw !== 'string') return '';
  const clean = raw.trim().replace(/^["'`]+|["'`]+$/g, '').trim();
  try {
    const parsed = new URL(clean);
    if (parsed.pathname.includes('/rest') || parsed.pathname.includes('/auth')) {
      return parsed.origin;
    }
    return clean.replace(/\/+$/, '');
  } catch {
    return clean.replace(/\/+$/, '');
  }
}

function sanitizeSupabaseKey(raw: unknown): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.trim().replace(/^["'`]+|["'`]+$/g, '').trim();
}

// Fallback guarantees production builds never read undefined
const rawUrl = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const rawKey = sanitizeSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabaseUrl: string = rawUrl || FALLBACK_SUPABASE_URL;
export const supabaseAnonKey: string = rawKey || FALLBACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('http')
  );
};

// Single direct Supabase client for the entire application.
// No proxy (/api/supabase), direct connection only, public anon key only.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'majumdar_khamar_auth_session',
  },
});
