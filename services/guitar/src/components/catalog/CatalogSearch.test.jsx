import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CatalogSearch from './CatalogSearch';

describe('CatalogSearch', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  it('renders search input', () => {
    render(<CatalogSearch {...defaultProps} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<CatalogSearch {...defaultProps} value="pentatonic" />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toHaveValue('pentatonic');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<CatalogSearch {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'scale' } });

    expect(onChange).toHaveBeenCalledWith('scale');
  });

  it('has proper input type', () => {
    render(<CatalogSearch {...defaultProps} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toHaveAttribute('type', 'text');
  });
});
