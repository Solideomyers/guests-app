import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExportMenuProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
}

export function ExportMenu({
  onExportCSV,
  onExportPDF,
  disabled,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = (type: 'csv' | 'pdf') => {
    if (type === 'csv') {
      onExportCSV();
    } else {
      onExportPDF();
    }
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'md:gap-2'
        )}
        aria-label='Exportar opciones'
        aria-haspopup='true'
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        <Download className='h-4 w-4' />
        <span className='hidden sm:inline'>Exportar</span>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border bg-popover shadow-lg',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2'
          )}
          role='menu'
        >
          <div className='p-1'>
            <button
              onClick={() => handleExport('csv')}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                'text-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:outline-none focus:bg-accent'
              )}
              role='menuitem'
            >
              <FileSpreadsheet className='h-4 w-4 text-green-600 dark:text-green-400' />
              <div className='flex flex-col items-start'>
                <span className='font-medium'>Exportar CSV</span>
                <span className='text-xs text-muted-foreground'>
                  Archivo de hoja de cálculo
                </span>
              </div>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                'text-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:outline-none focus:bg-accent'
              )}
              role='menuitem'
            >
              <FileText className='h-4 w-4 text-red-600 dark:text-red-400' />
              <div className='flex flex-col items-start'>
                <span className='font-medium'>Exportar PDF</span>
                <span className='text-xs text-muted-foreground'>
                  Documento portátil
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
