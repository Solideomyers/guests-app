import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, TrendingUp, CheckCircle } from 'lucide-react';

interface CTABannerProps {
  type: 'empty' | 'low-confirmation' | 'success';
  onAction: () => void;
}

/**
 * CTABanner Component
 * Call-to-action banner with different states based on guest statistics
 * Follows Dark Matter theme and UX best practices
 */
const CTABanner: React.FC<CTABannerProps> = ({ type, onAction }) => {
  const content = {
    empty: {
      icon: UserPlus,
      title: '¡Comienza a gestionar tus invitados!',
      description:
        'Crea tu primera lista de invitados y mantén todo organizado en un solo lugar.',
      cta: 'Añadir primer invitado',
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      iconColor: 'text-primary',
      ctaColor: 'bg-primary hover:bg-primary/90',
    },
    'low-confirmation': {
      icon: TrendingUp,
      title: 'Aumenta tus confirmaciones',
      description:
        'Envía recordatorios y actualiza el estado de tus invitados para mejorar la organización.',
      cta: 'Gestionar invitados',
      gradient: 'from-chart-1/20 via-chart-1/10 to-transparent',
      iconColor: 'text-chart-1',
      ctaColor: 'bg-chart-1 hover:bg-chart-1/90',
    },
    success: {
      icon: CheckCircle,
      title: '¡Excelente trabajo!',
      description:
        'La mayoría de tus invitados están confirmados. Mantén el buen trabajo.',
      cta: 'Ver estadísticas',
      gradient: 'from-secondary/20 via-secondary/10 to-transparent',
      iconColor: 'text-secondary',
      ctaColor: 'bg-secondary hover:bg-secondary/90',
    },
  };

  const config = content[type];
  const Icon = config.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-r ${config.gradient} p-6 md:p-8 mb-6 backdrop-blur-sm animate-fade-in`}
    >
      {/* Decorative Elements */}
      <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10' />
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-10' />

      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
        <div className='flex items-start gap-4 flex-1'>
          {/* Icon */}
          <div className='flex-shrink-0'>
            <div className='p-3 rounded-xl bg-card border-2 border-border shadow-sm'>
              <Icon className={`h-8 w-8 ${config.iconColor}`} />
            </div>
          </div>

          {/* Content */}
          <div className='space-y-2'>
            <h3 className='text-xl md:text-2xl font-bold text-foreground'>
              {config.title}
            </h3>
            <p className='text-sm md:text-base text-muted-foreground max-w-2xl'>
              {config.description}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onAction}
          className={`${config.ctaColor} text-white font-semibold px-6 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap`}
        >
          {config.cta}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-5 h-5 ml-2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default CTABanner;
