import { supabase } from '../lib/supabase';
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

  return true;
}

/**
 * Sign in admin directly using Supabase Auth (Email + Password).
 */
export async function signInAdmin(email: string, pass: string): Promise<AdminAuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    throw new Error('ইমেইল এবং পাসওয়ার্ড দুটিই পূরণ করা আবশ্যক!');
  }

  console.log('[Auth] Attempting signInWithPassword for:', cleanEmail);

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
    error = err;
  }

  if (error) {
    console.error('[Supabase Auth] signInWithPassword error:', error);

    const rawMsg = error.message || String(error) || 'Unknown error';

    // Show real error message in console and in small readable Bangla message
    if (rawMsg.toLowerCase().includes('invalid login credentials')) {
      throw new Error(`ভুল ইমেইল বা পাসওয়ার্ড (${rawMsg})`);
    }

    if (rawMsg.toLowerCase().includes('email not confirmed')) {
      throw new Error(`ইমেইল কনফার্ম করা হয়নি (${rawMsg})`);
    }

    if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('network')) {
      throw new Error(`সার্ভার কানেকশন ত্রুটি (${rawMsg})`);
    }

    throw new Error(`লগইন ব্যর্থ হয়েছে (${rawMsg})`);
  }

  if (!data?.user) {
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
 * Sign out current admin session.
 */
export async function signOutAdmin(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Supabase signOut error:', err);
  }
}

/**
 * Get the currently authenticated Supabase user.
 */
export async function getCurrentAdminUser(): Promise<AdminAuthUser | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
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
    console.error('Error fetching current admin user:', err);
    return null;
  }
}

/**
 * Subscribe to Supabase Auth State changes.
 */
export function onAdminAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null, user: AdminAuthUser | null) => void
): () => void {
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
