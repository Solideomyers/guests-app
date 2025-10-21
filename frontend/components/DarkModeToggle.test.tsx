import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from './DarkModeToggle';
import { useUIStore } from '../stores';

// Mock the store
vi.mock('../stores', () => ({
  useUIStore: vi.fn(),
}));

describe('DarkModeToggle', () => {
  const mockToggleDarkMode = vi.fn();
  let mockStoreState: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document classes
    document.documentElement.classList.remove('dark');

    mockStoreState = {
      darkMode: false,
      toggleDarkMode: mockToggleDarkMode,
    };
    (useUIStore as any).mockImplementation((selector: any) =>
      selector(mockStoreState)
    );
  });

  it('should render dark mode toggle button', () => {
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', {
      name: /Activar modo oscuro/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('should display moon icon in light mode', () => {
    mockStoreState.darkMode = false;
    const { container } = render(<DarkModeToggle />);

    // In light mode, moon should be visible (scale-100, rotate-0)
    const moonIcon = container.querySelector('.rotate-0.scale-100');
    expect(moonIcon).toBeInTheDocument();
  });

  it('should display sun icon in dark mode', () => {
    mockStoreState.darkMode = true;
    const { container } = render(<DarkModeToggle />);

    // In dark mode, sun should be visible (scale-100, rotate-0)
    const sunIcon = container.querySelector('.rotate-0.scale-100');
    expect(sunIcon).toBeInTheDocument();
  });

  it('should call toggleDarkMode when clicked', async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', {
      name: /Activar modo oscuro/i,
    });
    await user.click(button);

    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
  });

  it('should add dark class to html element when darkMode is true', () => {
    mockStoreState.darkMode = true;
    render(<DarkModeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class from html element when darkMode is false', () => {
    mockStoreState.darkMode = false;
    render(<DarkModeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should update html class when darkMode changes', () => {
    mockStoreState.darkMode = false;
    const { rerender } = render(<DarkModeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Update store state
    mockStoreState.darkMode = true;
    rerender(<DarkModeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should have correct aria-label in light mode', () => {
    mockStoreState.darkMode = false;
    render(<DarkModeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Activar modo oscuro');
  });

  it('should have correct aria-label in dark mode', () => {
    mockStoreState.darkMode = true;
    render(<DarkModeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Activar modo claro');
  });

  it('should have screen reader text', () => {
    mockStoreState.darkMode = false;
    render(<DarkModeToggle />);

    const srText = screen.getByText('Modo oscuro');
    expect(srText).toHaveClass('sr-only');
  });

  it('should update screen reader text based on mode', () => {
    mockStoreState.darkMode = true;
    render(<DarkModeToggle />);

    const srText = screen.getByText('Modo claro');
    expect(srText).toHaveClass('sr-only');
  });

  it('should have transition classes on icons', () => {
    const { container } = render(<DarkModeToggle />);

    const icons = container.querySelectorAll('svg');
    icons.forEach((icon) => {
      expect(icon).toHaveClass('transition-all');
      expect(icon).toHaveClass('duration-500');
    });
  });

  it('should handle multiple rapid clicks', async () => {
    const user = userEvent.setup({ delay: null });
    render(<DarkModeToggle />);

    const button = screen.getByRole('button');

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockToggleDarkMode).toHaveBeenCalledTimes(3);
  });

  it('should have hover styles', () => {
    const { container } = render(<DarkModeToggle />);

    const button = container.querySelector('button');
    expect(button).toHaveClass('hover:bg-accent');
    expect(button).toHaveClass('transition-all');
  });
});
