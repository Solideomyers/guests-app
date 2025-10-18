import React from 'react';

const StatsCardSkeleton: React.FC = () => (
  <div className='bg-white p-4 sm:p-5 rounded-lg shadow-md flex items-center animate-pulse'>
    <div className='rounded-full p-2 sm:p-3 mr-3 sm:mr-4 bg-slate-200'>
      <div className='w-6 h-6 bg-slate-300 rounded-full' />
    </div>
    <div>
      <div className='h-4 w-24 bg-slate-200 rounded mb-2' />
      <div className='h-6 w-16 bg-slate-300 rounded' />
    </div>
  </div>
);

export default StatsCardSkeleton;
