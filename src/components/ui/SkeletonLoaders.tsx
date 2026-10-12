import React from 'react';

export const AnimalCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[22px] border border-[#e6dece] shadow-md flex flex-col overflow-hidden text-left h-full animate-pulse">
      {/* 4:3 image skeleton */}
      <div className="w-full aspect-[4/3] bg-[#e6dece]" />
      
      {/* Card body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-[#e6dece] rounded-md w-3/4" />
          <div className="h-4 bg-[#e6dece]/70 rounded-md w-full" />
          <div className="h-4 bg-[#e6dece]/50 rounded-md w-2/3" />
        </div>
        
        {/* Chips row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eae0]">
          <div className="h-5 bg-[#e6dece]/60 rounded-md" />
          <div className="h-5 bg-[#e6dece]/60 rounded-md" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-[#e6dece] rounded-xl w-full mt-2" />
      </div>
    </div>
  );
};

export const ProductsPageSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="bg-white rounded-[26px] border border-[#e6decb] shadow-xl p-6 flex flex-col justify-between animate-pulse"
        >
          <div className="w-full h-52 bg-[#e6dece] rounded-2xl mb-4" />
          <div className="h-4 bg-[#e6dece] rounded w-3/4 mx-auto mb-2" />
          <div className="h-4 bg-[#e6dece]/60 rounded w-1/2 mx-auto mb-4" />
          <div className="h-10 bg-[#e6dece] rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
};
