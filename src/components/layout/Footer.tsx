import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MapPin, CheckCircle2, ShieldCheck, HeartHandshake, Truck, Clock } from 'lucide-react';
import { CowLogo } from '../ui/CowLogo';
import { LeafDecoration } from '../ui/LeafDecoration';
import { useSiteContent } from '../../context/SiteContentContext';

export const Footer: React.FC = () => {
  const { siteContent, whatsappUrl } = useSiteContent();

  const footerWhatsappUrl = whatsappUrl('আসসালামু আলাইকুম, মজুমদার খামার থেকে পশু/পাখি কিনতে চাচ্ছি।');

  const navLinks = [
    { name: 'হোম পেইজ', path: '/' },
    { name: 'আমাদের প্রোডাক্টস', path: '/products' },
    { name: 'বিক্রয় পণ্য (লাইভ স্টক)', path: '/sale-products' },
    { name: 'আমাদের কথা ও খামার পরিচিতি', path: '/about' },
    { name: 'যোগাযোগ ও সরাসরি পরিদর্শন', path: '/contact' },
  ];

  const categories = [
    { name: 'উন্নত জাতের গরু ও বাছুর', path: '/sale-products' },
    { name: 'ব্ল্যাক বেঙ্গল ও যমুনাপারি ছাগল', path: '/sale-products' },
    { name: 'দেশি হাঁস ও সোনালী মুরগি', path: '/sale-products' },
    { name: 'কোরবানি ও বিশেষ বুকিং', path: '/contact' },
  ];

  return (
    <footer id="main-site-footer" className="relative bg-[#1a3a2a] text-white pt-16 pb-8 overflow-hidden border-t-4 border-[#c0522d]">
      <LeafDecoration position="top-right" opacity={0.08} />
      <LeafDecoration position="bottom-left" opacity={0.08} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Features Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-8 sm:pb-12 mb-8 sm:mb-12 border-b border-white/10">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#c0522d] shrink-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">স্বাস্থ্য পরীক্ষিত</h4>
              <p className="text-xs text-gray-300">নিয়মিত পশু চিকিৎসকের নজরদারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
            <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8 text-[#c0522d] shrink-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">প্রাকৃতিক লালনপালন</h4>
              <p className="text-xs text-gray-300">শতভাগ ভেজালমুক্ত ঘাস ও শস্য</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#c0522d] shrink-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">ন্যায্য মূল্য</h4>
              <p className="text-xs text-gray-300">সরাসরি খামার থেকে সাশ্রয়ী দাম</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
            <Truck className="w-7 h-7 sm:w-8 sm:h-8 text-[#c0522d] shrink-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">নিরাপদ সরবরাহ</h4>
              <p className="text-xs text-gray-300">আপনার এলাকায় নিরাপদ ডেলিভারি</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 sm:pb-12">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <CowLogo size="md" showBorder={true} />
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">মজুমদার খামার</h3>
                <p className="text-[#D6A21D] text-sm font-medium">{siteContent.tagline || 'প্রকৃতি থেকে, আপনার টেবিলে'}</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-md pt-1">
              {siteContent.address || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}তে অবস্থিত আমাদের আধুনিক ও স্বাস্থ্যসম্মত খামার। যত্ন আর ভালোবাসায় বড় করা প্রতিটি প্রাণী — সুস্থ, রোগমুক্ত ও প্রাকৃতিকভাবে লালিত-পালিত।
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <a
                href={footerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white text-sm font-semibold shadow-sm transition-all min-h-[44px] text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
              </a>

              <a
                href={`tel:${(siteContent.phone || '01838752049').replace(/\D/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-sm font-semibold transition-all min-h-[44px] text-center"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{siteContent.phone || '০১৮৩৮৭৫২০৪৯'}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-white/10 pb-2 inline-block">
              গুরুত্বপূর্ণ লিঙ্ক
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-[#c0522d] transition-colors flex items-center gap-2 group py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7d8c58] group-hover:bg-[#c0522d] transition-colors" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Live Categories / Livestock */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-white/10 pb-2 inline-block">
              প্রাণিসম্পদ
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <Link
                    to={cat.path}
                    className="hover:text-[#c0522d] transition-colors flex items-center gap-2 group py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7d8c58] group-hover:bg-[#c0522d] transition-colors" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Farm Contact Details */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-white/10 pb-2 inline-block">
              সরাসরি যোগাযোগ
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c0522d] flex-shrink-0 mt-1" />
                <span className="leading-snug">{siteContent.address || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c0522d] flex-shrink-0" />
                <a href={`tel:${(siteContent.phone || '01838752049').replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                  {siteContent.phone || '০১৮৩৮৭৫২০৪৯'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#7d8c58] flex-shrink-0" />
                <span>সকাল ৮:০০ – সন্ধ্যা ৬:০০</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Darker Green Tone */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© ২০২৬ মজুমদার খামার (Majumdar Khamar). সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{siteContent.address || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#c0522d] font-medium">নিরাপদ ডেইরি ও ফার্মিং</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
