import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { LeafDecoration } from '../ui/LeafDecoration';
import { useSiteContent } from '../../context/SiteContentContext';

export const FinalCtaBanner: React.FC = () => {
  const { whatsappUrl } = useSiteContent();
  const whatsappMsg = 'আসসালামু আলাইকুম, আমি একটি বিশেষ জাত বা সাইজের প্রাণী খুঁজছি। আপনারা কি ব্যবস্থা করে দিতে পারবেন?';
  const targetUrl = whatsappUrl(whatsappMsg);

  return (
    <section id="final-cta-banner-section" className="py-12 lg:py-16 bg-[#f5efe0] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative rounded-3xl bg-[#1a3a2a] overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-14 text-white border border-[#0f2a1c]"
        >
          {/* Faint Farm Photo Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-luminosity"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a2a] via-[#1a3a2a]/90 to-[#1a3a2a]/80 pointer-events-none" />

          {/* Leaf Accents */}
          <LeafDecoration position="top-right" opacity={0.12} />
          <LeafDecoration position="bottom-left" opacity={0.1} />

          {/* Content Row */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                আপনার পছন্দের প্রাণী খুঁজে পাচ্ছেন না?
              </h2>
              <p className="text-base sm:text-lg text-gray-200 font-normal">
                আমাদের সাথে যোগাযোগ করুন, আমরা সরাসরি আপনার চাহিদা অনুযায়ী ব্যবস্থা করে দেব।
              </p>
            </div>

            <div className="flex-shrink-0">
              <motion.a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="banner-whatsapp-contact-cta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#f5efe0] text-[#1a3a2a] font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all cursor-pointer group whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-current" />
                <span>হোয়াটসঅ্যাপে কথা বলুন</span>
                <ArrowRight className="w-4 h-4 text-[#c0522d] group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
