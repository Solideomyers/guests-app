import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { useUIStore } from '../stores';

// Mock the store
vi.mock('../stores', () => ({
  useUIStore: vi.fn(),
}));

describe('SearchBar', () => {
  const mockSetSearchQuery = vi.fn();
  let mockStoreState: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreState = {
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
    };
    (useUIStore as any).mockImplementation((selector: any) =>
      selector(mockStoreState)
    );
  });

  it('should render search input', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre, iglesia, ciudad.../i
    );
    expect(input).toBeInTheDocument();
  });

  it('should display search icon', () => {
    const { container } = render(<SearchBar />);

    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should update local value immediately on input change', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre, iglesia, ciudad.../i
    );
    await user.type(input, 'John');

    expect(input).toHaveValue('John');
  });

  it('should debounce search query updates', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre, iglesia, ciudad.../i
    );

    // Type quickly
    await user.type(input, 'John');

    // Should not call immediately
    expect(mockSetSearchQuery).not.toHaveBeenCalled();

    // Wait for debounce (300ms)
    await waitFor(
      () => {
        expect(mockSetSearchQuery).toHaveBeenCalledWith('John');
      },
      { timeout: 500 }
    );
  });

  it('should show clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre, iglesia, ciudad.../i
    );
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText(/Limpiar búsqueda/i);
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when input is empty', () => {
    render(<SearchBar />);

    const clearButton = screen.queryByLabelText(/Limpiar búsqueda/i);
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', async () => {
    const user = userEvent.setup();
    mockStoreState.searchQuery = 'test';
    render(<SearchBar />);

    const clearButton = screen.getByLabelText(/Limpiar búsqueda/i);
    await user.click(clearButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('');
    });
  });

  it('should sync local value with store searchQuery', () => {
    mockStoreState.searchQuery = 'Alice';
    const { rerender } = render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre, iglesia, ciudad.../i
    );
    expect(input).toHaveValue('Alice');

    // Update store value
    mockStoreState.searchQuery = 'Bob';
    rerender(<SearchBar />);

    expect(input).toHaveValue('Bob');
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre, iglesia, ciudad.../i
    );
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should not call setSearchQuery if value has not changed', async () => {
    mockStoreState.searchQuery = 'test';
    render(<SearchBar />);

    // Wait for any potential debounced calls
    await waitFor(() => {}, { timeout: 400 });

    expect(mockSetSearchQuery).not.toHaveBeenCalled();
  });

  it('should handle rapid typing correctly', async () => {
    const user = userEvent.setup({ delay: null }); // No delay for rapid typing
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(
      /Buscar por nombre, iglesia, ciudad.../i
    );

    await user.type(input, 'Testing');

    // Should only call once after debounce
    await waitFor(
      () => {
        expect(mockSetSearchQuery).toHaveBeenCalledTimes(1);
        expect(mockSetSearchQuery).toHaveBeenCalledWith('Testing');
      },
      { timeout: 500 }
    );
  });
});
