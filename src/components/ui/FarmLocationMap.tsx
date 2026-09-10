import React from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface FarmLocationMapProps {
  className?: string;
}

export const FarmLocationMap: React.FC<FarmLocationMapProps> = ({ className = '' }) => {
  const { siteContent } = useSiteContent();
  const farmAddress = siteContent.address || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী';

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(farmAddress)}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(farmAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="farm-location-section"
      aria-label="আমাদের খামারের অবস্থান"
      className={`w-full bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all ${className}`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-7 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#FAF7EE]/50 to-white">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#c0522d] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#c0522d]" />
            <span>সরাসরি পরিদর্শন ও লোকেশন</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a2a] tracking-tight">
            আমাদের খামারের ঠিকানা
          </h2>
          <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700 font-medium">
            <MapPin className="w-4 h-4 text-[#c0522d] shrink-0" />
            <span>{farmAddress}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <a
            id="google-maps-directions-cta"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c0522d] hover:bg-[#a84422] active:bg-[#913a1c] text-white font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Google Maps-এ পথ দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-72 sm:h-96 md:h-[420px] bg-[#f5efe0]/50">
        <iframe
          id="farm-google-map-iframe"
          title={`মজুমদার খামার অবস্থান - ${farmAddress}`}
          src={embedMapUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Footer Info Strip */}
      <div className="px-5 py-3.5 sm:px-7 bg-[#FAF7EE] border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>পরশুরাম, ফেনী • সরাসরি খামারে এসে দেখে নেওয়ার সুবিধা রয়েছে</span>
        </div>
        <div className="text-gray-500 text-[11px] sm:text-xs">
          ম্যাপে জুম ইন/আউট করে আশপাশের রাস্তা দেখতে পারেন
        </div>
      </div>
    </section>
  );
};
