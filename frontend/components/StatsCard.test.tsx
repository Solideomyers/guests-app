import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from './StatsCard';

describe('StatsCard', () => {
  it('should render title and value correctly', () => {
    render(
      <StatsCard
        title='Total Invitados'
        value={150}
        colorClass='bg-primary'
      />
    );

    expect(screen.getByText('Total Invitados')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should render with string value', () => {
    render(
      <StatsCard title='Confirmados' value='85%' colorClass='bg-green-500' />
    );

    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should display correct icon for Total Invitados', () => {
    const { container } = render(
      <StatsCard
        title='Total Invitados'
        value={100}
        colorClass='bg-primary'
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display correct icon for Pastores', () => {
    const { container } = render(
      <StatsCard title='Pastores' value={25} colorClass='bg-blue-500' />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display correct icon for Confirmados', () => {
    const { container } = render(
      <StatsCard title='Confirmados' value={80} colorClass='bg-green-500' />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display correct icon for Pendientes', () => {
    const { container } = render(
      <StatsCard title='Pendientes' value={15} colorClass='bg-yellow-500' />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display correct icon for Rechazados', () => {
    const { container } = render(
      <StatsCard title='Rechazados' value={5} colorClass='bg-red-500' />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should not display icon for unknown title', () => {
    const { container } = render(
      <StatsCard title='Unknown' value={10} colorClass='bg-gray-500' />
    );

    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('should apply custom color class', () => {
    const { container } = render(
      <StatsCard
        title='Total Invitados'
        value={100}
        colorClass='bg-purple-500'
      />
    );

    const coloredDiv = container.querySelector('.bg-purple-500');
    expect(coloredDiv).toBeInTheDocument();
  });

  it('should render with zero value', () => {
    render(
      <StatsCard title='Confirmados' value={0} colorClass='bg-green-500' />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should have correct CSS classes for card layout', () => {
    const { container } = render(
      <StatsCard
        title='Total Invitados'
        value={100}
        colorClass='bg-primary'
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('shadow-md');
  });
});
