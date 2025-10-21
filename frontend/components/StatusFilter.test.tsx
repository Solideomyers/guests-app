import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusFilter from './StatusFilter';
import { useUIStore } from '../stores';
import { GuestStatus } from '../api/types';

// Mock the store
vi.mock('../stores', () => ({
  useUIStore: vi.fn(),
}));

describe('StatusFilter', () => {
  const mockSetStatusFilter = vi.fn();
  let mockStoreState: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreState = {
      statusFilter: 'ALL',
      setStatusFilter: mockSetStatusFilter,
    };
    (useUIStore as any).mockImplementation((selector: any) =>
      selector(mockStoreState)
    );
  });

  it('should render all filter options', () => {
    render(<StatusFilter />);

    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Confirmados')).toBeInTheDocument();
    expect(screen.getByText('Rechazados')).toBeInTheDocument();
  });

  it('should highlight active filter', () => {
    mockStoreState.statusFilter = 'ALL';
    render(<StatusFilter />);

    const todosButton = screen.getByText('Todos');
    expect(todosButton).toHaveClass('border-primary');
    expect(todosButton).toHaveClass('text-primary');
  });

  it('should call setStatusFilter when clicking on Pendientes', async () => {
    const user = userEvent.setup();
    render(<StatusFilter />);

    const pendientesButton = screen.getByText('Pendientes');
    await user.click(pendientesButton);

    expect(mockSetStatusFilter).toHaveBeenCalledWith(GuestStatus.PENDING);
  });

  it('should call setStatusFilter when clicking on Confirmados', async () => {
    const user = userEvent.setup();
    render(<StatusFilter />);

    const confirmadosButton = screen.getByText('Confirmados');
    await user.click(confirmadosButton);

    expect(mockSetStatusFilter).toHaveBeenCalledWith(GuestStatus.CONFIRMED);
  });

  it('should call setStatusFilter when clicking on Rechazados', async () => {
    const user = userEvent.setup();
    render(<StatusFilter />);

    const rechazadosButton = screen.getByText('Rechazados');
    await user.click(rechazadosButton);

    expect(mockSetStatusFilter).toHaveBeenCalledWith(GuestStatus.DECLINED);
  });

  it('should call setStatusFilter with ALL when clicking Todos', async () => {
    const user = userEvent.setup();
    mockStoreState.statusFilter = GuestStatus.CONFIRMED;
    render(<StatusFilter />);

    const todosButton = screen.getByText('Todos');
    await user.click(todosButton);

    expect(mockSetStatusFilter).toHaveBeenCalledWith('ALL');
  });

  it('should highlight Confirmados when active', () => {
    mockStoreState.statusFilter = GuestStatus.CONFIRMED;
    render(<StatusFilter />);

    const confirmadosButton = screen.getByText('Confirmados');
    expect(confirmadosButton).toHaveClass('border-primary');
    expect(confirmadosButton).toHaveClass('text-primary');
  });

  it('should not highlight inactive filters', () => {
    mockStoreState.statusFilter = GuestStatus.CONFIRMED;
    render(<StatusFilter />);

    const pendientesButton = screen.getByText('Pendientes');
    expect(pendientesButton).toHaveClass('border-transparent');
    expect(pendientesButton).not.toHaveClass('border-primary');
  });

  it('should have aria-current on active filter', () => {
    mockStoreState.statusFilter = 'ALL';
    render(<StatusFilter />);

    const todosButton = screen.getByText('Todos');
    expect(todosButton).toHaveAttribute('aria-current', 'page');
  });

  it('should not have aria-current on inactive filters', () => {
    mockStoreState.statusFilter = 'ALL';
    render(<StatusFilter />);

    const pendientesButton = screen.getByText('Pendientes');
    expect(pendientesButton).not.toHaveAttribute('aria-current');
  });

  it('should render as navigation tabs', () => {
    render(<StatusFilter />);

    const nav = screen.getByRole('navigation', { name: /Tabs/i });
    expect(nav).toBeInTheDocument();
  });

  it('should have hover styles on inactive filters', () => {
    mockStoreState.statusFilter = 'ALL';
    render(<StatusFilter />);

    const pendientesButton = screen.getByText('Pendientes');
    expect(pendientesButton).toHaveClass('hover:text-foreground');
    expect(pendientesButton).toHaveClass('hover:border-border');
  });

  it('should handle rapid filter changes', async () => {
    const user = userEvent.setup({ delay: null });
    render(<StatusFilter />);

    const pendientesButton = screen.getByText('Pendientes');
    const confirmadosButton = screen.getByText('Confirmados');

    await user.click(pendientesButton);
    await user.click(confirmadosButton);

    expect(mockSetStatusFilter).toHaveBeenCalledTimes(2);
    expect(mockSetStatusFilter).toHaveBeenNthCalledWith(1, GuestStatus.PENDING);
    expect(mockSetStatusFilter).toHaveBeenNthCalledWith(
      2,
      GuestStatus.CONFIRMED
    );
  });
});
