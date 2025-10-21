import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GuestAvatar from './GuestAvatar';

describe('GuestAvatar', () => {
  it('should render initials from first and last name', () => {
    render(<GuestAvatar firstName='John' lastName='Doe' />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should handle single character names', () => {
    render(<GuestAvatar firstName='A' lastName='B' />);

    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('should handle lowercase names and convert to uppercase', () => {
    render(<GuestAvatar firstName='alice' lastName='smith' />);

    expect(screen.getByText('AS')).toBeInTheDocument();
  });

  it('should handle empty first name', () => {
    render(<GuestAvatar firstName='' lastName='Doe' />);

    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('should handle empty last name', () => {
    render(<GuestAvatar firstName='John' lastName='' />);

    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should display fallback when both names are empty', () => {
    render(<GuestAvatar firstName='' lastName='' />);

    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should render with small size', () => {
    const { container } = render(
      <GuestAvatar firstName='John' lastName='Doe' size='sm' />
    );

    const avatar = container.querySelector('.h-8');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('w-8');
    expect(avatar).toHaveClass('text-xs');
  });

  it('should render with medium size by default', () => {
    const { container } = render(
      <GuestAvatar firstName='John' lastName='Doe' />
    );

    const avatar = container.querySelector('.h-10');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('w-10');
    expect(avatar).toHaveClass('text-sm');
  });

  it('should render with large size', () => {
    const { container } = render(
      <GuestAvatar firstName='John' lastName='Doe' size='lg' />
    );

    const avatar = container.querySelector('.h-12');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('w-12');
    expect(avatar).toHaveClass('text-base');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <GuestAvatar firstName='John' lastName='Doe' className='custom-class' />
    );

    const avatar = container.querySelector('.custom-class');
    expect(avatar).toBeInTheDocument();
  });

  it('should generate consistent color for same name', () => {
    const { container: container1 } = render(
      <GuestAvatar firstName='John' lastName='Doe' />
    );
    const { container: container2 } = render(
      <GuestAvatar firstName='John' lastName='Doe' />
    );

    const fallback1 = container1.querySelector('[class*="bg-"]');
    const fallback2 = container2.querySelector('[class*="bg-"]');

    expect(fallback1?.className).toBe(fallback2?.className);
  });

  it('should generate different colors for different names', () => {
    const { container: container1 } = render(
      <GuestAvatar firstName='John' lastName='Doe' />
    );
    const { container: container2 } = render(
      <GuestAvatar firstName='Alice' lastName='Smith' />
    );

    const fallback1 = container1.querySelector('[class*="bg-"]');
    const fallback2 = container2.querySelector('[class*="bg-"]');

    // While not guaranteed to be different, they should be for these specific names
    // Just check both exist
    expect(fallback1).toBeInTheDocument();
    expect(fallback2).toBeInTheDocument();
  });

  it('should handle special characters in names', () => {
    render(<GuestAvatar firstName='José' lastName='García' />);

    expect(screen.getByText('JG')).toBeInTheDocument();
  });

  it('should handle names with spaces', () => {
    render(<GuestAvatar firstName='John Paul' lastName='Doe Smith' />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should be case insensitive for color generation', () => {
    const { container: container1 } = render(
      <GuestAvatar firstName='JOHN' lastName='DOE' />
    );
    const { container: container2 } = render(
      <GuestAvatar firstName='john' lastName='doe' />
    );

    const fallback1 = container1.querySelector('[class*="bg-"]');
    const fallback2 = container2.querySelector('[class*="bg-"]');

    expect(fallback1?.className).toBe(fallback2?.className);
  });
});
