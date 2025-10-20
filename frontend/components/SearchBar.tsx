import React, { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '../stores';
import { Input } from '@/components/ui/input';

/**
 * SearchBar Component with Real-time Debounced Search
 * Uses Zustand store directly - no prop drilling needed
 * Implements 300ms debounce for optimal performance
 */
const SearchBar: React.FC = () => {
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState(searchQuery);

  // Sync local value with store when searchQuery changes externally
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  // Debounce the search query update
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== searchQuery) {
        setSearchQuery(localValue);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, searchQuery, setSearchQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
  };

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <div className='relative w-full md:w-80 animate-fade-in'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <svg
          className='h-5 w-5 text-muted-foreground'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
          />
        </svg>
      </div>
      <Input
        type='text'
        placeholder='Buscar por nombre, iglesia, ciudad...'
        value={localValue}
        onChange={handleChange}
        className='pl-10 pr-10'
      />
      {localValue && (
        <button
          onClick={handleClear}
          className='absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors'
          aria-label='Limpiar búsqueda'
        >
          <svg
            className='h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
