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

// In browser environments, using the same-origin proxy (/api/supabase) eliminates CORS errors,
// browser sandbox restrictions inside iframes, and ISP/adblocker blocks of supabase.co.
const getActiveUrl = (): string => {
  if (!isSupabaseConfigured()) {
    return 'https://missing-supabase-url.supabase.co';
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/supabase`;
  }
  return supabaseUrl;
};

const activeUrl = getActiveUrl();
const activeKey = isSupabaseConfigured() ? supabaseAnonKey : 'missing-supabase-anon-key';

/**
 * Resilient fetch wrapper:
 * 1. Tries the active URL (proxied through same-origin Vite dev proxy in browser).
 * 2. If the proxy fails or returns 404/502, automatically falls back to direct Supabase URL.
 * 3. If direct fetch fails (e.g. browser CORS/CSP), retries via the proxy.
 */
const resilientFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  try {
    const res = await fetch(input, init);
    // If the proxy returns 404 or bad gateway, attempt direct fallback
    if (!res.ok && (res.status === 404 || res.status === 502 || res.status === 503) && urlStr.includes('/api/supabase') && supabaseUrl) {
      const directUrl = urlStr.replace(/^https?:\/\/[^/]+\/api\/supabase/, supabaseUrl);
      return await fetch(directUrl, init);
    }
    return res;
  } catch (err) {
    // If proxied fetch threw network error, attempt direct fallback
    if (urlStr.includes('/api/supabase') && supabaseUrl) {
      try {
        const directUrl = urlStr.replace(/^https?:\/\/[^/]+\/api\/supabase/, supabaseUrl);
        return await fetch(directUrl, init);
      } catch {
        // preserve original error
      }
    } else if (!urlStr.includes('/api/supabase') && typeof window !== 'undefined' && window.location?.origin) {
      // If direct fetch failed (e.g. CORS preflight in iframe), retry via proxy
      try {
        const parsed = new URL(urlStr);
        const proxyUrl = `${window.location.origin}/api/supabase${parsed.pathname}${parsed.search}`;
        return await fetch(proxyUrl, init);
      } catch {
        // preserve original error
      }
    }
    throw err;
  }
};

export const supabase: SupabaseClient = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'majumdar_khamar_auth_session'
  },
  global: {
    fetch: resilientFetch
  }
});


