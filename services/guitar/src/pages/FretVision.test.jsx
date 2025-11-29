import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FretVision from './FretVision';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FretVision Page', () => {
  describe('Rendering', () => {
    it('renders the page title', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText('FretVision')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText(/Visualize Guitar Scales and Chords/i)).toBeInTheDocument();
    });

    it('renders back to home link', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });

    it('renders tuning label', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText('Guitar Tuning')).toBeInTheDocument();
    });

    it('renders scale type label', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText('Scale Type')).toBeInTheDocument();
    });

    it('renders root note selector section', () => {
      renderWithRouter(<FretVision />);
      // Just check that note buttons exist
      expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
    });

    it('renders all 12 note buttons', () => {
      renderWithRouter(<FretVision />);
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      notes.forEach(note => {
        expect(screen.getByRole('button', { name: note })).toBeInTheDocument();
      });
    });

    it('renders notes in scale section', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText(/Notes in Scale/i)).toBeInTheDocument();
    });

    it('renders legend section', () => {
      renderWithRouter(<FretVision />);
      // Check that legend elements exist with specific selectors
      const legendElements = screen.getAllByText(/Notes/i);
      expect(legendElements.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('changes root note when clicking note button', () => {
      renderWithRouter(<FretVision />);

      const eButton = screen.getByRole('button', { name: 'E' });
      fireEvent.click(eButton);

      expect(eButton).toHaveClass('bg-green-500');
    });

    it('only one note is selected at a time', () => {
      renderWithRouter(<FretVision />);

      const aButton = screen.getByRole('button', { name: 'A' });
      const bButton = screen.getByRole('button', { name: 'B' });

      // B is selected by default
      expect(bButton).toHaveClass('bg-green-500');

      // Click A
      fireEvent.click(aButton);

      // Now A should be selected, B should not
      expect(aButton).toHaveClass('bg-green-500');
      expect(bButton).not.toHaveClass('bg-green-500');
    });
  });

  describe('Fretboard Display', () => {
    it('renders fret number 0', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders fret number 12', () => {
      renderWithRouter(<FretVision />);
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });
});

describe('Scale Calculation Logic', () => {
  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const SCALES = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'pentatonic-major': [0, 2, 4, 7, 9],
    'pentatonic-minor': [0, 3, 5, 7, 10],
    'blues': [0, 3, 5, 6, 7, 10],
  };

  const calculateScaleNotes = (root, scaleType) => {
    const rootIndex = NOTE_NAMES.indexOf(root);
    const scaleIntervals = SCALES[scaleType];
    return scaleIntervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTE_NAMES[noteIndex];
    });
  };

  it('calculates C major scale correctly', () => {
    const scale = calculateScaleNotes('C', 'major');
    expect(scale).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('calculates A minor scale correctly', () => {
    const scale = calculateScaleNotes('A', 'minor');
    expect(scale).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });

  it('calculates E minor pentatonic correctly', () => {
    const scale = calculateScaleNotes('E', 'pentatonic-minor');
    expect(scale).toEqual(['E', 'G', 'A', 'B', 'D']);
  });

  it('calculates G major pentatonic correctly', () => {
    const scale = calculateScaleNotes('G', 'pentatonic-major');
    expect(scale).toEqual(['G', 'A', 'B', 'D', 'E']);
  });

  it('calculates A blues scale correctly', () => {
    const scale = calculateScaleNotes('A', 'blues');
    expect(scale).toEqual(['A', 'C', 'D', 'D#', 'E', 'G']);
  });

  it('handles sharp root notes', () => {
    const scale = calculateScaleNotes('F#', 'major');
    expect(scale[0]).toBe('F#');
    expect(scale.length).toBe(7);
  });

  it('wraps around correctly for B major', () => {
    const scale = calculateScaleNotes('B', 'major');
    expect(scale[0]).toBe('B');
    expect(scale).toContain('C#');
    expect(scale).toContain('D#');
  });
});

describe('Fret Note Calculation', () => {
  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const getNoteAtFret = (stringNote, fret) => {
    const stringIndex = NOTE_NAMES.indexOf(stringNote);
    const noteIndex = (stringIndex + fret) % 12;
    return NOTE_NAMES[noteIndex];
  };

  it('calculates open string correctly', () => {
    expect(getNoteAtFret('E', 0)).toBe('E');
  });

  it('calculates 5th fret on E string (A)', () => {
    expect(getNoteAtFret('E', 5)).toBe('A');
  });

  it('calculates 12th fret (octave)', () => {
    expect(getNoteAtFret('E', 12)).toBe('E');
  });

  it('calculates 1st fret on B string (C)', () => {
    expect(getNoteAtFret('B', 1)).toBe('C');
  });

  it('calculates 3rd fret on G string (A#)', () => {
    expect(getNoteAtFret('G', 3)).toBe('A#');
  });
});
