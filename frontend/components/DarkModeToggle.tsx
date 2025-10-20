import React, { useEffect } from 'react';
import { useUIStore } from '../stores';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';

/**
 * DarkModeToggle Component
 * Switches between light and dark mode with smooth transition using shadcn Switch
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
          <div className='flex items-center gap-2'>
            <Sun
              className={`h-4 w-4 transition-colors ${!darkMode ? 'text-yellow-500' : 'text-gray-400'}`}
            />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label={
                darkMode ? 'Activar modo claro' : 'Activar modo oscuro'
              }
            />
            <Moon
              className={`h-4 w-4 transition-colors ${darkMode ? 'text-blue-400' : 'text-gray-400'}`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DarkModeToggle;
