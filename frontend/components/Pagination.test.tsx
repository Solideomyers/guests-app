import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

// Mock the usePrefetchGuests hook
vi.mock('../hooks', () => ({
  usePrefetchGuests: () => ({
    prefetchPage: vi.fn(),
  }),
}));

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when totalItems is 0', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
        totalItems={0}
        itemsPerPage={10}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render pagination info', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should render Anterior and Siguiente buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    expect(
      screen.getByRole('button', { name: /Anterior/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Siguiente/i })
    ).toBeInTheDocument();
  });

  it('should disable Anterior button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const anteriorButton = screen.getByRole('button', { name: /Anterior/i });
    expect(anteriorButton).toBeDisabled();
  });

  it('should disable Siguiente button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const siguienteButton = screen.getByRole('button', { name: /Siguiente/i });
    expect(siguienteButton).toBeDisabled();
  });

  it('should call onPageChange with previous page when Anterior is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const anteriorButton = screen.getByRole('button', { name: /Anterior/i });
    await user.click(anteriorButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange with next page when Siguiente is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const siguienteButton = screen.getByRole('button', { name: /Siguiente/i });
    await user.click(siguienteButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should not call onPageChange when Anterior is disabled', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const anteriorButton = screen.getByRole('button', { name: /Anterior/i });
    await user.click(anteriorButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should not call onPageChange when Siguiente is disabled', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const siguienteButton = screen.getByRole('button', { name: /Siguiente/i });
    await user.click(siguienteButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should calculate correct item range for middle page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    expect(screen.getByText('21')).toBeInTheDocument(); // startItem
    expect(screen.getByText('30')).toBeInTheDocument(); // endItem
  });

  it('should calculate correct item range for last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={47}
        itemsPerPage={10}
      />
    );

    expect(screen.getByText('41')).toBeInTheDocument(); // startItem
    // Use getAllByText for number 47 that appears twice (endItem and totalItems)
    const elements47 = screen.getAllByText('47');
    expect(elements47).toHaveLength(2); // endItem and totalItems
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const nav = screen.getByRole('navigation', { name: /Pagination/i });
    expect(nav).toBeInTheDocument();
  });

  it('should handle single page correctly', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        totalItems={5}
        itemsPerPage={10}
      />
    );

    const anteriorButton = screen.getByRole('button', { name: /Anterior/i });
    const siguienteButton = screen.getByRole('button', { name: /Siguiente/i });

    expect(anteriorButton).toBeDisabled();
    expect(siguienteButton).toBeDisabled();
  });

  it('should show correct info when only one item', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        totalItems={1}
        itemsPerPage={10}
      />
    );

    // Use getAllByText for number 1 that appears 3 times (startItem, endItem, totalItems)
    const elements1 = screen.getAllByText('1');
    expect(elements1).toHaveLength(3);
  });

  it('should have disabled button styles', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    );

    const anteriorButton = screen.getByRole('button', { name: /Anterior/i });
    expect(anteriorButton).toHaveClass('disabled:opacity-50');
    expect(anteriorButton).toHaveClass('disabled:cursor-not-allowed');
  });
});
