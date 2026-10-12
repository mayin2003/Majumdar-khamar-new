import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, RotateCw } from 'lucide-react';
import { CowLogo } from '../../components/ui/CowLogo';

type LoginErrorType = 'network' | 'credentials' | 'unconfirmed' | 'generic';

interface LoginErrorState {
  type: LoginErrorType;
  message: string;
}

function classifyError(err: any): LoginErrorState {
  const rawMsg = (err?.message || String(err) || '').toLowerCase();
  const rawName = (err?.name || '').toLowerCase();
  const status = err?.status || err?.statusCode;

  // 1. Invalid credentials
  if (
    rawMsg.includes('invalid login credentials') ||
    rawMsg.includes('invalid credentials') ||
    rawMsg.includes('invalid_grant') ||
    rawMsg.includes('ভুল ইমেইল বা পাসওয়ার্ড') ||
    err?.code === 'invalid_credentials'
  ) {
    return {
      type: 'credentials',
      message: 'ইমেইল বা পাসওয়ার্ড ভুল।',
    };
  }

  // 2. Email not confirmed
  if (
    rawMsg.includes('email not confirmed') ||
    rawMsg.includes('email_not_confirmed') ||
    rawMsg.includes('ইমেইল কনফার্ম') ||
    err?.code === 'email_not_confirmed'
  ) {
    return {
      type: 'unconfirmed',
      message: 'ইমেইল কনফার্ম করা হয়নি।',
    };
  }

  // 3. Network / fetch failure
  if (
    rawMsg.includes('failed to fetch') ||
    rawMsg.includes('network') ||
    rawMsg.includes('networkerror') ||
    rawMsg.includes('load failed') ||
    rawMsg.includes('connection') ||
    rawMsg.includes('unreachable') ||
    rawMsg.includes('সার্ভার কানেকশন ত্রুটি') ||
    rawMsg.includes('econnrefused') ||
    rawMsg.includes('enotfound') ||
    rawName === 'typeerror' ||
    status === 0 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return {
      type: 'network',
      message: 'ইন্টারনেট বা সার্ভারের সমস্যা। একটু পরে আবার চেষ্টা করুন।',
    };
  }

  // 4. Fallback / generic error
  return {
    type: 'generic',
    message: err?.message || 'লগইন করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
  };
}

export const AdminLoginPage: React.FC = () => {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<LoginErrorState | null>(null);

  // If already authenticated with a valid Supabase session, redirect directly to admin dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const executeLogin = async () => {
    setLocalError(null);
    clearError();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setLocalError({
        type: 'generic',
        message: 'অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দুটিই পূরণ করুন।',
      });
      return;
    }

    setIsLoading(true);

    try {
      // First attempt
      await login(cleanEmail, cleanPassword);
      navigate('/admin/dashboard', { replace: true });
    } catch (firstErr: any) {
      // Always console.error the real error
      console.error('[Admin Login] Supabase auth error:', firstErr);
      const classified = classifyError(firstErr);

      // Before showing a network error, retry the request once automatically
      if (classified.type === 'network') {
        try {
          // Automatic retry once
          await new Promise((res) => setTimeout(res, 800));
          await login(cleanEmail, cleanPassword);
          navigate('/admin/dashboard', { replace: true });
          return;
        } catch (retryErr: any) {
          console.error('[Admin Login] Supabase auth auto-retry error:', retryErr);
          const retryClassified = classifyError(retryErr);
          setLocalError(retryClassified);
        }
      } else {
        setLocalError(classified);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin();
  };

  const activeError = localError || (error ? classifyError({ message: error }) : null);

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col justify-center items-center px-4 py-12">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Farm Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-[#003F2D] shadow-md mb-4 border border-white/20">
            <CowLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[#003F2D]">মজুমদার খামার</h1>
          <p className="text-gray-600 text-sm mt-1">খামার ব্যবস্থাপনা ও অ্যাডমিন প্যানেল</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold text-[#003F2D] bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-[#003F2D]" />
            <span>অ্যাডমিন অথেন্টিকেশন</span>
          </div>

          {/* Error Message */}
          {activeError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">লগইন ব্যর্থ হয়েছে</p>
                <p className="text-xs mt-0.5">{activeError.message}</p>
                {activeError.type === 'network' && (
                  <button
                    type="button"
                    onClick={() => executeLogin()}
                    disabled={isLoading}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>আবার চেষ্টা করুন (Retry)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                অ্যাডমিন ইমেইল
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@majumdarkhamar.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] focus:border-transparent text-gray-900 text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] focus:border-transparent text-gray-900 text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-70 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Return to Public Website */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-[#003F2D] hover:underline"
          >
            ← মূল ওয়েবসাইটে ফিরে যান
          </a>
        </div>
      </div>
    </div>
  );
};
