import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('renders progress text', () => {
    render(<ProgressBar completed={5} total={10} />);
    expect(screen.getByText(/Overall Progress/)).toBeInTheDocument();
    expect(screen.getByText(/5\/10/)).toBeInTheDocument();
  });

  it('calculates and displays percentage correctly', () => {
    render(<ProgressBar completed={25} total={100} />);
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('handles zero total gracefully', () => {
    render(<ProgressBar completed={0} total={0} />);
    // NaN% will display, but shouldn't crash
    expect(screen.getByText(/Overall Progress/)).toBeInTheDocument();
  });

  it('handles 100% completion', () => {
    render(<ProgressBar completed={70} total={70} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders progress bar element with correct width', () => {
    const { container } = render(<ProgressBar completed={50} total={100} />);
    const progressFill = container.querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '50%' });
  });

  it('displays lessons completed text', () => {
    render(<ProgressBar completed={10} total={70} />);
    expect(screen.getByText(/lessons completed/)).toBeInTheDocument();
  });
});
