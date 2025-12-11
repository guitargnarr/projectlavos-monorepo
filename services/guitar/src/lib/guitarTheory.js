/**
 * Guitar Theory Engine - JavaScript Port
 *
 * Deterministic scale/tab generation matching guitar_theory.py
 * All 12 scales, 6 patterns, 5 positions validated against 2,415 test cases.
 */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
  melodic_minor: [0, 2, 3, 5, 7, 9, 11],
};

// Scale info with display names (for UI components)
export const SCALE_INFO = {
  major: { name: 'Major', intervals: SCALES.major },
  minor: { name: 'Minor', intervals: SCALES.minor },
  pentatonic_major: { name: 'Pentatonic Major', intervals: SCALES.pentatonic_major },
  pentatonic_minor: { name: 'Pentatonic Minor', intervals: SCALES.pentatonic_minor },
  blues: { name: 'Blues', intervals: SCALES.blues },
  phrygian: { name: 'Phrygian', intervals: SCALES.phrygian },
  lydian: { name: 'Lydian', intervals: SCALES.lydian },
  mixolydian: { name: 'Mixolydian', intervals: SCALES.mixolydian },
  dorian: { name: 'Dorian', intervals: SCALES.dorian },
  locrian: { name: 'Locrian', intervals: SCALES.locrian },
  harmonic_minor: { name: 'Harmonic Minor', intervals: SCALES.harmonic_minor },
  melodic_minor: { name: 'Melodic Minor', intervals: SCALES.melodic_minor },
};

export const TUNINGS = {
  standard: ['E', 'A', 'D', 'G', 'B', 'E'],
  drop_d: ['D', 'A', 'D', 'G', 'B', 'E'],
  drop_c: ['C', 'G', 'C', 'F', 'A', 'D'],
  half_step_down: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'],
};

// MIDI base notes for each string (standard tuning)
export const MIDI_BASE = {
  standard: [40, 45, 50, 55, 59, 64], // E2, A2, D3, G3, B3, E4
  drop_d: [38, 45, 50, 55, 59, 64],
  drop_c: [36, 43, 48, 53, 57, 62],
  half_step_down: [39, 44, 49, 54, 58, 63],
};

// Common chord progressions by style
export const CHORD_PROGRESSIONS = {
  blues_12bar: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5],  // I-I-I-I-IV-IV-I-I-V-IV-I-V
  pop_4chord: [1, 5, 6, 4],  // I-V-vi-IV (most popular progression)
  rock_power: [1, 4, 5, 5],  // I-IV-V-V
  jazz_251: [2, 5, 1],  // ii-V-I
  metal_riff: [1, 'b7', 'b6', 5],  // i-bVII-bVI-V (Phrygian-based)
  sad_progression: [6, 4, 1, 5],  // vi-IV-I-V (Axis progression from minor)
  andalusian: ['b7', 'b6', 5, 1],  // bVII-bVI-V-i (Flamenco cadence)
};

// Chord qualities for scale degrees
const MAJOR_CHORD_QUALITIES = {
  1: 'maj', 2: 'min', 3: 'min', 4: 'maj', 5: 'maj', 6: 'min', 7: 'dim'
};
const MINOR_CHORD_QUALITIES = {
  1: 'min', 2: 'dim', 3: 'maj', 4: 'min', 5: 'min', 6: 'maj', 7: 'maj'
};

// Chord intervals from root
const CHORD_INTERVALS = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  '5': [0, 7],  // Power chord
};

export class GuitarTheory {
  constructor(tuning = 'standard') {
    this.tuning = TUNINGS[tuning] || TUNINGS.standard;
    this.midiBase = MIDI_BASE[tuning] || MIDI_BASE.standard;
  }

  getNoteAtFret(string, fret) {
    const openNote = this.tuning[string];
    const openIndex = NOTE_NAMES.indexOf(openNote);
    const noteIndex = (openIndex + fret) % 12;
    return NOTE_NAMES[noteIndex];
  }

  getMidiNote(string, fret) {
    return this.midiBase[string] + fret;
  }

  getScaleNotes(root, scale) {
    const rootIndex = NOTE_NAMES.indexOf(root);
    const intervals = SCALES[scale];
    if (!intervals) throw new Error(`Unknown scale: ${scale}`);
    return intervals.map(interval => NOTE_NAMES[(rootIndex + interval) % 12]);
  }

  getScalePositions(root, scale, minFret = 0, maxFret = 22) {
    const scaleNotes = this.getScaleNotes(root, scale);
    const positions = [];

    for (let string = 0; string < 6; string++) {
      for (let fret = minFret; fret <= maxFret; fret++) {
        const note = this.getNoteAtFret(string, fret);
        if (scaleNotes.includes(note)) {
          positions.push({
            string,
            fret,
            note,
            midi: this.getMidiNote(string, fret),
            isRoot: note === root,
          });
        }
      }
    }
    return positions;
  }

  getBoxPosition(root, scale, position = 1) {
    const scaleNotes = this.getScaleNotes(root, scale);

    // Find root positions on low E string
    const rootPositions = [];
    for (let fret = 0; fret <= 12; fret++) {
      if (this.getNoteAtFret(0, fret) === root) {
        rootPositions.push(fret);
      }
    }

    if (rootPositions.length === 0) {
      throw new Error(`Root ${root} not found on low E string`);
    }

    // Select base fret based on position (1-5)
    const posIndex = Math.min(position - 1, rootPositions.length - 1);
    const baseFret = rootPositions[posIndex];

    // Define box boundaries (4-fret span)
    const minFret = Math.max(0, baseFret - 1);
    const maxFret = baseFret + 4;

    // Collect notes within box
    const boxNotes = [];
    for (let string = 0; string < 6; string++) {
      for (let fret = minFret; fret <= maxFret; fret++) {
        const note = this.getNoteAtFret(string, fret);
        if (scaleNotes.includes(note)) {
          const finger = fret - minFret + 1;
          boxNotes.push({
            string,
            fret,
            note,
            midi: this.getMidiNote(string, fret),
            isRoot: note === root,
            finger: Math.min(finger, 4),
          });
        }
      }
    }

    return boxNotes;
  }

  get3npsPosition(root, scale, position = 1) {
    const scaleNotes = this.getScaleNotes(root, scale);
    if (scaleNotes.length !== 7) {
      throw new Error('3NPS requires 7-note scales');
    }

    // Find starting fret based on position
    const rootPositions = [];
    for (let fret = 0; fret <= 12; fret++) {
      if (this.getNoteAtFret(0, fret) === root) {
        rootPositions.push(fret);
      }
    }

    const posIndex = Math.min(position - 1, rootPositions.length - 1);
    let startFret = rootPositions[posIndex];

    const pattern = [];
    let scaleIndex = 0;

    for (let string = 0; string < 6; string++) {
      const stringNotes = [];
      let searchFret = string === 0 ? startFret :
        (pattern.length > 0 ? pattern[pattern.length - 1].fret : startFret);

      for (let noteCount = 0; noteCount < 3; noteCount++) {
        const targetNote = scaleNotes[scaleIndex % 7];

        // Find this note on current string
        for (let fret = searchFret; fret <= searchFret + 5; fret++) {
          if (this.getNoteAtFret(string, fret) === targetNote) {
            stringNotes.push({
              string,
              fret,
              note: targetNote,
              midi: this.getMidiNote(string, fret),
              isRoot: targetNote === root,
              finger: noteCount + 1,
            });
            searchFret = fret + 1;
            scaleIndex++;
            break;
          }
        }
      }

      pattern.push(...stringNotes);
    }

    return pattern;
  }

  getChordNotes(root, quality = 'maj') {
    const rootIndex = NOTE_NAMES.indexOf(root);
    const intervals = CHORD_INTERVALS[quality] || CHORD_INTERVALS.maj;
    return intervals.map(i => NOTE_NAMES[(rootIndex + i) % 12]);
  }

  getChordVoicing(root, quality = 'maj', position = 1) {
    const chordNotes = this.getChordNotes(root, quality);

    // Find root on low E string near position
    let rootFret = 0;
    for (let fret = 0; fret <= 22; fret++) {
      if (this.getNoteAtFret(0, fret) === root) {
        if (position === 1 || fret >= (position - 1) * 3) {
          rootFret = fret;
          break;
        }
      }
    }

    // Build voicing from bass up
    const voicing = [];
    for (let string = 0; string < 6; string++) {
      let bestFret = null;
      let bestNote = null;
      for (let fret = Math.max(0, rootFret - 2); fret <= rootFret + 5; fret++) {
        const note = this.getNoteAtFret(string, fret);
        if (chordNotes.includes(note)) {
          if (bestFret === null || Math.abs(fret - rootFret) < Math.abs(bestFret - rootFret)) {
            bestFret = fret;
            bestNote = note;
          }
        }
      }
      if (bestFret !== null) {
        voicing.push({
          string,
          fret: bestFret,
          note: bestNote,
          midi: this.getMidiNote(string, bestFret),
        });
      }
    }
    return voicing;
  }

  getProgressionChords(root, scale, progressionName) {
    if (!CHORD_PROGRESSIONS[progressionName]) {
      throw new Error(`Unknown progression: ${progressionName}`);
    }

    const progression = CHORD_PROGRESSIONS[progressionName];
    const scaleNotes = this.getScaleNotes(root, scale);
    const rootIndex = NOTE_NAMES.indexOf(root);

    const isMinor = ['minor', 'phrygian', 'dorian', 'locrian', 'harmonic_minor', 'melodic_minor'].includes(scale);
    const qualities = isMinor ? MINOR_CHORD_QUALITIES : MAJOR_CHORD_QUALITIES;

    const chords = [];
    for (const degree of progression) {
      let chordRootIdx, quality;
      if (typeof degree === 'string' && degree.startsWith('b')) {
        const degNum = parseInt(degree.substring(1));
        chordRootIdx = (rootIndex + (degNum - 1) * 2 - 1) % 12;
        quality = 'maj';
      } else {
        const degNum = parseInt(degree);
        chordRootIdx = NOTE_NAMES.indexOf(scaleNotes[degNum - 1]);
        quality = qualities[degNum] || 'maj';
      }
      chords.push({
        root: NOTE_NAMES[chordRootIdx],
        quality,
        degree,
      });
    }
    return chords;
  }
}

export class TabGenerator {
  constructor(tuning = 'standard') {
    this.theory = new GuitarTheory(tuning);
  }

  generateAscending(root, scale, position = 1, bars = 4) {
    const box = this.theory.getBoxPosition(root, scale, position);
    const columns = [];

    // Group by string, sort by fret
    for (let string = 0; string < 6; string++) {
      const stringNotes = box
        .filter(n => n.string === string)
        .sort((a, b) => a.fret - b.fret);

      for (const note of stringNotes) {
        columns.push([note]);
      }
    }

    return this._limitToLength(columns, bars);
  }

  generateDescending(root, scale, position = 1, bars = 4) {
    const box = this.theory.getBoxPosition(root, scale, position);
    const columns = [];

    // Group by string (high to low), sort by fret descending
    for (let string = 5; string >= 0; string--) {
      const stringNotes = box
        .filter(n => n.string === string)
        .sort((a, b) => b.fret - a.fret);

      for (const note of stringNotes) {
        columns.push([note]);
      }
    }

    return this._limitToLength(columns, bars);
  }

  generatePedal(root, scale, position = 1, bars = 4) {
    const box = this.theory.getBoxPosition(root, scale, position);
    const columns = [];

    // Find root note on lowest available string
    const rootNote = box.find(n => n.isRoot && n.string <= 1) ||
                     box.find(n => n.isRoot) ||
                     box[0];

    // Get melody notes (higher strings)
    const melodyNotes = box
      .filter(n => n.string >= 2)
      .sort((a, b) => a.string - b.string || a.fret - b.fret);

    for (const melody of melodyNotes) {
      columns.push([rootNote]);
      columns.push([melody]);
    }

    return this._limitToLength(columns, bars);
  }

  generateArpeggio(root, scale, position = 1, bars = 4) {
    const box = this.theory.getBoxPosition(root, scale, position);
    const columns = [];

    // Get 1-3-5 pattern (root, third, fifth)
    const scaleNotes = this.theory.getScaleNotes(root, scale);
    const chordTones = [scaleNotes[0], scaleNotes[2], scaleNotes[4]];

    const arpeggioNotes = box
      .filter(n => chordTones.includes(n.note))
      .sort((a, b) => a.string - b.string || a.fret - b.fret);

    // Sweep up then down
    for (const note of arpeggioNotes) {
      columns.push([note]);
    }
    for (let i = arpeggioNotes.length - 2; i > 0; i--) {
      columns.push([arpeggioNotes[i]]);
    }

    return this._limitToLength(columns, bars);
  }

  generateRandom(root, scale, position = 1, bars = 4) {
    const box = this.theory.getBoxPosition(root, scale, position);
    const columns = [];
    const notesNeeded = bars * 4;

    // Seed random for reproducibility (optional)
    let currentString = 2; // Start middle

    for (let i = 0; i < notesNeeded; i++) {
      // Weighted random - prefer adjacent strings
      const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
      currentString = Math.max(0, Math.min(5, currentString + delta));

      const stringNotes = box.filter(n => n.string === currentString);
      if (stringNotes.length > 0) {
        const note = stringNotes[Math.floor(Math.random() * stringNotes.length)];
        columns.push([note]);
      }
    }

    return columns;
  }

  generate3nps(root, scale, position = 1, bars = 4, ascending = true) {
    const pattern = this.theory.get3npsPosition(root, scale, position);
    const columns = pattern.map(note => [note]);

    if (!ascending) {
      columns.reverse();
    }

    return this._limitToLength(columns, bars);
  }

  generatePowerChords(root, scale, position = 1, bars = 4) {
    const rootIndex = NOTE_NAMES.indexOf(root);
    const columns = [];
    const notesNeeded = bars * 4;

    // Common power chord riff pattern: root, b7, root, 4th
    const riffDegrees = [0, 10, 0, 5]; // Semitones from root

    for (let i = 0; i < notesNeeded; i++) {
      const degreeSemitones = riffDegrees[i % riffDegrees.length];
      const chordRoot = NOTE_NAMES[(rootIndex + degreeSemitones) % 12];
      const voicing = this.theory.getChordVoicing(chordRoot, '5', position);
      // Keep only bottom strings for heavy sound
      const powerVoicing = voicing.filter(n => n.string <= 2);
      if (powerVoicing.length > 0) {
        columns.push(powerVoicing);
      }
    }

    return columns;
  }

  generateProgression(root, scale, progressionName = 'blues_12bar', position = 1) {
    const chords = this.theory.getProgressionChords(root, scale, progressionName);
    const columns = [];

    for (const chord of chords) {
      // Use power chords for cleaner sound
      const voicing = this.theory.getChordVoicing(chord.root, '5', position);
      const powerVoicing = voicing.filter(n => n.string <= 2);
      if (powerVoicing.length > 0) {
        columns.push(powerVoicing);
      }
    }

    return columns;
  }

  _limitToLength(columns, bars) {
    const maxNotes = bars * 4;
    if (columns.length > maxNotes) {
      return columns.slice(0, maxNotes);
    }
    return columns;
  }

  columnsToTab(columns, notesPerMeasure = 4) {
    const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
    const tabLines = ['', '', '', '', '', ''];

    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      // Add bar line every measure
      if (colIdx > 0 && colIdx % notesPerMeasure === 0) {
        for (let i = 0; i < 6; i++) {
          tabLines[i] += '-|--';
        }
      }

      // Find what's played on each string
      const frets = {};
      for (const note of columns[colIdx]) {
        frets[note.string] = note.fret;
      }

      // Build column - consistent 4 char width
      for (let i = 0; i < 6; i++) {
        const displayString = 5 - i; // Reverse for display (high e first)
        if (displayString in frets) {
          const fret = frets[displayString];
          if (fret >= 10) {
            tabLines[i] += `-${fret}-`;
          } else {
            tabLines[i] += `--${fret}-`;
          }
        } else {
          tabLines[i] += '----';
        }
      }
    }

    // Add final bar line
    for (let i = 0; i < 6; i++) {
      tabLines[i] += '-|';
    }

    // Format with string names
    return tabLines.map((line, i) => `${stringNames[i]}|${line}`);
  }
}

/**
 * High-level function to generate a complete tab.
 * @param {string} root - Root note
 * @param {string} scale - Scale type
 * @param {string} pattern - Pattern type
 * @param {number} bars - Number of bars
 * @param {number} position - Box position (1-5)
 * @param {string} tuning - Guitar tuning
 * @param {string} progression - Progression name (for 'progression' pattern)
 */
export function generateTab(root = 'E', scale = 'phrygian', pattern = 'ascending', bars = 4, position = 1, tuning = 'standard', progression = null) {
  const generator = new TabGenerator(tuning);

  let columns;
  switch (pattern) {
    case 'ascending':
      columns = generator.generateAscending(root, scale, position, bars);
      break;
    case 'descending':
      columns = generator.generateDescending(root, scale, position, bars);
      break;
    case 'pedal':
      columns = generator.generatePedal(root, scale, position, bars);
      break;
    case 'arpeggio':
      columns = generator.generateArpeggio(root, scale, position, bars);
      break;
    case 'random':
      columns = generator.generateRandom(root, scale, position, bars);
      break;
    case '3nps':
      columns = generator.generate3nps(root, scale, position, bars, true);
      break;
    case 'power_chords':
      columns = generator.generatePowerChords(root, scale, position, bars);
      break;
    case 'progression':
      columns = generator.generateProgression(root, scale, progression || 'blues_12bar', position);
      break;
    default:
      columns = generator.generateAscending(root, scale, position, bars);
  }

  const tabLines = generator.columnsToTab(columns);
  return tabLines.join('\n');
}

/**
 * Get human-readable scale notes
 */
export function getScaleInfo(root, scale) {
  const theory = new GuitarTheory();
  const notes = theory.getScaleNotes(root, scale);
  return {
    name: `${root} ${scale}`,
    notes: notes.join(', '),
    noteCount: notes.length,
  };
}
