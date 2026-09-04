import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 1. Temporary debug logs requested to inspect raw values at initialization time
console.log('[DEBUG] Supabase URL:', JSON.stringify(import.meta.env.VITE_SUPABASE_URL));
console.log('[DEBUG] Supabase Anon Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);

/**
 * Defensively cleans and sanitizes the Supabase URL.
 * Handles:
 * - Hidden whitespace, newlines, and tabs
 * - Surrounding quotes ("..." or '...')
 * - Trailing slashes (https://xyz.supabase.co/ -> https://xyz.supabase.co)
 * - Accidental subpaths (/rest/v1, /auth/v1) which cause GoTrue to produce:
 *   "Invalid path specified in request URL"
 */
function sanitizeSupabaseUrl(raw: any): string {
  if (!raw || typeof raw !== 'string') return '';
  let clean = raw.trim().replace(/^["'`]+|["'`]+$/g, '').trim();
  try {
    const parsed = new URL(clean);
    // If the path contains /rest or /auth, user copied the REST endpoint instead of Project URL
    if (parsed.pathname.includes('/rest') || parsed.pathname.includes('/auth')) {
      console.warn('[Supabase Configuration] Detected subpath in VITE_SUPABASE_URL. Normalizing to origin:', parsed.origin);
      return parsed.origin;
    }
    return clean.replace(/\/+$/, '');
  } catch {
    return clean.replace(/\/+$/, '');
  }
}

function sanitizeSupabaseKey(raw: any): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.trim().replace(/^["'`]+|["'`]+$/g, '').trim();
}

export const supabaseUrl: string = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const supabaseAnonKey: string = sanitizeSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

/**
 * Validates whether Supabase environment variables are properly defined and valid
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('missing-supabase') &&
    !supabaseAnonKey.includes('your-anon') &&
    !supabaseAnonKey.includes('placeholder') &&
    !supabaseAnonKey.includes('missing-supabase') &&
    supabaseUrl.startsWith('http')
  );
};

// Immediate console diagnostics on module load
if (!isSupabaseConfigured()) {
  console.warn(
    '[Supabase Configuration] ⚠️ Supabase environment variables are missing or invalid!\n' +
    `- VITE_SUPABASE_URL: ${supabaseUrl ? `"${supabaseUrl}"` : '(undefined / empty)'}\n` +
    `- VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '(present but may be placeholder)' : '(undefined / empty)'}\n` +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment settings.'
  );
} else {
  console.log('[DEBUG] Sanitized Supabase URL in use:', JSON.stringify(supabaseUrl));
}

// 2. Official createClient initialization with NO custom path wrappers
const activeUrl = isSupabaseConfigured() ? supabaseUrl : 'https://missing-supabase-url.supabase.co';
const activeKey = isSupabaseConfigured() ? supabaseAnonKey : 'missing-supabase-anon-key';

export const supabase: SupabaseClient = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'majumdar_khamar_auth_session'
  }
});


