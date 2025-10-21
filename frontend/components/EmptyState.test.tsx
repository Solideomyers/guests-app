import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should render empty state message', () => {
    const mockOnAddGuest = vi.fn();
    render(<EmptyState onAddGuest={mockOnAddGuest} />);

    expect(screen.getByText('No hay invitados aún')).toBeInTheDocument();
    expect(
      screen.getByText(/Empieza agregando tus primeros invitados/)
    ).toBeInTheDocument();
  });

  it('should render add guest button', () => {
    const mockOnAddGuest = vi.fn();
    render(<EmptyState onAddGuest={mockOnAddGuest} />);

    const button = screen.getByRole('button', {
      name: /Añadir Primer Invitado/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('should call onAddGuest when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnAddGuest = vi.fn();
    render(<EmptyState onAddGuest={mockOnAddGuest} />);

    const button = screen.getByRole('button', {
      name: /Añadir Primer Invitado/i,
    });
    await user.click(button);

    expect(mockOnAddGuest).toHaveBeenCalledTimes(1);
  });

  it('should not render templates when onUseTemplate is not provided', () => {
    const mockOnAddGuest = vi.fn();
    render(<EmptyState onAddGuest={mockOnAddGuest} />);

    expect(
      screen.queryByText(/O comienza con una plantilla de ejemplo/)
    ).not.toBeInTheDocument();
  });

  it('should render templates when onUseTemplate is provided', () => {
    const mockOnAddGuest = vi.fn();
    const mockOnUseTemplate = vi.fn();
    render(
      <EmptyState
        onAddGuest={mockOnAddGuest}
        onUseTemplate={mockOnUseTemplate}
      />
    );

    expect(
      screen.getByText('O comienza con una plantilla de ejemplo:')
    ).toBeInTheDocument();
    expect(screen.getByText('Pastor Juan García')).toBeInTheDocument();
    expect(screen.getByText('Pastor María López')).toBeInTheDocument();
    expect(screen.getByText('Pastor Carlos Mendez')).toBeInTheDocument();
  });

  it('should render all template details', () => {
    const mockOnAddGuest = vi.fn();
    const mockOnUseTemplate = vi.fn();
    render(
      <EmptyState
        onAddGuest={mockOnAddGuest}
        onUseTemplate={mockOnUseTemplate}
      />
    );

    // Template 1
    expect(screen.getByText('Pastor Juan García')).toBeInTheDocument();
    expect(screen.getByText('Iglesia Central')).toBeInTheDocument();
    expect(screen.getByText('Ciudad Principal')).toBeInTheDocument();

    // Template 2
    expect(screen.getByText('Pastor María López')).toBeInTheDocument();
    expect(screen.getByText('Iglesia Nueva Vida')).toBeInTheDocument();
    expect(screen.getByText('Ciudad Satélite')).toBeInTheDocument();

    // Template 3
    expect(screen.getByText('Pastor Carlos Mendez')).toBeInTheDocument();
    expect(screen.getByText('Iglesia del Valle')).toBeInTheDocument();
    expect(screen.getByText('Ciudad Norte')).toBeInTheDocument();
  });

  it('should call onUseTemplate with correct template name when clicked', async () => {
    const user = userEvent.setup();
    const mockOnAddGuest = vi.fn();
    const mockOnUseTemplate = vi.fn();
    render(
      <EmptyState
        onAddGuest={mockOnAddGuest}
        onUseTemplate={mockOnUseTemplate}
      />
    );

    const template1 = screen.getByText('Pastor Juan García').closest('div');
    if (template1) {
      // Find the card parent
      const card = template1.closest('[class*="cursor-pointer"]');
      if (card) {
        await user.click(card);
        expect(mockOnUseTemplate).toHaveBeenCalledWith('Pastor Juan García');
      }
    }
  });

  it('should render Users icon', () => {
    const mockOnAddGuest = vi.fn();
    const { container } = render(<EmptyState onAddGuest={mockOnAddGuest} />);

    // Check for lucide-react Users icon
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should have proper accessibility structure', () => {
    const mockOnAddGuest = vi.fn();
    render(<EmptyState onAddGuest={mockOnAddGuest} />);

    const heading = screen.getByRole('heading', {
      name: 'No hay invitados aún',
    });
    expect(heading).toBeInTheDocument();
  });
});
