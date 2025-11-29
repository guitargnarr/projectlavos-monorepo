import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CompletionButton from './CompletionButton';

describe('CompletionButton', () => {
  const defaultProps = {
    filename: 'test-file.gp',
    isCompleted: false,
    onToggle: vi.fn(),
  };

  it('renders button', () => {
    render(<CompletionButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls onToggle with filename when clicked', () => {
    const onToggle = vi.fn();
    render(<CompletionButton {...defaultProps} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('test-file.gp');
  });

  it('shows green styling when completed', () => {
    render(<CompletionButton {...defaultProps} isCompleted={true} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-500/20');
    expect(button.className).toContain('text-green-400');
  });

  it('shows gray styling when not completed', () => {
    render(<CompletionButton {...defaultProps} isCompleted={false} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-gray-700');
    expect(button.className).toContain('text-gray-400');
  });

  it('has correct title when completed', () => {
    render(<CompletionButton {...defaultProps} isCompleted={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Mark as incomplete');
  });

  it('has correct title when not completed', () => {
    render(<CompletionButton {...defaultProps} isCompleted={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Mark as complete');
  });

  it('displays Done text when completed', () => {
    render(<CompletionButton {...defaultProps} isCompleted={true} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('displays Mark Done text when not completed', () => {
    render(<CompletionButton {...defaultProps} isCompleted={false} />);
    expect(screen.getByText('Mark Done')).toBeInTheDocument();
  });

  it('renders checkmark icon when completed', () => {
    const { container } = render(<CompletionButton {...defaultProps} isCompleted={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });

  it('renders outline icon when not completed', () => {
    const { container } = render(<CompletionButton {...defaultProps} isCompleted={false} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('fill', 'none');
  });
});
