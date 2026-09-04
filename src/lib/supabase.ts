import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Vite-prefixed environment variables at build time
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseUrl: string = (typeof rawUrl === 'string' ? rawUrl : '').trim();
export const supabaseAnonKey: string = (typeof rawKey === 'string' ? rawKey : '').trim();

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
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment settings and trigger a fresh build.'
  );
}

/**
 * Asserts that Supabase is configured; throws a clear error if missing
 */
export const assertSupabaseConfigured = (): void => {
  if (!isSupabaseConfigured()) {
    const errorMsg =
      'Supabase কনফিগারেশন পাওয়া যাচ্ছে না। এনভায়রনমেন্ট ভেরিয়েবল VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY সঠিকভাবে সেট করা হয়েছে কিনা যাচাই করুন।';
    console.error(`[Supabase Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }
};

// Internal raw client instance
const internalClient: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://missing-supabase-url.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'missing-supabase-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'majumdar_khamar_auth_session'
    }
  }
);

/**
 * Guarded Supabase Client Proxy
 * If Supabase is not configured, calling database methods throws a clear catchable Error
 * instead of failing mysteriously with broken network calls to placeholder domains.
 */
export const supabase: SupabaseClient = new Proxy(internalClient, {
  get(target, prop, receiver) {
    // Methods that require active database connection
    if (['from', 'rpc', 'storage'].includes(String(prop))) {
      if (!isSupabaseConfigured()) {
        assertSupabaseConfigured();
      }
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === 'function') {
      return val.bind(target);
    }
    return val;
  }
});

