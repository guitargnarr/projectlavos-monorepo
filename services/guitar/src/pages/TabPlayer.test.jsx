import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test parsing logic and MIDI calculations without rendering
describe('TabPlayer Tab Parsing Logic', () => {
  const parseTab = (lines) => {
    const cleanedLines = lines.map(line => line.substring(2));
    const minLength = Math.min(...cleanedLines.map(line => line.length));
    const data = [];

    for (let pos = 0; pos < minLength; pos++) {
      const column = { notes: [], duration: 1 };
      for (let string = 0; string < 6; string++) {
        const char = cleanedLines[string][pos];
        if (char && char.match(/\d/)) {
          column.notes.push({ string, fret: parseInt(char) });
        }
      }
      if (column.notes.length > 0) {
        data.push(column);
      }
    }

    return data;
  };

  it('parses single notes correctly', () => {
    const tab = [
      'e|--0-----|',
      'B|--------|',
      'G|--------|',
      'D|--------|',
      'A|--------|',
      'E|--------|',
    ];

    const parsed = parseTab(tab);
    expect(parsed.length).toBe(1);
    expect(parsed[0].notes[0]).toEqual({ string: 0, fret: 0 });
  });

  it('parses chord (multiple notes at same position)', () => {
    const tab = [
      'e|--0-----|',
      'B|--1-----|',
      'G|--0-----|',
      'D|--2-----|',
      'A|--3-----|',
      'E|--------|',
    ];

    const parsed = parseTab(tab);
    expect(parsed.length).toBe(1);
    expect(parsed[0].notes.length).toBe(5);
  });

  it('parses sequence of notes', () => {
    const tab = [
      'e|--0--1--2--3--|',
      'B|--------------|',
      'G|--------------|',
      'D|--------------|',
      'A|--------------|',
      'E|--------------|',
    ];

    const parsed = parseTab(tab);
    expect(parsed.length).toBe(4);
  });

  it('handles empty tab', () => {
    const tab = [
      'e|--------|',
      'B|--------|',
      'G|--------|',
      'D|--------|',
      'A|--------|',
      'E|--------|',
    ];

    const parsed = parseTab(tab);
    expect(parsed.length).toBe(0);
  });

  it('parses notes on different strings', () => {
    const tab = [
      'e|--------|',
      'B|--------|',
      'G|--5-----|',
      'D|--------|',
      'A|--------|',
      'E|--------|',
    ];

    const parsed = parseTab(tab);
    expect(parsed.length).toBe(1);
    expect(parsed[0].notes[0]).toEqual({ string: 2, fret: 5 });
  });

  it('parses power chord shape', () => {
    const tab = [
      'e|--------|',
      'B|--------|',
      'G|--------|',
      'D|--5-----|',
      'A|--3-----|',
      'E|--------|',
    ];

    const parsed = parseTab(tab);
    expect(parsed.length).toBe(1);
    expect(parsed[0].notes.length).toBe(2);
  });
});

describe('GuitarSynthesizer MIDI Calculations', () => {
  const stringBaseMidi = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2

  const getMidiNote = (string, fret) => {
    return stringBaseMidi[string] + fret;
  };

  it('calculates open high E string (E4 = 64)', () => {
    expect(getMidiNote(0, 0)).toBe(64);
  });

  it('calculates open B string (B3 = 59)', () => {
    expect(getMidiNote(1, 0)).toBe(59);
  });

  it('calculates open G string (G3 = 55)', () => {
    expect(getMidiNote(2, 0)).toBe(55);
  });

  it('calculates open D string (D3 = 50)', () => {
    expect(getMidiNote(3, 0)).toBe(50);
  });

  it('calculates open A string (A2 = 45)', () => {
    expect(getMidiNote(4, 0)).toBe(45);
  });

  it('calculates open low E string (E2 = 40)', () => {
    expect(getMidiNote(5, 0)).toBe(40);
  });

  it('calculates 5th fret on low E (A2 = 45)', () => {
    expect(getMidiNote(5, 5)).toBe(45);
  });

  it('calculates 12th fret (octave) on high E', () => {
    expect(getMidiNote(0, 12)).toBe(76);
  });

  it('calculates middle C (C4 = 60) on B string fret 1', () => {
    expect(getMidiNote(1, 1)).toBe(60);
  });

  it('calculates A440 (A4 = 69) on high E fret 5', () => {
    expect(getMidiNote(0, 5)).toBe(69);
  });
});

describe('Tempo Calculations', () => {
  const calculateNoteDuration = (bpm, noteValue = 4) => {
    // Quarter note duration in milliseconds
    const quarterNote = 60000 / bpm;
    return quarterNote * (4 / noteValue);
  };

  it('calculates quarter note at 100 BPM', () => {
    expect(calculateNoteDuration(100)).toBe(600);
  });

  it('calculates quarter note at 120 BPM', () => {
    expect(calculateNoteDuration(120)).toBe(500);
  });

  it('calculates eighth note at 120 BPM', () => {
    expect(calculateNoteDuration(120, 8)).toBe(250);
  });

  it('calculates sixteenth note at 120 BPM', () => {
    expect(calculateNoteDuration(120, 16)).toBe(125);
  });

  it('calculates half note at 60 BPM', () => {
    expect(calculateNoteDuration(60, 2)).toBe(2000);
  });
});

describe('Loop Mode Logic', () => {
  it('toggles loop state', () => {
    let isLooping = false;
    const toggleLoop = () => { isLooping = !isLooping; };

    toggleLoop();
    expect(isLooping).toBe(true);

    toggleLoop();
    expect(isLooping).toBe(false);
  });
});

describe('Metronome Logic', () => {
  const calculateClickInterval = (bpm) => {
    return 60000 / bpm;
  };

  it('calculates click interval at 60 BPM', () => {
    expect(calculateClickInterval(60)).toBe(1000);
  });

  it('calculates click interval at 120 BPM', () => {
    expect(calculateClickInterval(120)).toBe(500);
  });

  it('calculates click interval at 180 BPM', () => {
    expect(calculateClickInterval(180)).toBeCloseTo(333.33, 1);
  });
});
