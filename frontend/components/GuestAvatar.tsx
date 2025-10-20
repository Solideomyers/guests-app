import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface GuestAvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * GuestAvatar Component
 * Displays an avatar with initials based on guest name
 * Uses consistent color generation based on name for visual consistency
 */
const GuestAvatar: React.FC<GuestAvatarProps> = ({
  firstName,
  lastName,
  size = 'md',
  className,
}) => {
  // Generate initials from first and last name
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial || '?';
  };

  // Generate consistent color based on name
  const getColorClass = () => {
    const name = `${firstName}${lastName}`.toLowerCase();
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const colors = [
      'bg-primary text-primary-foreground',
      'bg-secondary text-secondary-foreground',
      'bg-chart-1 text-white',
      'bg-chart-2 text-white',
      'bg-accent text-accent-foreground',
      'bg-muted-foreground text-background',
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback className={cn('font-semibold', getColorClass())}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default GuestAvatar;
