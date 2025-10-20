import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  return (
    <header className='bg-card shadow-md border-b border-border transition-colors'>
      <div className='container mx-auto px-4 md:px-8 py-4 flex items-center justify-between'>
        <div className='flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-8 h-8 text-primary mr-3'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
            />
          </svg>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
            Gestor de Invitados
          </h1>
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
