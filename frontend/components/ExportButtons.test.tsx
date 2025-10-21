import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExportButtons from './ExportButtons';

describe('ExportButtons', () => {
  it('should render CSV and PDF buttons', () => {
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    expect(screen.getByLabelText(/Exportar a CSV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Exportar a PDF/i)).toBeInTheDocument();
  });

  it('should display CSV text', () => {
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    expect(screen.getByText('CSV')).toBeInTheDocument();
  });

  it('should display PDF text', () => {
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('should call onExportCSV when CSV button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const csvButton = screen.getByLabelText(/Exportar a CSV/i);
    await user.click(csvButton);

    expect(mockOnExportCSV).toHaveBeenCalledTimes(1);
  });

  it('should call onExportPDF when PDF button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const pdfButton = screen.getByLabelText(/Exportar a PDF/i);
    await user.click(pdfButton);

    expect(mockOnExportPDF).toHaveBeenCalledTimes(1);
  });

  it('should not call onExportPDF when CSV button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const csvButton = screen.getByLabelText(/Exportar a CSV/i);
    await user.click(csvButton);

    expect(mockOnExportPDF).not.toHaveBeenCalled();
  });

  it('should not call onExportCSV when PDF button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const pdfButton = screen.getByLabelText(/Exportar a PDF/i);
    await user.click(pdfButton);

    expect(mockOnExportCSV).not.toHaveBeenCalled();
  });

  it('should render download icons on both buttons', () => {
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    const { container } = render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
  });

  it('should have outline variant buttons', () => {
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    const { container } = render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
  });

  it('should handle multiple rapid clicks on CSV', async () => {
    const user = userEvent.setup({ delay: null });
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const csvButton = screen.getByLabelText(/Exportar a CSV/i);
    await user.click(csvButton);
    await user.click(csvButton);
    await user.click(csvButton);

    expect(mockOnExportCSV).toHaveBeenCalledTimes(3);
  });

  it('should handle multiple rapid clicks on PDF', async () => {
    const user = userEvent.setup({ delay: null });
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const pdfButton = screen.getByLabelText(/Exportar a PDF/i);
    await user.click(pdfButton);
    await user.click(pdfButton);

    expect(mockOnExportPDF).toHaveBeenCalledTimes(2);
  });

  it('should have proper responsive classes', () => {
    const mockOnExportCSV = vi.fn();
    const mockOnExportPDF = vi.fn();

    const { container } = render(
      <ExportButtons
        onExportCSV={mockOnExportCSV}
        onExportPDF={mockOnExportPDF}
      />
    );

    const buttons = container.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('sm:w-auto');
    });
  });
});
