import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatsCardSkeleton: React.FC = () => (
  <Card className='p-4 sm:p-5 flex items-center'>
    <Skeleton className='rounded-full w-12 h-12 sm:w-14 sm:h-14 mr-3 sm:mr-4' />
    <div className='space-y-2'>
      <Skeleton className='h-4 w-24' />
      <Skeleton className='h-6 w-16' />
    </div>
  </Card>
);

export default StatsCardSkeleton;
