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

const getDirectUrl = (urlStr: string): string => {
  if (!supabaseUrl) return urlStr;
  return urlStr
    .replace(/^https?:\/\/[^/]+\/api\/supabase/, supabaseUrl)
    .replace(/^\/api\/supabase/, supabaseUrl);
};

const executeDirectFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const directUrl = getDirectUrl(urlStr);
  return await fetch(directUrl, init);
};

/**
 * Resilient fetch wrapper with proxy-fallback logic:
 * 1. Checks response.ok, application/json content-type, and non-empty body before parsing JSON.
 * 2. Wraps JSON parsing in try/catch to fall back cleanly without breaking login flow.
 * 3. In production (PROD), bypasses the proxy path entirely and calls direct Supabase endpoint.
 * 4. Emits console.warn diagnostics at each fallback trigger point.
 */
export const resilientFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // 3. Skip proxy in production builds and go straight to direct Supabase endpoint
  if (import.meta.env.PROD && urlStr.includes('/api/supabase')) {
    console.warn('[resilientFetch] Proxy unavailable or invalid response, using direct endpoint');
    return await executeDirectFetch(input, init);
  }

  // If not targeting proxy path, fetch directly
  if (!urlStr.includes('/api/supabase')) {
    return await fetch(input, init);
  }

  // Development mode proxy attempt with resilient fallback
  try {
    const response = await fetch(input, init);

    // 1. Check response.ok, application/json content-type, and non-empty body
    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');
    const isNonEmpty = contentLength !== '0';

    if (!response.ok || !contentType.toLowerCase().includes('application/json') || !isNonEmpty) {
      console.warn('[resilientFetch] Proxy unavailable or invalid response, using direct endpoint');
      return await executeDirectFetch(input, init);
    }

    // 2. Wrap .json() check in try/catch to silently catch errors and fall back to direct endpoint
    try {
      const clonedResponse = response.clone();
      await clonedResponse.json();
    } catch {
      console.warn('[resilientFetch] Proxy unavailable or invalid response, using direct endpoint');
      return await executeDirectFetch(input, init);
    }

    return response;
  } catch {
    console.warn('[resilientFetch] Proxy unavailable or invalid response, using direct endpoint');
    return await executeDirectFetch(input, init);
  }
};

const getActiveUrl = (): string => {
  if (!isSupabaseConfigured()) {
    return 'https://missing-supabase-url.supabase.co';
  }
  // In production builds, skip proxy attempt entirely and use direct Supabase project URL
  if (!import.meta.env.PROD && typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/supabase`;
  }
  return supabaseUrl;
};

const activeUrl = getActiveUrl();
const activeKey = isSupabaseConfigured() ? supabaseAnonKey : 'missing-supabase-anon-key';

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


