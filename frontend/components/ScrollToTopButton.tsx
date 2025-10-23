import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Muestra el botón cuando la página se desplaza hacia abajo
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Configura un listener para el evento de scroll
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Desplaza la página hacia arriba suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      size='icon'
      className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-110 text-primary-foreground ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label='Ir arriba'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2.5}
        stroke='currentColor'
        className='w-6 h-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75'
        />
      </svg>
    </Button>
  );
};

export default ScrollToTopButton;
