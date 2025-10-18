import React from 'react';

const ROWS = 8;

const GuestTableSkeleton: React.FC = () => {
  return (
    <div className='overflow-x-auto animate-pulse'>
      <table className='min-w-full divide-y divide-slate-200'>
        <thead className='bg-slate-50'>
          <tr>
            <th className='p-4'>
              <div className='h-4 w-4 bg-slate-200 rounded' />
            </th>
            <th className='px-2 sm:px-6 py-3'>
              <div className='h-4 w-20 bg-slate-200 rounded' />
            </th>
            <th className='px-2 sm:px-6 py-3'>
              <div className='h-4 w-20 bg-slate-200 rounded' />
            </th>
            <th className='px-2 sm:px-6 py-3'>
              <div className='h-4 w-20 bg-slate-200 rounded' />
            </th>
            <th className='px-2 sm:px-6 py-3'>
              <div className='h-4 w-20 bg-slate-200 rounded' />
            </th>
            <th className='px-2 sm:px-6 py-3'>
              <div className='h-4 w-14 bg-slate-200 rounded' />
            </th>
            <th className='px-2 sm:px-6 py-3'>
              <div className='h-4 w-16 bg-slate-200 rounded' />
            </th>
            <th className='px-2 sm:px-6 py-3'>
              <div className='h-4 w-16 bg-slate-200 rounded' />
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-slate-200'>
          {Array.from({ length: ROWS }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 8 }).map((_, j) => (
                <td key={j} className='px-2 sm:px-6 py-4'>
                  <div className='h-4 w-full bg-slate-100 rounded' />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestTableSkeleton;
