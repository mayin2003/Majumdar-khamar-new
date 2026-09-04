import React from 'react';

interface LeafDecorationProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  className?: string;
  opacity?: number;
}

export const LeafDecoration: React.FC<LeafDecorationProps> = ({
  position = 'top-right',
  className = '',
  opacity = 0.18
}) => {
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-6 -translate-y-6',
    'top-right': 'top-0 right-0 translate-x-6 -translate-y-6 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 -translate-x-6 translate-y-6 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 translate-x-6 translate-y-6 scale-[-1]',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div
      className={`absolute pointer-events-none z-0 select-none overflow-hidden ${positionClasses[position]} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Detailed botanical branch with multiple leaves matching reference */}
      <svg
        width="260"
        height="260"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#657a4a]"
      >
        {/* Main stem curve */}
        <path
          d="M20 280 Q 110 200 240 60 Q 270 30 285 20"
          stroke="#4b5d38"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Leaf 1 - top terminal */}
        <path
          d="M285 20 C270 35 255 35 240 60 C265 60 285 45 285 20 Z"
          fill="currentColor"
        />
        {/* Leaf 2 - upper right branch */}
        <path
          d="M220 90 Q 260 70 275 80 Q 250 110 215 95 Z"
          fill="currentColor"
        />
        {/* Leaf 3 - upper left branch */}
        <path
          d="M185 125 Q 150 100 145 75 Q 180 90 190 120 Z"
          fill="currentColor"
        />
        {/* Leaf 4 - mid right branch */}
        <path
          d="M150 160 Q 200 150 215 170 Q 180 190 145 165 Z"
          fill="currentColor"
        />
        {/* Leaf 5 - mid left branch */}
        <path
          d="M115 195 Q 65 175 60 145 Q 100 160 120 190 Z"
          fill="currentColor"
        />
        {/* Leaf 6 - lower right branch */}
        <path
          d="M80 230 Q 125 230 135 255 Q 100 265 75 235 Z"
          fill="currentColor"
        />
        {/* Leaf 7 - base small leaf */}
        <path
          d="M50 255 Q 20 235 20 215 Q 45 230 55 250 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export const LeafDivider: React.FC<{ text?: string; className?: string }> = ({
  text,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-3 ${className}`}>
      <svg
        width="32"
        height="18"
        viewBox="0 0 32 18"
        fill="none"
        className="text-[#7d8c58]"
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
      {text && (
        <span className="text-sm sm:text-base font-bold tracking-wide text-[#7d8c58]">
          {text}
        </span>
      )}
      <svg
        width="32"
        height="18"
        viewBox="0 0 32 18"
        fill="none"
        className="text-[#7d8c58] scale-x-[-1]"
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
  );
};

// Hand-drawn squiggly orange underline matching the reference design
export const HandDrawnUnderline: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`w-36 sm:w-44 h-3 text-[#c0522d] ${className}`}
      viewBox="0 0 170 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 8.5C45 3.5 110 2 168 7C145 9.5 85 10.5 35 10"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

