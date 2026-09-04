import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';

interface CowLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  imageClassName?: string;
  logoUrl?: string;
  alt?: string;
  showBorder?: boolean;
}

export const CowLogo: React.FC<CowLogoProps> = ({
  size = 'md',
  className = '',
  imageClassName = '',
  logoUrl: propLogoUrl,
  alt = 'মজুমদার খামার লোগো',
  showBorder = false
}) => {
  const { logoUrl: contextLogoUrl } = useSiteContent();
  const activeLogoUrl = (propLogoUrl !== undefined ? propLogoUrl : contextLogoUrl)?.trim();
  const [imgError, setImgError] = useState<boolean>(false);

  // Reset error flag if activeLogoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [activeLogoUrl]);

  const sizeClasses = {
    xs: 'w-6 h-6 p-0.5',
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 md:w-11 md:h-11 p-1',
    lg: 'w-14 h-14 p-1.5',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 p-2',
    '2xl': 'w-28 h-28 sm:w-32 sm:h-32 p-2.5'
  };

  const hasImage = Boolean(activeLogoUrl && !imgError);

  return (
    <div
      id="farm-logo-badge"
      className={`rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${
        showBorder ? 'border-2 border-[#D6A21D]' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {hasImage ? (
        <img
          src={activeLogoUrl}
          alt={alt}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover rounded-full ${imageClassName}`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#1a3a2a]"
        >
          {/* Cow Silhouette and horns */}
          <path
            d="M20 28C16 16 30 18 36 26C42 22 58 22 64 26C70 18 84 16 80 28C84 38 78 44 76 52C74 62 68 76 62 82C56 88 44 88 38 82C32 76 26 62 24 52C22 44 16 38 20 28Z"
            fill="#1a3a2a"
          />
          {/* White muzzle/snout */}
          <ellipse cx="50" cy="68" rx="20" ry="14" fill="#ffffff" />
          {/* Nostrils */}
          <ellipse cx="43" cy="68" rx="3.5" ry="5" fill="#1a3a2a" />
          <ellipse cx="57" cy="68" rx="3.5" ry="5" fill="#1a3a2a" />
          {/* Eyes */}
          <ellipse cx="36" cy="45" rx="3" ry="4" fill="#ffffff" />
          <ellipse cx="64" cy="45" rx="3" ry="4" fill="#ffffff" />
          {/* Horn highlights */}
          <path
            d="M26 24C22 14 34 16 36 24"
            stroke="#b3924c"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M74 24C78 14 66 16 64 24"
            stroke="#b3924c"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};

