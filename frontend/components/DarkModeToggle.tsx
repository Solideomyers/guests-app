import React, { useEffect, useState, useRef } from 'react';
import { useUIStore } from '../stores';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * ThemeToggle Component
 * Toggle between light, dark, and system theme modes
 * Features: Rotating icon transition, themed colors, dropdown menu
 */
const DarkModeToggle: React.FC = () => {
  const themeMode = useUIStore((state) => state.themeMode);
  const setThemeMode = useUIStore((state) => state.setThemeMode);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Apply theme based on mode and system preference
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(themeMode === 'dark');
    }
  }, [themeMode]);

  // Close menu when clicking outside
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

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    setIsOpen(false);
  };

  const getCurrentIcon = () => {
    if (themeMode === 'system') return Monitor;
    if (themeMode === 'dark') return Moon;
    return Sun;
  };

  const Icon = getCurrentIcon();

  const getTooltipText = () => {
    if (themeMode === 'light') return 'Tema claro - Haz clic para cambiar';
    if (themeMode === 'dark') return 'Tema oscuro - Haz clic para cambiar';
    return 'Tema del sistema - Haz clic para cambiar';
  };

  return (
    <TooltipProvider>
      <div className='relative' ref={menuRef}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(!isOpen)}
              className='relative h-10 w-10 rounded-lg hover:bg-accent transition-all duration-300'
              aria-label='Cambiar tema'
              aria-haspopup='true'
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <Icon className='h-5 w-5 text-primary transition-transform duration-300' />
              <span className='sr-only'>Cambiar tema</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            <p className='flex items-center gap-2'>
              {getTooltipText()}
              <kbd className='px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded'>
                {themeMode === 'light'
                  ? '☀️'
                  : themeMode === 'dark'
                    ? '🌙'
                    : '💻'}
              </kbd>
            </p>
          </TooltipContent>
        </Tooltip>

        {isOpen && (
          <div
            className={cn(
              'absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border bg-popover shadow-lg',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2'
            )}
            role='menu'
          >
            <div className='p-1'>
              <button
                onClick={() => handleThemeChange('light')}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                  'transition-colors hover:bg-accent',
                  themeMode === 'light' && 'bg-accent text-accent-foreground'
                )}
                role='menuitem'
              >
                <Sun className='h-4 w-4' />
                <span>Claro</span>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                  'transition-colors hover:bg-accent',
                  themeMode === 'dark' && 'bg-accent text-accent-foreground'
                )}
                role='menuitem'
              >
                <Moon className='h-4 w-4' />
                <span>Oscuro</span>
              </button>

              <button
                onClick={() => handleThemeChange('system')}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                  'transition-colors hover:bg-accent',
                  themeMode === 'system' && 'bg-accent text-accent-foreground'
                )}
                role='menuitem'
              >
                <Monitor className='h-4 w-4' />
                <span>Sistema</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default DarkModeToggle;
