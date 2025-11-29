import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LessonCard from './LessonCard';

const mockLesson = {
  filename: 'test-lesson.gp',
  title: 'Test Lesson Title',
  description: 'This is a test description for the lesson.',
  category: 'arpeggio',
  difficulty: 'beginner',
  tier: 'free',
  techniques: ['sweep', 'alternate'],
};

const mockLessonPremium = {
  ...mockLesson,
  tier: 'premium',
  difficulty: 'intermediate',
};

const mockLessonAdvanced = {
  ...mockLesson,
  tier: 'pro',
  difficulty: 'advanced',
  techniques: ['sweep', 'tapping', 'legato', 'economy'],
};

const defaultProps = {
  file: mockLesson,
  isFavorite: false,
  isCompleted: false,
  onToggleFavorite: vi.fn(),
  onToggleCompleted: vi.fn(),
  onShare: vi.fn(),
  onPreview: vi.fn(),
  iconPositions: {
    favorite: 'top-3 right-3',
    share: 'top-14 right-3',
  },
};

describe('LessonCard', () => {
  it('renders lesson title', () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText('Test Lesson Title')).toBeInTheDocument();
  });

  it('renders lesson description', () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText('This is a test description for the lesson.')).toBeInTheDocument();
  });

  it('renders category', () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText('arpeggio')).toBeInTheDocument();
  });

  it('renders difficulty badge', () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('renders tier badge', () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText('free')).toBeInTheDocument();
  });

  it('renders techniques', () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText('sweep')).toBeInTheDocument();
    expect(screen.getByText('alternate')).toBeInTheDocument();
  });

  it('shows +N for more than 3 techniques', () => {
    render(<LessonCard {...defaultProps} file={mockLessonAdvanced} />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('calls onPreview when Preview Tab button is clicked', () => {
    const onPreview = vi.fn();
    render(<LessonCard {...defaultProps} onPreview={onPreview} />);

    fireEvent.click(screen.getByText('Preview Tab'));
    expect(onPreview).toHaveBeenCalledWith('test-lesson.gp');
  });

  it('renders multiple buttons', () => {
    render(<LessonCard {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3); // favorite, completion, preview
  });

  it('renders beginner difficulty with emerald color', () => {
    render(<LessonCard {...defaultProps} />);
    const badge = screen.getByText('beginner');
    expect(badge.className).toContain('bg-emerald-500/20');
  });

  it('renders intermediate difficulty with yellow color', () => {
    render(<LessonCard {...defaultProps} file={mockLessonPremium} />);
    const badge = screen.getByText('intermediate');
    expect(badge.className).toContain('bg-yellow-500/20');
  });

  it('renders advanced difficulty with red color', () => {
    render(<LessonCard {...defaultProps} file={mockLessonAdvanced} />);
    const badge = screen.getByText('advanced');
    expect(badge.className).toContain('bg-red-500/20');
  });

  it('renders free tier with green color', () => {
    render(<LessonCard {...defaultProps} />);
    const badge = screen.getByText('free');
    expect(badge.className).toContain('bg-green-500/20');
  });

  it('renders premium tier with blue color', () => {
    render(<LessonCard {...defaultProps} file={mockLessonPremium} />);
    const badge = screen.getByText('premium');
    expect(badge.className).toContain('bg-blue-500/20');
  });

  it('renders pro tier with purple color', () => {
    render(<LessonCard {...defaultProps} file={mockLessonAdvanced} />);
    const badge = screen.getByText('pro');
    expect(badge.className).toContain('bg-purple-500/20');
  });

  it('renders without description gracefully', () => {
    const lessonWithoutDesc = { ...mockLesson };
    delete lessonWithoutDesc.description;

    render(<LessonCard {...defaultProps} file={lessonWithoutDesc} />);
    expect(screen.getByText('Test Lesson Title')).toBeInTheDocument();
  });

  it('renders Preview Tab button', () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText('Preview Tab')).toBeInTheDocument();
  });

  it('has card styling', () => {
    const { container } = render(<LessonCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card.className).toContain('bg-gray-800');
    expect(card.className).toContain('rounded-lg');
  });
});
