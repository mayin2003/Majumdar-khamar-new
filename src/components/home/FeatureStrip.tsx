import React from 'react';
import { motion } from 'framer-motion';

export interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description?: string;
}

// Thin white/cream outlined SVG icons (~28-32px) matching the reference bar
export const featureItems: FeatureItem[] = [
  {
    id: 'food',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    title: 'প্রাকৃতিক খাবার',
    subtitle: 'ঘাস, খড় ও দানাদার খাবার',
    description: 'কোনো ক্ষতিকর রাসায়নিক বা গ্রোথ হরমোন ছাড়া সম্পূর্ণ প্রাকৃতিক কাঁচা ঘাস, খড় ও দানাদার পুষ্টিকর খাদ্যে লালন-পালন।'
  },
  {
    id: 'health',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'নিয়মিত স্বাস্থ্য পরীক্ষা',
    subtitle: 'পশু চিকিৎসকের তত্ত্বাবধানে',
    description: 'নিবন্ধিত ভেটেরিনারি চিকিৎসকের নিয়মিত স্বাস্থ্য নিরীক্ষা ও সার্বক্ষণিক পরিচর্যা নিশ্চিত করা হয়।'
  },
  {
    id: 'vaccine',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
        <path d="m9 11 4 4" />
        <path d="m5 19-3 3" />
        <path d="m14 4 6 6" />
      </svg>
    ),
    title: 'টিকা প্রদান করা',
    subtitle: 'রোগমুক্ত ও সুস্থ প্রাণী',
    description: 'খুরা রোগ, তড়কা, বাদলা, পিপিআর ও অন্যান্য সকল জরুরি ভ্যাকসিনের নির্ধারিত ডোজ সম্পন্ন।'
  },
  {
    id: 'environment',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
    title: 'পরিচ্ছন্ন পরিবেশ',
    subtitle: 'খোলা মাঠ ও পর্যাপ্ত জায়গা',
    description: 'উন্নত মাচাযুক্ত স্বাস্থ্যসম্মত শেড, সার্বক্ষণিক বিশুদ্ধ পানি ও মুক্ত প্রাকৃতিক আলো-বাতাস।'
  }
];

export const FeatureStrip: React.FC = () => {
  return (
    <section id="feature-strip-section" className="w-full bg-[#003F2D] text-white py-7 sm:py-8 relative z-20 border-t border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0"
        >
          {featureItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
              }}
              className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-4 py-2 relative p-2 rounded-xl sm:rounded-none bg-white/[0.03] sm:bg-transparent ${
                index !== 3 ? 'lg:border-r lg:border-white/15 lg:pr-6' : 'lg:pr-0'
              } ${index !== 0 ? 'lg:pl-6' : 'lg:pl-0'}`}
            >
              {/* Icon on Left / Top on mobile */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              {/* Text */}
              <div className="space-y-0.5">
                <h4 className="font-bold text-white text-sm sm:text-base lg:text-lg leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs lg:text-sm text-[#F5F0E3]/85 font-normal leading-tight sm:leading-normal">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

