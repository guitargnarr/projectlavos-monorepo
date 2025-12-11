/**
 * Guitar Theory Engine - Jest Test Suite
 *
 * Mirrors Python validate_midi.py tests to ensure JS port stays in sync.
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest';
import {
  NOTE_NAMES,
  SCALES,
  GuitarTheory,
  TabGenerator,
  generateTab,
  getScaleInfo,
} from './guitarTheory';

// TabPlayer MIDI mapping (must match TabPlayer.jsx line 12)
const TABPLAYER_MIDI = [64, 59, 55, 50, 45, 40];

// Parse tab like TabPlayer does
function parseTabLikeTabPlayer(tabString) {
  const lines = tabString.split('\n');
  const cleanedLines = lines.map(line => line.substring(2));
  const data = [];

  const stringNotes = cleanedLines.map(line => {
    const notes = [];
    let i = 0;
    while (i < line.length) {
      if (!/\d/.test(line[i])) {
        i++;
        continue;
      }
      let numStr = '';
      const startPos = i;
      while (i < line.length && /\d/.test(line[i])) {
        numStr += line[i];
        i++;
      }
      notes.push({ fret: parseInt(numStr), position: startPos });
    }
    return notes;
  });

  const allPositions = new Set();
  stringNotes.forEach(notes => {
    notes.forEach(n => allPositions.add(n.position));
  });
  const sortedPositions = Array.from(allPositions).sort((a, b) => a - b);

  for (const pos of sortedPositions) {
    const column = { notes: [] };
    for (let string = 0; string < 6; string++) {
      const note = stringNotes[string].find(n => n.position === pos);
      if (note) {
        column.notes.push({ string, fret: note.fret });
      }
    }
    if (column.notes.length > 0) {
      data.push(column);
    }
  }

  return data;
}

// Calculate MIDI sequence from parsed tab
function calculateMidiSequence(columns) {
  const midiNotes = [];
  for (const col of columns) {
    for (const note of col.notes) {
      const midi = TABPLAYER_MIDI[note.string] + note.fret;
      midiNotes.push(midi);
    }
  }
  return midiNotes;
}

// Get scale chromatic offsets
function getScaleOffsets(root, scale) {
  const rootIndex = NOTE_NAMES.indexOf(root);
  const intervals = SCALES[scale];
  return intervals.map(interval => (rootIndex + interval) % 12);
}

// Validate MIDI notes are in scale
function validateMidiInScale(midiNotes, root, scale) {
  const scaleOffsets = getScaleOffsets(root, scale);
  const errors = [];

  for (const midi of midiNotes) {
    const noteOffset = midi % 12;
    if (!scaleOffsets.includes(noteOffset)) {
      const noteName = NOTE_NAMES[noteOffset];
      errors.push(`MIDI ${midi} (${noteName}) not in ${root} ${scale}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

describe('GuitarTheory', () => {
  describe('getNoteAtFret', () => {
    it('returns correct note for open strings', () => {
      const theory = new GuitarTheory();
      expect(theory.getNoteAtFret(0, 0)).toBe('E'); // Low E
      expect(theory.getNoteAtFret(1, 0)).toBe('A');
      expect(theory.getNoteAtFret(2, 0)).toBe('D');
      expect(theory.getNoteAtFret(3, 0)).toBe('G');
      expect(theory.getNoteAtFret(4, 0)).toBe('B');
      expect(theory.getNoteAtFret(5, 0)).toBe('E'); // High e
    });

    it('returns correct note for fretted positions', () => {
      const theory = new GuitarTheory();
      expect(theory.getNoteAtFret(0, 5)).toBe('A'); // Low E + 5 = A
      expect(theory.getNoteAtFret(0, 12)).toBe('E'); // Octave
      expect(theory.getNoteAtFret(5, 1)).toBe('F'); // High e + 1 = F
    });
  });

  describe('getScaleNotes', () => {
    it('returns correct E Phrygian notes', () => {
      const theory = new GuitarTheory();
      const notes = theory.getScaleNotes('E', 'phrygian');
      expect(notes).toEqual(['E', 'F', 'G', 'A', 'B', 'C', 'D']);
    });

    it('returns correct A minor notes', () => {
      const theory = new GuitarTheory();
      const notes = theory.getScaleNotes('A', 'minor');
      expect(notes).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    it('returns correct C major notes', () => {
      const theory = new GuitarTheory();
      const notes = theory.getScaleNotes('C', 'major');
      expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });
  });

  describe('getMidiNote', () => {
    it('returns correct MIDI for open strings', () => {
      const theory = new GuitarTheory();
      expect(theory.getMidiNote(0, 0)).toBe(40); // Low E = E2
      expect(theory.getMidiNote(5, 0)).toBe(64); // High e = E4
    });

    it('returns correct MIDI for fretted notes', () => {
      const theory = new GuitarTheory();
      expect(theory.getMidiNote(0, 5)).toBe(45); // A2
      expect(theory.getMidiNote(0, 12)).toBe(52); // E3
    });
  });
});

describe('TabGenerator', () => {
  describe('generateAscending', () => {
    it('produces valid E Phrygian ascending tab', () => {
      const tab = generateTab('E', 'phrygian', 'ascending', 2, 1);
      expect(tab).toContain('e|');
      expect(tab).toContain('E|');
      expect(tab.split('\n').length).toBe(6);
    });
  });

  describe('generate3nps', () => {
    it('throws error for 5-note scales', () => {
      const generator = new TabGenerator();
      expect(() => {
        generator.generate3nps('A', 'pentatonic_minor', 1, 2);
      }).toThrow('3NPS requires 7-note scales');
    });

    it('works for 7-note scales', () => {
      const generator = new TabGenerator();
      const columns = generator.generate3nps('E', 'phrygian', 1, 2);
      expect(columns.length).toBeGreaterThan(0);
    });
  });
});

describe('MIDI Validation', () => {
  const ROOTS = ['E', 'A', 'D', 'G', 'C'];
  const PATTERNS = ['ascending', 'descending', 'pedal', 'arpeggio', 'random'];
  const POSITIONS = [1, 2, 3];

  // Test a subset of scales
  const TEST_SCALES = ['major', 'minor', 'phrygian', 'pentatonic_minor', 'blues'];

  describe('All notes must be in scale', () => {
    for (const scale of TEST_SCALES) {
      describe(`${scale} scale`, () => {
        for (const root of ROOTS.slice(0, 2)) { // Just E and A for speed
          for (const pattern of PATTERNS) {
            // Skip 3nps for non-7-note scales
            if (pattern === '3nps' && SCALES[scale].length !== 7) continue;

            for (const position of POSITIONS.slice(0, 2)) { // Just 1 and 2 for speed
              it(`${root} ${scale} ${pattern} position ${position}`, () => {
                const tab = generateTab(root, scale, pattern, 2, position);
                const columns = parseTabLikeTabPlayer(tab);
                const midiNotes = calculateMidiSequence(columns);
                const { valid, errors } = validateMidiInScale(midiNotes, root, scale);

                expect(valid).toBe(true);
                if (!valid) {
                  console.log('MIDI errors:', errors);
                }
              });
            }
          }
        }
      });
    }
  });

  describe('E Phrygian specific tests', () => {
    it('ascending produces E-F-G-A-B-C-D sequence', () => {
      const tab = generateTab('E', 'phrygian', 'ascending', 2, 1);
      const columns = parseTabLikeTabPlayer(tab);
      const midiNotes = calculateMidiSequence(columns);

      // First 7 notes should be E Phrygian ascending
      const expectedOffsets = [4, 5, 7, 9, 11, 0, 2]; // E, F, G, A, B, C, D
      const actualOffsets = midiNotes.slice(0, 7).map(m => m % 12);

      expect(actualOffsets).toEqual(expectedOffsets);
    });

    it('detects wrong notes (injection test)', () => {
      const fakeMidi = [40, 41, 42, 43]; // E, F, F#, G - F# is wrong
      const { valid, errors } = validateMidiInScale(fakeMidi, 'E', 'phrygian');

      expect(valid).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('F#');
    });
  });
});

describe('getScaleInfo', () => {
  it('returns correct info for E Phrygian', () => {
    const info = getScaleInfo('E', 'phrygian');
    expect(info.name).toBe('E phrygian');
    expect(info.notes).toBe('E, F, G, A, B, C, D');
    expect(info.noteCount).toBe(7);
  });
});

describe('Tab parsing matches TabPlayer', () => {
  it('parses single-digit frets correctly', () => {
    const tab = 'e|--0---1---3--|';
    const columns = parseTabLikeTabPlayer(tab + '\nB|-------------|' + '\nG|-------------|' + '\nD|-------------|' + '\nA|-------------|' + '\nE|-------------|');

    expect(columns.length).toBe(3);
    expect(columns[0].notes[0].fret).toBe(0);
    expect(columns[1].notes[0].fret).toBe(1);
    expect(columns[2].notes[0].fret).toBe(3);
  });

  it('parses multi-digit frets correctly', () => {
    const tab = 'e|-10--12--15--|';
    const columns = parseTabLikeTabPlayer(tab + '\nB|-------------|' + '\nG|-------------|' + '\nD|-------------|' + '\nA|-------------|' + '\nE|-------------|');

    expect(columns.length).toBe(3);
    expect(columns[0].notes[0].fret).toBe(10);
    expect(columns[1].notes[0].fret).toBe(12);
    expect(columns[2].notes[0].fret).toBe(15);
  });
});
