import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

export const FloatingWhatsApp: React.FC = () => {
  const { whatsappUrl } = useSiteContent();
  const defaultWhatsappMsg = 'আসসালামু আলাইকুম, আমি মজুমদার খামার সম্পর্কে বিস্তারিত জানতে আগ্রহী।';
  const targetUrl = whatsappUrl(defaultWhatsappMsg);

  return (
    <motion.div
      id="floating-whatsapp-container"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-4 md:bottom-6 md:right-6 z-40 flex items-center group"
    >
      {/* Tooltip on hover */}
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 rounded-lg bg-[#1a3a2a] text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/10">
        হোয়াটসঅ্যাপে সরাসরি কথা বলুন
      </span>

      <motion.a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-action-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 hover:shadow-2xl transition-all cursor-pointer overflow-visible"
        aria-label="Chat on WhatsApp"
      >
        {/* Soft pulse ping ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-current relative z-10" />
      </motion.a>
    </motion.div>
  );
};
