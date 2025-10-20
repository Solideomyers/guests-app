import React from 'react';
import { Button } from '@/components/ui/button';

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportCSV,
  onExportPDF,
}) => {
  return (
    <div className='flex items-center gap-2'>
      <Button
        onClick={onExportCSV}
        variant='outline'
        size='default'
        className='flex items-center gap-2 w-full sm:w-auto'
        aria-label='Exportar a CSV'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
          />
        </svg>
        <span>CSV</span>
      </Button>
      <Button
        onClick={onExportPDF}
        variant='outline'
        size='default'
        className='flex items-center gap-2 w-full sm:w-auto'
        aria-label='Exportar a PDF'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
          />
        </svg>
        <span>PDF</span>
      </Button>
    </div>
  );
};

export default ExportButtons;
