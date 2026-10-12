import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  priority?: boolean;
}

/**
 * High-performance responsive image component:
 * - Prevents Layout Shift (CLS) via explicit container aspect ratio
 * - Supports soft blur/gray placeholder until image finishes decoding
 * - Lazy loading & async decoding for below-the-fold images
 * - Immediate fetchpriority="high" and eager loading for priority/hero images
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatioClass = '',
  priority = false,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#e8ded0] ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Soft placeholder shimmer shown until image fully decodes */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-[#e4dcce] animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        referrerPolicy="no-referrer"
        {...rest}
      />
    </div>
  );
};
