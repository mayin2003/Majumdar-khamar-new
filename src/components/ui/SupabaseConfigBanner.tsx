import React, { useState } from 'react';
import { isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from '../../lib/supabase';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export const SupabaseConfigBanner: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const configured = isSupabaseConfigured();

  if (configured) {
    return null;
  }

  const missingVars: string[] = [];
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) missingVars.push('VITE_SUPABASE_ANON_KEY');

  return (
    <div
      id="supabase-config-warning-banner"
      role="alert"
      className="bg-red-700 text-white border-b-2 border-red-900 shadow-md sticky top-0 z-50 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base tracking-wide">
                Supabase কনফিগারেশন পাওয়া যাচ্ছে না। এনভায়রনমেন্ট ভেরিয়েবল সঠিকভাবে সেট করা হয়েছে কিনা যাচাই করুন।
              </p>
              <p className="text-xs text-red-200 mt-0.5">
                রিয়েলটাইম ডাটাবেস ও অ্যাডমিন প্যানেল সক্রিয় করতে হোস্টিং এনভায়রনমেন্টে ভেরিয়েবল সেট করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg border border-white/20 transition-colors cursor-pointer"
            >
              <span>বিস্তারিত</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-red-600/60 text-xs bg-red-800/40 p-3 rounded-lg font-mono">
            <p className="font-bold text-amber-200 mb-1 font-sans">মিসিং বা অকার্যকর এনভায়রনমেন্ট ভেরিয়েবল:</p>
            <ul className="list-disc list-inside space-y-1 text-red-100 mb-2">
              {missingVars.map((v) => (
                <li key={v} className="font-bold text-white">
                  {v} (বর্তমান মান: <span className="text-red-300 font-normal">{v === 'VITE_SUPABASE_URL' ? (supabaseUrl || 'খালি / নেই') : (supabaseAnonKey ? 'অকার্যকর' : 'খালি / নেই')}</span>)
                </li>
              ))}
            </ul>
            <p className="text-red-200 font-sans mt-2">
              হোস্টিং ড্যাশবোর্ড (যেমন: Vercel / Cloud Run / AI Studio Settings) এ গিয়ে এই ভেরিয়েবলগুলো যুক্ত করে একটি নতুন বিল্ড (Redeploy) তৈরি করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
