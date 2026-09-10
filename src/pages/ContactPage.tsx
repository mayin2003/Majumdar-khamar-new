import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { LeafDecoration, LeafDivider } from '../components/ui/LeafDecoration';
import { CowLogo } from '../components/ui/CowLogo';
import { FarmLocationMap } from '../components/ui/FarmLocationMap';
import { useSiteContent } from '../context/SiteContentContext';
import { MapPin, Phone, MessageCircle, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteContent, whatsappUrl } = useSiteContent();
  const navigate = useNavigate();

  // Hidden admin trigger: 5 clicks within 3 seconds on the farm logo
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showSecretHint, setShowSecretHint] = useState(false);

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      setShowSecretHint(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 400);
      return;
    }

    // Reset after 3 seconds of inactivity
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3000);
  };

  return (
    <PageTransition>
      <div id="contact-page-container" className="relative min-h-[75vh] py-12 md:py-20 px-4 bg-[#F8FAF8]">
        <LeafDecoration position="top-left" opacity={0.12} />
        <LeafDecoration position="bottom-right" opacity={0.12} />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          {/* Header & Logo with 5-click easter egg */}
          <div className="text-center space-y-4">
            <div className="inline-block relative">
              <button
                type="button"
                onClick={handleLogoClick}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#003F2D] p-3 mx-auto shadow-md border-2 border-[#D6A21D]/40 transition-transform active:scale-95 cursor-pointer flex items-center justify-center select-none overflow-hidden"
                title="মজুমদার খামার (অ্যাডমিন লগইন করতে ৫ বার ক্লিক করুন)"
              >
                <CowLogo size="xl" showBorder={false} />
              </button>
              {showSecretHint && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#003F2D] text-white text-[11px] px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                  অ্যাডমিন প্যানেলে প্রবেশ করা হচ্ছে...
                </div>
              )}
            </div>

            <LeafDivider text="যোগাযোগ ও সরাসরি পরিদর্শন" />
            
            <h1 className="text-3xl sm:text-5xl font-bold text-[#003F2D] tracking-tight">
              যোগাযোগ করুন
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              সরাসরি খামার পরিদর্শন করতে অথবা গবাদিপশু ও দেশি হাঁস-মুরগি সম্পর্কে জানতে আমাদের সাথে যোগাযোগ করুন।
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#003F2D] flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base mb-1">ফোন কল</h2>
                <p className="text-sm text-gray-500 mb-4 font-mono font-medium">
                  {siteContent.phone || '০১৮৩৮৭৫২০৪৯'}
                </p>
              </div>
              <a
                href={`tel:${(siteContent.whatsappNumber || '01838752049').replace(/\D/g, '')}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-medium text-xs transition-colors text-center"
              >
                সরাসরি কল করুন
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base mb-1">হোয়াটসঅ্যাপ</h2>
                <p className="text-sm text-gray-500 mb-4 font-mono font-medium">
                  +{siteContent.whatsappNumber || '8801838752049'}
                </p>
              </div>
              <a
                href={whatsappUrl('আসসালামু আলাইকুম, আমি মজুমদার খামার সম্পর্কে জানতে চাই।')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs transition-colors text-center"
              >
                মেসেজ পাঠান
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C95A25] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base mb-1">খামারের ঠিকানা</h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {siteContent.address || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                সরাসরি পরিদর্শন উন্মুক্ত
              </span>
            </div>
          </div>

          {/* Farm Visit Timing Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base">পরিদর্শনের সময়সূচী</h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  সপ্তাহের ৭ দিন • সকাল ৮:০০ টা থেকে সন্ধ্যা ৬:০০ টা পর্যন্ত
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  পরিদর্শনের পূর্বে অনুগ্রহ করে ফোনে জানিয়ে আসার অনুরোধ করা হচ্ছে।
                </p>
              </div>
            </div>

            <a
              href={`tel:${(siteContent.whatsappNumber || '01838752049').replace(/\D/g, '')}`}
              className="px-6 py-2.5 rounded-xl border border-[#003F2D] text-[#003F2D] hover:bg-[#003F2D] hover:text-white font-medium text-xs transition-colors shrink-0"
            >
              আসার আগে জানান
            </a>
          </div>

          {/* Google Map Location Section */}
          <FarmLocationMap />
        </div>
      </div>
    </PageTransition>
  );
};
