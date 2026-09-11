import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AdminAuthUser {
  id: string;
  email: string;
  userMetadata?: Record<string, any>;
  appMetadata?: Record<string, any>;
}

/**
 * Verify whether an authenticated user has admin privileges.
 * 1. Checks user_metadata / app_metadata for 'admin' role or 'is_admin' flag.
 * 2. If VITE_ADMIN_EMAIL is configured in environment, verifies email is in the allowlist.
 * 3. Default: any authenticated user in the closed Supabase Auth pool is authorized.
 */
export function isUserAuthorizedAdmin(user: AdminAuthUser | null): boolean {
  if (!user || !user.email) return false;

  const email = user.email.toLowerCase().trim();

  // Check user metadata / app metadata
  if (
    user.userMetadata?.role === 'admin' ||
    user.appMetadata?.role === 'admin' ||
    user.userMetadata?.is_admin === true ||
    user.appMetadata?.is_admin === true
  ) {
    return true;
  }

  // Check VITE_ADMIN_EMAIL allowlist if defined
  const adminEmailConfig = import.meta.env.VITE_ADMIN_EMAIL;
  if (adminEmailConfig && typeof adminEmailConfig === 'string') {
    const allowedEmails = adminEmailConfig
      .split(',')
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowedEmails.length > 0) {
      return allowedEmails.includes(email);
    }
  }

  // If no specific role metadata or email restriction is provided,
  // any pre-provisioned user in the dedicated Supabase Auth pool is authorized.
  return true;
}

/**
 * Sign in admin using Supabase Auth (Email + Password) ONLY.
 * No localStorage mock fallback. If Supabase rejects credentials, login fails.
 */
export async function signInAdmin(email: string, pass: string): Promise<AdminAuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    throw new Error('ইমেইল এবং পাসওয়ার্ড দুটিই পূরণ করা আবশ্যক!');
  }

  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase কনফিগারেশন পাওয়া যায়নি! অনুগ্রহ করে হোস্টিং এনভায়রনমেন্টে VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY যোগ করুন।'
    );
  }

  console.log('[DEBUG Auth] Attempting signInWithPassword for email:', JSON.stringify(cleanEmail));

  let data: any = null;
  let error: any = null;

  try {
    const res = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass
    });
    data = res.data;
    error = res.error;
  } catch (err: any) {
    console.error('[Supabase Auth] signInWithPassword exception:', err);
    error = err;
  }

  if (error) {
    console.error('[Supabase Auth] signInWithPassword error:', error);

    const rawMsg = error.message || 'Unknown Supabase error';

    if (rawMsg.toLowerCase().includes('invalid login credentials')) {
      throw new Error(
        `ভুল ইমেইল বা পাসওয়ার্ড! (Supabase: "${rawMsg}")। অনুগ্রহ করে সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।`
      );
    }

    if (rawMsg.toLowerCase().includes('email not confirmed')) {
      throw new Error(
        `ইমেইল এখনও ভেরিফাই করা হয়নি (Supabase: "${rawMsg}")। অনুগ্রহ করে Supabase ড্যাশবোর্ডে Authentication > Users এ গিয়ে এই ইমেইল Confirm করুন।`
      );
    }

    if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('network')) {
      throw new Error(
        `সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি (Supabase: "${rawMsg}")। ইন্টারনেট সংযোগ, CORS বা Supabase URL কনফিগারেশন যাচাই করুন।`
      );
    }

    throw new Error(`লগইন ব্যর্থ হয়েছে (Supabase): ${rawMsg}`);
  }

  if (!data.user) {
    throw new Error('ব্যবহারকারী পাওয়া যায়নি।');
  }

  const authUser: AdminAuthUser = {
    id: data.user.id,
    email: data.user.email || cleanEmail,
    userMetadata: data.user.user_metadata,
    appMetadata: data.user.app_metadata
  };

  // Enforce admin authorization
  if (!isUserAuthorizedAdmin(authUser)) {
    await supabase.auth.signOut().catch(() => {});
    throw new Error('অননুমোদিত অ্যাকাউন্ট! এই ইমেইলটি অ্যাডমিন হিসেবে অনুমোদিত নয়।');
  }

  return authUser;
}

/**
 * Sign out current admin session from Supabase Auth.
 */
export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut notice:', err);
    }
  }
}

/**
 * Get the currently authenticated Supabase user.
 * Validates real Supabase session with zero localStorage mock.
 */
export async function getCurrentAdminUser(): Promise<AdminAuthUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }

    const authUser: AdminAuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      userMetadata: data.user.user_metadata,
      appMetadata: data.user.app_metadata
    };

    if (!isUserAuthorizedAdmin(authUser)) {
      return null;
    }

    return authUser;
  } catch (err) {
    console.warn('Error fetching current admin user:', err);
    return null;
  }
}

/**
 * Subscribe to real Supabase Auth State changes.
 */
export function onAdminAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null, user: AdminAuthUser | null) => void
): () => void {
  if (!isSupabaseConfigured()) {
    callback('INITIAL_SESSION' as AuthChangeEvent, null, null);
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    let user: AdminAuthUser | null = session?.user
      ? {
          id: session.user.id,
          email: session.user.email || '',
          userMetadata: session.user.user_metadata,
          appMetadata: session.user.app_metadata
        }
      : null;

    if (user && !isUserAuthorizedAdmin(user)) {
      user = null;
    }

    callback(event, session, user);
  });

  return () => {
    subscription.unsubscribe();
  };
}
