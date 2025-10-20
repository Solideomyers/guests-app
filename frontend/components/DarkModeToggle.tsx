import React, { useEffect } from 'react';
import { useUIStore } from '../stores';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';

/**
 * DarkModeToggle Component
 * Elegant toggle between light and dark mode with smooth animations
 * Features: Rotating icon transition, themed colors, accessible tooltip
 */
const DarkModeToggle: React.FC = () => {
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleDarkMode}
            className='relative h-10 w-10 rounded-lg hover:bg-accent transition-all duration-300'
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {/* Sun Icon - visible in dark mode */}
            <Sun
              className={`absolute h-5 w-5 transition-all duration-500 ${
                darkMode
                  ? 'rotate-0 scale-100 text-primary'
                  : 'rotate-90 scale-0 text-muted-foreground'
              }`}
            />
            {/* Moon Icon - visible in light mode */}
            <Moon
              className={`absolute h-5 w-5 transition-all duration-500 ${
                darkMode
                  ? 'rotate-90 scale-0 text-muted-foreground'
                  : 'rotate-0 scale-100 text-primary'
              }`}
            />
            <span className='sr-only'>
              {darkMode ? 'Modo claro' : 'Modo oscuro'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>
          <p className='flex items-center gap-2'>
            {darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            <kbd className='px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded'>
              {darkMode ? '☀️' : '🌙'}
            </kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DarkModeToggle;
