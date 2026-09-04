import React from 'react';
import { motion } from 'framer-motion';
import { LeafDecoration } from '../ui/LeafDecoration';
import { featureItems } from './FeatureStrip';

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section id="why-choose-us-section" className="relative py-12 sm:py-20 lg:py-28 bg-[#f5efe0] overflow-hidden border-t border-[#e8dfc8]">
      <LeafDecoration position="top-left" opacity={0.12} />
      <LeafDecoration position="bottom-right" opacity={0.12} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Heading with symmetrical decorative leaf icons on BOTH sides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Left Leaf Icon */}
            <svg
              width="28"
              height="16"
              viewBox="0 0 32 18"
              fill="none"
              className="text-[#7d8c58] shrink-0 sm:w-9 sm:h-5"
            >
              <path
                d="M2 16C9 11 18 7 30 2C23 1 16 3 11 8C7 12 4 15 2 16Z"
                fill="currentColor"
              />
              <path
                d="M11 8C16 11 20 13 25 12"
                stroke="#4b5d38"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>

            {/* Heading text */}
            <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-[40px] font-black text-[#1a3a2a] tracking-tight">
              কেন আমাদের পণ্য নির্বাচন করবেন?
            </h2>

            {/* Right Leaf Icon (Mirrored) */}
            <svg
              width="28"
              height="16"
              viewBox="0 0 32 18"
              fill="none"
              className="text-[#7d8c58] scale-x-[-1] shrink-0 sm:w-9 sm:h-5"
            >
              <path
                d="M2 16C9 11 18 7 30 2C23 1 16 3 11 8C7 12 4 15 2 16Z"
                fill="currentColor"
              />
              <path
                d="M11 8C16 11 20 13 25 12"
                stroke="#4b5d38"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* 4-Column Responsive Grid of Trust Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featureItems.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: 'easeOut' }
                }
              }}
              whileHover={{
                y: -6,
                boxShadow: '0 16px 30px -10px rgba(26, 58, 42, 0.15)',
                transition: { duration: 0.25 }
              }}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-md border border-[#1a3a2a]/5 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[#f5efe0] group-hover:bg-[#1a3a2a] flex items-center justify-center mb-5 transition-colors duration-300">
                  <div className="text-[#1a3a2a] group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#1a3a2a] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* One-line/Two-line Description */}
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {item.subtitle}
                </p>
              </div>

              {/* Bottom verified badge */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#7d8c58]">
                <div className="w-2 h-2 rounded-full bg-[#c0522d]" />
                <span>মজুমদার খামার মাননিশ্চয়তা</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

