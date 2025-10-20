import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const ROWS = 8;

const GuestTableSkeleton: React.FC = () => {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>
              <Skeleton className='h-4 w-4' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-20' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-20' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-20' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-20' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-14' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-16' />
            </TableHead>
            <TableHead className='w-24'>
              <Skeleton className='h-4 w-16' />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: ROWS }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 8 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className='h-4 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuestTableSkeleton;
