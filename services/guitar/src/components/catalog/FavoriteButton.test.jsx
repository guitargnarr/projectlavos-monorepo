import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  const defaultProps = {
    filename: 'test-file.gp',
    isFavorite: false,
    onToggle: vi.fn(),
    position: 'top-3 right-3',
  };

  it('renders button', () => {
    render(<FavoriteButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls onToggle with filename when clicked', () => {
    const onToggle = vi.fn();
    render(<FavoriteButton {...defaultProps} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('test-file.gp');
  });

  it('applies position classes', () => {
    render(<FavoriteButton {...defaultProps} position="top-5 right-5" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('top-5');
    expect(button.className).toContain('right-5');
  });

  it('has correct aria-label when favorited', () => {
    render(<FavoriteButton {...defaultProps} isFavorite={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  it('has correct aria-label when not favorited', () => {
    render(<FavoriteButton {...defaultProps} isFavorite={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Add to favorites');
  });

  it('renders pink heart when favorited', () => {
    const { container } = render(<FavoriteButton {...defaultProps} isFavorite={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-pink-500');
  });

  it('renders gray heart when not favorited', () => {
    const { container } = render(<FavoriteButton {...defaultProps} isFavorite={false} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-gray-400');
  });

  it('has hover scale effect', () => {
    render(<FavoriteButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('hover:scale-110');
  });
});
