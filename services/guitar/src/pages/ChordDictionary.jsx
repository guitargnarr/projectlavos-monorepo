import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Chord data structure:
 * - name: Chord name (e.g., "C Major")
 * - fingers: Array of 6 elements (one per string, low E to high E)
 *   - -1 = don't play (muted)
 *   - 0 = open string
 *   - 1-12 = fret number
 * - fingering: Optional array showing which finger to use (1=index, 2=middle, 3=ring, 4=pinky)
 * - notes: Array of note names played (for audio playback)
 */
const CHORD_DATA = [
  // ===== MAJOR CHORDS =====
  { name: 'C Major', short: 'C', fingers: [-1, 3, 2, 0, 1, 0], fingering: [0, 3, 2, 0, 1, 0], notes: ['C', 'E', 'G', 'C', 'E'], category: 'major' },
  { name: 'D Major', short: 'D', fingers: [-1, -1, 0, 2, 3, 2], fingering: [0, 0, 0, 1, 3, 2], notes: ['D', 'A', 'D', 'F#'], category: 'major' },
  { name: 'E Major', short: 'E', fingers: [0, 2, 2, 1, 0, 0], fingering: [0, 2, 3, 1, 0, 0], notes: ['E', 'B', 'E', 'G#', 'B', 'E'], category: 'major' },
  { name: 'F Major', short: 'F', fingers: [1, 3, 3, 2, 1, 1], fingering: [1, 3, 4, 2, 1, 1], notes: ['F', 'A', 'C', 'F', 'A', 'F'], category: 'major' },
  { name: 'G Major', short: 'G', fingers: [3, 2, 0, 0, 0, 3], fingering: [3, 2, 0, 0, 0, 4], notes: ['G', 'B', 'D', 'G', 'B', 'G'], category: 'major' },
  { name: 'A Major', short: 'A', fingers: [-1, 0, 2, 2, 2, 0], fingering: [0, 0, 1, 2, 3, 0], notes: ['A', 'E', 'A', 'C#', 'E'], category: 'major' },
  { name: 'B Major', short: 'B', fingers: [-1, 2, 4, 4, 4, 2], fingering: [0, 1, 3, 3, 3, 1], notes: ['B', 'F#', 'B', 'D#', 'F#'], category: 'major' },

  // ===== MINOR CHORDS =====
  { name: 'C Minor', short: 'Cm', fingers: [-1, 3, 5, 5, 4, 3], fingering: [0, 1, 3, 4, 2, 1], notes: ['C', 'G', 'C', 'Eb', 'G'], category: 'minor' },
  { name: 'D Minor', short: 'Dm', fingers: [-1, -1, 0, 2, 3, 1], fingering: [0, 0, 0, 2, 3, 1], notes: ['D', 'A', 'D', 'F'], category: 'minor' },
  { name: 'E Minor', short: 'Em', fingers: [0, 2, 2, 0, 0, 0], fingering: [0, 2, 3, 0, 0, 0], notes: ['E', 'B', 'E', 'G', 'B', 'E'], category: 'minor' },
  { name: 'F Minor', short: 'Fm', fingers: [1, 3, 3, 1, 1, 1], fingering: [1, 3, 4, 1, 1, 1], notes: ['F', 'Ab', 'C', 'F', 'Ab', 'F'], category: 'minor' },
  { name: 'G Minor', short: 'Gm', fingers: [3, 5, 5, 3, 3, 3], fingering: [1, 3, 4, 1, 1, 1], notes: ['G', 'Bb', 'D', 'G', 'Bb', 'G'], category: 'minor' },
  { name: 'A Minor', short: 'Am', fingers: [-1, 0, 2, 2, 1, 0], fingering: [0, 0, 2, 3, 1, 0], notes: ['A', 'E', 'A', 'C', 'E'], category: 'minor' },
  { name: 'B Minor', short: 'Bm', fingers: [-1, 2, 4, 4, 3, 2], fingering: [0, 1, 3, 4, 2, 1], notes: ['B', 'F#', 'B', 'D', 'F#'], category: 'minor' },

  // ===== MAJOR 7TH CHORDS =====
  { name: 'C Major 7', short: 'Cmaj7', fingers: [-1, 3, 2, 0, 0, 0], fingering: [0, 3, 2, 0, 0, 0], notes: ['C', 'E', 'G', 'B', 'E'], category: 'maj7' },
  { name: 'D Major 7', short: 'Dmaj7', fingers: [-1, -1, 0, 2, 2, 2], fingering: [0, 0, 0, 1, 1, 1], notes: ['D', 'A', 'D', 'F#', 'A', 'C#'], category: 'maj7' },
  { name: 'E Major 7', short: 'Emaj7', fingers: [0, 2, 1, 1, 0, 0], fingering: [0, 3, 1, 2, 0, 0], notes: ['E', 'B', 'D#', 'G#', 'B', 'E'], category: 'maj7' },
  { name: 'F Major 7', short: 'Fmaj7', fingers: [-1, -1, 3, 2, 1, 0], fingering: [0, 0, 3, 2, 1, 0], notes: ['F', 'A', 'C', 'E'], category: 'maj7' },
  { name: 'G Major 7', short: 'Gmaj7', fingers: [3, 2, 0, 0, 0, 2], fingering: [3, 2, 0, 0, 0, 1], notes: ['G', 'B', 'D', 'G', 'B', 'F#'], category: 'maj7' },
  { name: 'A Major 7', short: 'Amaj7', fingers: [-1, 0, 2, 1, 2, 0], fingering: [0, 0, 2, 1, 3, 0], notes: ['A', 'E', 'G#', 'C#', 'E'], category: 'maj7' },
  { name: 'B Major 7', short: 'Bmaj7', fingers: [-1, 2, 4, 3, 4, 2], fingering: [0, 1, 3, 2, 4, 1], notes: ['B', 'F#', 'A#', 'D#', 'F#'], category: 'maj7' },

  // ===== MINOR 7TH CHORDS =====
  { name: 'C Minor 7', short: 'Cm7', fingers: [-1, 3, 5, 3, 4, 3], fingering: [0, 1, 3, 1, 2, 1], notes: ['C', 'G', 'Bb', 'Eb', 'G'], category: 'min7' },
  { name: 'D Minor 7', short: 'Dm7', fingers: [-1, -1, 0, 2, 1, 1], fingering: [0, 0, 0, 2, 1, 1], notes: ['D', 'A', 'C', 'F'], category: 'min7' },
  { name: 'E Minor 7', short: 'Em7', fingers: [0, 2, 0, 0, 0, 0], fingering: [0, 2, 0, 0, 0, 0], notes: ['E', 'B', 'D', 'G', 'B', 'E'], category: 'min7' },
  { name: 'F Minor 7', short: 'Fm7', fingers: [1, 3, 1, 1, 1, 1], fingering: [1, 3, 1, 1, 1, 1], notes: ['F', 'Ab', 'Eb', 'Ab', 'C', 'F'], category: 'min7' },
  { name: 'G Minor 7', short: 'Gm7', fingers: [3, 5, 3, 3, 3, 3], fingering: [1, 3, 1, 1, 1, 1], notes: ['G', 'Bb', 'F', 'Bb', 'D', 'G'], category: 'min7' },
  { name: 'A Minor 7', short: 'Am7', fingers: [-1, 0, 2, 0, 1, 0], fingering: [0, 0, 2, 0, 1, 0], notes: ['A', 'E', 'G', 'C', 'E'], category: 'min7' },
  { name: 'B Minor 7', short: 'Bm7', fingers: [-1, 2, 0, 2, 0, 2], fingering: [0, 1, 0, 2, 0, 3], notes: ['B', 'F#', 'A', 'D', 'F#'], category: 'min7' },

  // ===== DOMINANT 7TH CHORDS =====
  { name: 'C Dominant 7', short: 'C7', fingers: [-1, 3, 2, 3, 1, 0], fingering: [0, 3, 2, 4, 1, 0], notes: ['C', 'E', 'Bb', 'C', 'E'], category: 'dom7' },
  { name: 'D Dominant 7', short: 'D7', fingers: [-1, -1, 0, 2, 1, 2], fingering: [0, 0, 0, 2, 1, 3], notes: ['D', 'A', 'C', 'F#'], category: 'dom7' },
  { name: 'E Dominant 7', short: 'E7', fingers: [0, 2, 0, 1, 0, 0], fingering: [0, 2, 0, 1, 0, 0], notes: ['E', 'B', 'D', 'G#', 'B', 'E'], category: 'dom7' },
  { name: 'F Dominant 7', short: 'F7', fingers: [1, 3, 1, 2, 1, 1], fingering: [1, 3, 1, 2, 1, 1], notes: ['F', 'A', 'Eb', 'A', 'C', 'F'], category: 'dom7' },
  { name: 'G Dominant 7', short: 'G7', fingers: [3, 2, 0, 0, 0, 1], fingering: [3, 2, 0, 0, 0, 1], notes: ['G', 'B', 'D', 'G', 'B', 'F'], category: 'dom7' },
  { name: 'A Dominant 7', short: 'A7', fingers: [-1, 0, 2, 0, 2, 0], fingering: [0, 0, 1, 0, 2, 0], notes: ['A', 'E', 'G', 'C#', 'E'], category: 'dom7' },
  { name: 'B Dominant 7', short: 'B7', fingers: [-1, 2, 1, 2, 0, 2], fingering: [0, 2, 1, 3, 0, 4], notes: ['B', 'D#', 'A', 'B', 'F#'], category: 'dom7' },

  // ===== SUS2 CHORDS =====
  { name: 'C Sus2', short: 'Csus2', fingers: [-1, 3, 0, 0, 1, 3], fingering: [0, 2, 0, 0, 1, 3], notes: ['C', 'G', 'C', 'D', 'G'], category: 'sus' },
  { name: 'D Sus2', short: 'Dsus2', fingers: [-1, -1, 0, 2, 3, 0], fingering: [0, 0, 0, 1, 2, 0], notes: ['D', 'A', 'D', 'E'], category: 'sus' },
  { name: 'E Sus2', short: 'Esus2', fingers: [0, 2, 4, 4, 0, 0], fingering: [0, 1, 3, 4, 0, 0], notes: ['E', 'B', 'E', 'F#', 'B', 'E'], category: 'sus' },
  { name: 'G Sus2', short: 'Gsus2', fingers: [3, 0, 0, 0, 3, 3], fingering: [1, 0, 0, 0, 3, 4], notes: ['G', 'D', 'G', 'A', 'D', 'G'], category: 'sus' },
  { name: 'A Sus2', short: 'Asus2', fingers: [-1, 0, 2, 2, 0, 0], fingering: [0, 0, 1, 2, 0, 0], notes: ['A', 'E', 'A', 'B', 'E'], category: 'sus' },

  // ===== SUS4 CHORDS =====
  { name: 'C Sus4', short: 'Csus4', fingers: [-1, 3, 3, 0, 1, 1], fingering: [0, 3, 4, 0, 1, 1], notes: ['C', 'G', 'C', 'F', 'G'], category: 'sus' },
  { name: 'D Sus4', short: 'Dsus4', fingers: [-1, -1, 0, 2, 3, 3], fingering: [0, 0, 0, 1, 2, 3], notes: ['D', 'A', 'D', 'G'], category: 'sus' },
  { name: 'E Sus4', short: 'Esus4', fingers: [0, 2, 2, 2, 0, 0], fingering: [0, 2, 3, 4, 0, 0], notes: ['E', 'B', 'E', 'A', 'B', 'E'], category: 'sus' },
  { name: 'G Sus4', short: 'Gsus4', fingers: [3, 3, 0, 0, 1, 3], fingering: [2, 3, 0, 0, 1, 4], notes: ['G', 'C', 'D', 'G', 'C', 'G'], category: 'sus' },
  { name: 'A Sus4', short: 'Asus4', fingers: [-1, 0, 2, 2, 3, 0], fingering: [0, 0, 1, 2, 3, 0], notes: ['A', 'E', 'A', 'D', 'E'], category: 'sus' },

  // ===== ADD9 CHORDS =====
  { name: 'C Add9', short: 'Cadd9', fingers: [-1, 3, 2, 0, 3, 0], fingering: [0, 2, 1, 0, 3, 0], notes: ['C', 'E', 'G', 'D', 'E'], category: 'add9' },
  { name: 'D Add9', short: 'Dadd9', fingers: [-1, -1, 0, 2, 3, 0], fingering: [0, 0, 0, 1, 2, 0], notes: ['D', 'A', 'D', 'E'], category: 'add9' },
  { name: 'E Add9', short: 'Eadd9', fingers: [0, 2, 2, 1, 0, 2], fingering: [0, 2, 3, 1, 0, 4], notes: ['E', 'B', 'E', 'G#', 'B', 'F#'], category: 'add9' },
  { name: 'G Add9', short: 'Gadd9', fingers: [3, 0, 0, 2, 0, 3], fingering: [2, 0, 0, 1, 0, 3], notes: ['G', 'D', 'G', 'A', 'B', 'G'], category: 'add9' },
  { name: 'A Add9', short: 'Aadd9', fingers: [-1, 0, 2, 4, 2, 0], fingering: [0, 0, 1, 3, 2, 0], notes: ['A', 'E', 'A', 'B', 'E'], category: 'add9' },

  // ===== POWER CHORDS =====
  { name: 'C Power', short: 'C5', fingers: [-1, 3, 5, 5, -1, -1], fingering: [0, 1, 3, 4, 0, 0], notes: ['C', 'G', 'C'], category: 'power' },
  { name: 'D Power', short: 'D5', fingers: [-1, -1, 0, 2, 3, -1], fingering: [0, 0, 0, 1, 2, 0], notes: ['D', 'A', 'D'], category: 'power' },
  { name: 'E Power', short: 'E5', fingers: [0, 2, 2, -1, -1, -1], fingering: [0, 1, 2, 0, 0, 0], notes: ['E', 'B', 'E'], category: 'power' },
  { name: 'F Power', short: 'F5', fingers: [1, 3, 3, -1, -1, -1], fingering: [1, 3, 4, 0, 0, 0], notes: ['F', 'C', 'F'], category: 'power' },
  { name: 'G Power', short: 'G5', fingers: [3, 5, 5, -1, -1, -1], fingering: [1, 3, 4, 0, 0, 0], notes: ['G', 'D', 'G'], category: 'power' },
  { name: 'A Power', short: 'A5', fingers: [-1, 0, 2, 2, -1, -1], fingering: [0, 0, 1, 2, 0, 0], notes: ['A', 'E', 'A'], category: 'power' },
  { name: 'B Power', short: 'B5', fingers: [-1, 2, 4, 4, -1, -1], fingering: [0, 1, 3, 4, 0, 0], notes: ['B', 'F#', 'B'], category: 'power' },

  // ===== DIMINISHED CHORDS =====
  { name: 'C Diminished', short: 'Cdim', fingers: [-1, 3, 4, 2, 4, -1], fingering: [0, 2, 3, 1, 4, 0], notes: ['C', 'Gb', 'Bb', 'Eb'], category: 'dim' },
  { name: 'D Diminished', short: 'Ddim', fingers: [-1, -1, 0, 1, 3, 1], fingering: [0, 0, 0, 1, 3, 2], notes: ['D', 'Ab', 'D', 'F'], category: 'dim' },
  { name: 'E Diminished', short: 'Edim', fingers: [0, 1, 2, 0, 2, 0], fingering: [0, 1, 2, 0, 3, 0], notes: ['E', 'Bb', 'E', 'G', 'Bb', 'E'], category: 'dim' },
  { name: 'G Diminished', short: 'Gdim', fingers: [3, 4, 5, 3, -1, -1], fingering: [1, 2, 3, 1, 0, 0], notes: ['G', 'Db', 'F', 'Bb'], category: 'dim' },
  { name: 'A Diminished', short: 'Adim', fingers: [-1, 0, 1, 2, 1, -1], fingering: [0, 0, 1, 3, 2, 0], notes: ['A', 'Eb', 'G', 'C'], category: 'dim' },
  { name: 'B Diminished', short: 'Bdim', fingers: [-1, 2, 3, 4, 3, -1], fingering: [0, 1, 2, 4, 3, 0], notes: ['B', 'F', 'A', 'D'], category: 'dim' },

  // ===== AUGMENTED CHORDS =====
  { name: 'C Augmented', short: 'Caug', fingers: [-1, 3, 2, 1, 1, 0], fingering: [0, 4, 3, 1, 2, 0], notes: ['C', 'E', 'G#', 'C', 'E'], category: 'aug' },
  { name: 'D Augmented', short: 'Daug', fingers: [-1, -1, 0, 3, 3, 2], fingering: [0, 0, 0, 2, 3, 1], notes: ['D', 'A#', 'D', 'F#'], category: 'aug' },
  { name: 'E Augmented', short: 'Eaug', fingers: [0, 3, 2, 1, 1, 0], fingering: [0, 4, 3, 1, 2, 0], notes: ['E', 'C', 'E', 'G#', 'C', 'E'], category: 'aug' },
  { name: 'G Augmented', short: 'Gaug', fingers: [3, 2, 1, 0, 0, 3], fingering: [3, 2, 1, 0, 0, 4], notes: ['G', 'B', 'D#', 'G', 'B', 'G'], category: 'aug' },
  { name: 'A Augmented', short: 'Aaug', fingers: [-1, 0, 3, 2, 2, 1], fingering: [0, 0, 4, 2, 3, 1], notes: ['A', 'F', 'A', 'C#', 'F'], category: 'aug' },

  // ===== 9TH CHORDS =====
  { name: 'C9', short: 'C9', fingers: [-1, 3, 2, 3, 3, 3], fingering: [0, 2, 1, 3, 3, 4], notes: ['C', 'E', 'Bb', 'D', 'E'], category: '9th' },
  { name: 'D9', short: 'D9', fingers: [-1, -1, 0, 2, 1, 0], fingering: [0, 0, 0, 2, 1, 0], notes: ['D', 'A', 'C', 'E'], category: '9th' },
  { name: 'E9', short: 'E9', fingers: [0, 2, 0, 1, 0, 2], fingering: [0, 2, 0, 1, 0, 3], notes: ['E', 'B', 'D', 'G#', 'B', 'F#'], category: '9th' },
  { name: 'G9', short: 'G9', fingers: [3, 0, 0, 2, 0, 1], fingering: [3, 0, 0, 2, 0, 1], notes: ['G', 'D', 'G', 'A', 'B', 'F'], category: '9th' },
  { name: 'A9', short: 'A9', fingers: [-1, 0, 2, 4, 2, 3], fingering: [0, 0, 1, 3, 1, 2], notes: ['A', 'E', 'G', 'B', 'E'], category: '9th' },

  // ===== MINOR 9TH CHORDS =====
  { name: 'A Minor 9', short: 'Am9', fingers: [-1, 0, 2, 4, 1, 0], fingering: [0, 0, 1, 3, 2, 0], notes: ['A', 'E', 'G', 'B', 'C'], category: 'min9' },
  { name: 'D Minor 9', short: 'Dm9', fingers: [-1, -1, 0, 2, 1, 0], fingering: [0, 0, 0, 2, 1, 0], notes: ['D', 'A', 'C', 'E', 'F'], category: 'min9' },
  { name: 'E Minor 9', short: 'Em9', fingers: [0, 2, 0, 0, 0, 2], fingering: [0, 1, 0, 0, 0, 2], notes: ['E', 'B', 'D', 'G', 'B', 'F#'], category: 'min9' },

  // ===== SLASH CHORDS (INVERSIONS) =====
  { name: 'C/G', short: 'C/G', fingers: [3, 3, 2, 0, 1, 0], fingering: [3, 4, 2, 0, 1, 0], notes: ['G', 'C', 'E', 'G', 'C', 'E'], category: 'slash' },
  { name: 'D/F#', short: 'D/F#', fingers: [2, 0, 0, 2, 3, 2], fingering: [1, 0, 0, 2, 4, 3], notes: ['F#', 'D', 'A', 'D', 'F#'], category: 'slash' },
  { name: 'G/B', short: 'G/B', fingers: [-1, 2, 0, 0, 0, 3], fingering: [0, 1, 0, 0, 0, 2], notes: ['B', 'D', 'G', 'B', 'G'], category: 'slash' },
  { name: 'Am/G', short: 'Am/G', fingers: [3, 0, 2, 2, 1, 0], fingering: [3, 0, 2, 3, 1, 0], notes: ['G', 'E', 'A', 'C', 'E'], category: 'slash' },
  { name: 'Em/D', short: 'Em/D', fingers: [-1, -1, 0, 0, 0, 0], fingering: [0, 0, 0, 0, 0, 0], notes: ['D', 'G', 'B', 'E'], category: 'slash' },
  { name: 'F/C', short: 'F/C', fingers: [-1, 3, 3, 2, 1, 1], fingering: [0, 3, 4, 2, 1, 1], notes: ['C', 'F', 'A', 'C', 'F'], category: 'slash' },
  { name: 'E/G#', short: 'E/G#', fingers: [4, 2, 2, 1, 0, 0], fingering: [4, 2, 3, 1, 0, 0], notes: ['G#', 'B', 'E', 'G#', 'B', 'E'], category: 'slash' },
  { name: 'A/C#', short: 'A/C#', fingers: [-1, 4, 2, 2, 2, 0], fingering: [0, 4, 1, 2, 3, 0], notes: ['C#', 'E', 'A', 'C#', 'E'], category: 'slash' },
  { name: 'C/E', short: 'C/E', fingers: [0, 3, 2, 0, 1, 0], fingering: [0, 3, 2, 0, 1, 0], notes: ['E', 'C', 'E', 'G', 'C', 'E'], category: 'slash' },
  { name: 'G/D', short: 'G/D', fingers: [-1, -1, 0, 0, 0, 3], fingering: [0, 0, 0, 0, 0, 3], notes: ['D', 'G', 'B', 'G'], category: 'slash' },

  // ===== 6TH CHORDS =====
  { name: 'C6', short: 'C6', fingers: [-1, 3, 2, 2, 1, 0], fingering: [0, 4, 2, 3, 1, 0], notes: ['C', 'E', 'A', 'C', 'E'], category: '6th' },
  { name: 'D6', short: 'D6', fingers: [-1, -1, 0, 2, 0, 2], fingering: [0, 0, 0, 2, 0, 3], notes: ['D', 'A', 'B', 'F#'], category: '6th' },
  { name: 'E6', short: 'E6', fingers: [0, 2, 2, 1, 2, 0], fingering: [0, 2, 3, 1, 4, 0], notes: ['E', 'B', 'E', 'G#', 'C#', 'E'], category: '6th' },
  { name: 'G6', short: 'G6', fingers: [3, 2, 0, 0, 0, 0], fingering: [2, 1, 0, 0, 0, 0], notes: ['G', 'B', 'D', 'G', 'B', 'E'], category: '6th' },
  { name: 'A6', short: 'A6', fingers: [-1, 0, 2, 2, 2, 2], fingering: [0, 0, 1, 1, 1, 1], notes: ['A', 'E', 'A', 'C#', 'F#'], category: '6th' },

  // ===== MINOR 6TH CHORDS =====
  { name: 'Am6', short: 'Am6', fingers: [-1, 0, 2, 2, 1, 2], fingering: [0, 0, 2, 3, 1, 4], notes: ['A', 'E', 'A', 'C', 'F#'], category: 'm6' },
  { name: 'Dm6', short: 'Dm6', fingers: [-1, -1, 0, 2, 0, 1], fingering: [0, 0, 0, 2, 0, 1], notes: ['D', 'A', 'B', 'F'], category: 'm6' },
  { name: 'Em6', short: 'Em6', fingers: [0, 2, 2, 0, 2, 0], fingering: [0, 1, 2, 0, 3, 0], notes: ['E', 'B', 'E', 'G', 'C#', 'E'], category: 'm6' },
  { name: 'Gm6', short: 'Gm6', fingers: [3, 5, 5, 3, 5, 3], fingering: [1, 2, 3, 1, 4, 1], notes: ['G', 'Bb', 'D', 'G', 'E', 'G'], category: 'm6' },

  // ===== 7SUS4 CHORDS =====
  { name: 'A7sus4', short: 'A7sus4', fingers: [-1, 0, 2, 0, 3, 0], fingering: [0, 0, 1, 0, 2, 0], notes: ['A', 'E', 'G', 'D', 'E'], category: '7sus4' },
  { name: 'D7sus4', short: 'D7sus4', fingers: [-1, -1, 0, 2, 1, 3], fingering: [0, 0, 0, 2, 1, 3], notes: ['D', 'A', 'C', 'G'], category: '7sus4' },
  { name: 'E7sus4', short: 'E7sus4', fingers: [0, 2, 0, 2, 0, 0], fingering: [0, 1, 0, 2, 0, 0], notes: ['E', 'B', 'D', 'A', 'B', 'E'], category: '7sus4' },
  { name: 'G7sus4', short: 'G7sus4', fingers: [3, 3, 0, 0, 1, 1], fingering: [2, 3, 0, 0, 1, 1], notes: ['G', 'C', 'D', 'G', 'C', 'F'], category: '7sus4' },
  { name: 'C7sus4', short: 'C7sus4', fingers: [-1, 3, 3, 3, 1, 1], fingering: [0, 2, 3, 4, 1, 1], notes: ['C', 'G', 'Bb', 'F', 'G'], category: '7sus4' },

  // ===== MAJOR 9TH CHORDS =====
  { name: 'Cmaj9', short: 'Cmaj9', fingers: [-1, 3, 2, 0, 0, 0], fingering: [0, 2, 1, 0, 0, 0], notes: ['C', 'E', 'G', 'B', 'D', 'E'], category: 'maj9' },
  { name: 'Dmaj9', short: 'Dmaj9', fingers: [-1, -1, 0, 2, 2, 0], fingering: [0, 0, 0, 1, 2, 0], notes: ['D', 'A', 'D', 'E', 'C#'], category: 'maj9' },
  { name: 'Fmaj9', short: 'Fmaj9', fingers: [1, 0, 2, 0, 1, 0], fingering: [1, 0, 2, 0, 1, 0], notes: ['F', 'A', 'E', 'G', 'C', 'E'], category: 'maj9' },
  { name: 'Gmaj9', short: 'Gmaj9', fingers: [3, 0, 0, 0, 0, 2], fingering: [2, 0, 0, 0, 0, 1], notes: ['G', 'D', 'G', 'A', 'B', 'F#'], category: 'maj9' },
  { name: 'Amaj9', short: 'Amaj9', fingers: [-1, 0, 2, 1, 0, 0], fingering: [0, 0, 2, 1, 0, 0], notes: ['A', 'E', 'G#', 'B', 'E'], category: 'maj9' },

  // ===== 11TH CHORDS =====
  { name: 'C11', short: 'C11', fingers: [-1, 3, 3, 3, 3, 3], fingering: [0, 1, 1, 1, 1, 1], notes: ['C', 'G', 'Bb', 'D', 'F', 'G'], category: '11th' },
  { name: 'D11', short: 'D11', fingers: [-1, -1, 0, 0, 1, 0], fingering: [0, 0, 0, 0, 1, 0], notes: ['D', 'G', 'C', 'E'], category: '11th' },
  { name: 'G11', short: 'G11', fingers: [3, 3, 0, 0, 1, 1], fingering: [2, 3, 0, 0, 1, 1], notes: ['G', 'C', 'D', 'G', 'C', 'F'], category: '11th' },
  { name: 'A11', short: 'A11', fingers: [-1, 0, 0, 0, 0, 0], fingering: [0, 0, 0, 0, 0, 0], notes: ['A', 'D', 'G', 'B', 'E'], category: '11th' },
  { name: 'E11', short: 'E11', fingers: [0, 0, 0, 1, 0, 0], fingering: [0, 0, 0, 1, 0, 0], notes: ['E', 'A', 'D', 'G#', 'B', 'E'], category: '11th' },

  // ===== 13TH CHORDS =====
  { name: 'C13', short: 'C13', fingers: [-1, 3, 2, 3, 3, 5], fingering: [0, 2, 1, 3, 3, 4], notes: ['C', 'E', 'Bb', 'D', 'A'], category: '13th' },
  { name: 'D13', short: 'D13', fingers: [-1, -1, 0, 2, 1, 2], fingering: [0, 0, 0, 2, 1, 3], notes: ['D', 'A', 'C', 'B'], category: '13th' },
  { name: 'E13', short: 'E13', fingers: [0, 2, 0, 1, 2, 0], fingering: [0, 2, 0, 1, 3, 0], notes: ['E', 'B', 'D', 'G#', 'C#', 'E'], category: '13th' },
  { name: 'G13', short: 'G13', fingers: [3, 2, 0, 0, 0, 0], fingering: [2, 1, 0, 0, 0, 0], notes: ['G', 'B', 'D', 'G', 'B', 'E'], category: '13th' },
  { name: 'A13', short: 'A13', fingers: [-1, 0, 2, 0, 2, 2], fingering: [0, 0, 1, 0, 2, 3], notes: ['A', 'E', 'G', 'F#', 'C#'], category: '13th' },

  // ===== HALF-DIMINISHED (m7b5) CHORDS =====
  { name: 'Am7b5', short: 'Am7b5', fingers: [-1, 0, 1, 2, 1, 3], fingering: [0, 0, 1, 2, 1, 4], notes: ['A', 'Eb', 'G', 'C', 'E'], category: 'm7b5' },
  { name: 'Bm7b5', short: 'Bm7b5', fingers: [-1, 2, 3, 2, 3, -1], fingering: [0, 1, 3, 1, 4, 0], notes: ['B', 'F', 'A', 'D'], category: 'm7b5' },
  { name: 'Cm7b5', short: 'Cm7b5', fingers: [-1, 3, 4, 3, 4, -1], fingering: [0, 1, 3, 1, 4, 0], notes: ['C', 'Gb', 'Bb', 'Eb'], category: 'm7b5' },
  { name: 'Dm7b5', short: 'Dm7b5', fingers: [-1, -1, 0, 1, 1, 1], fingering: [0, 0, 0, 1, 1, 1], notes: ['D', 'Ab', 'C', 'F'], category: 'm7b5' },
  { name: 'Em7b5', short: 'Em7b5', fingers: [0, 1, 2, 0, 3, 0], fingering: [0, 1, 2, 0, 3, 0], notes: ['E', 'Bb', 'E', 'G', 'D', 'E'], category: 'm7b5' },
  { name: 'Fm7b5', short: 'Fm7b5', fingers: [1, 2, 3, 1, 4, 1], fingering: [1, 2, 3, 1, 4, 1], notes: ['F', 'B', 'Eb', 'Ab', 'C', 'F'], category: 'm7b5' },
  { name: 'Gm7b5', short: 'Gm7b5', fingers: [3, 4, 3, 3, -1, -1], fingering: [2, 3, 1, 4, 0, 0], notes: ['G', 'Db', 'F', 'Bb'], category: 'm7b5' },

  // ===== DIMINISHED 7TH CHORDS =====
  { name: 'Cdim7', short: 'Cdim7', fingers: [-1, 3, 4, 2, 4, 2], fingering: [0, 2, 3, 1, 4, 1], notes: ['C', 'Gb', 'A', 'Eb', 'Gb'], category: 'dim7' },
  { name: 'Ddim7', short: 'Ddim7', fingers: [-1, -1, 0, 1, 0, 1], fingering: [0, 0, 0, 1, 0, 2], notes: ['D', 'Ab', 'B', 'F'], category: 'dim7' },
  { name: 'Edim7', short: 'Edim7', fingers: [0, 1, 2, 0, 2, 0], fingering: [0, 1, 2, 0, 3, 0], notes: ['E', 'Bb', 'E', 'G', 'Db', 'E'], category: 'dim7' },
  { name: 'Fdim7', short: 'Fdim7', fingers: [1, 2, 0, 1, 0, 1], fingering: [1, 2, 0, 1, 0, 1], notes: ['F', 'Ab', 'D', 'Ab', 'B', 'F'], category: 'dim7' },
  { name: 'Gdim7', short: 'Gdim7', fingers: [3, 4, 2, 3, 2, -1], fingering: [2, 4, 1, 3, 1, 0], notes: ['G', 'Db', 'E', 'Bb', 'E'], category: 'dim7' },
  { name: 'Adim7', short: 'Adim7', fingers: [-1, 0, 1, 2, 1, 2], fingering: [0, 0, 1, 3, 2, 4], notes: ['A', 'Eb', 'G', 'C', 'Gb'], category: 'dim7' },
  { name: 'Bdim7', short: 'Bdim7', fingers: [-1, 2, 0, 1, 0, 1], fingering: [0, 2, 0, 1, 0, 1], notes: ['B', 'F', 'Ab', 'D', 'Ab'], category: 'dim7' },

  // ===== MINOR MAJOR 7 CHORDS (mMaj7) =====
  { name: 'Am(maj7)', short: 'Am(maj7)', fingers: [-1, 0, 2, 1, 1, 0], fingering: [0, 0, 3, 1, 2, 0], notes: ['A', 'E', 'G#', 'C', 'E'], category: 'mMaj7' },
  { name: 'Cm(maj7)', short: 'Cm(maj7)', fingers: [-1, 3, 5, 4, 4, 3], fingering: [0, 1, 4, 2, 3, 1], notes: ['C', 'G', 'B', 'Eb', 'G'], category: 'mMaj7' },
  { name: 'Dm(maj7)', short: 'Dm(maj7)', fingers: [-1, -1, 0, 2, 2, 1], fingering: [0, 0, 0, 2, 3, 1], notes: ['D', 'A', 'C#', 'F'], category: 'mMaj7' },
  { name: 'Em(maj7)', short: 'Em(maj7)', fingers: [0, 2, 1, 0, 0, 0], fingering: [0, 2, 1, 0, 0, 0], notes: ['E', 'B', 'D#', 'G', 'B', 'E'], category: 'mMaj7' },
  { name: 'Gm(maj7)', short: 'Gm(maj7)', fingers: [3, 5, 4, 3, 3, 3], fingering: [1, 4, 2, 1, 1, 1], notes: ['G', 'Bb', 'F#', 'Bb', 'D', 'G'], category: 'mMaj7' },

  // ===== 6/9 CHORDS =====
  { name: 'C6/9', short: 'C6/9', fingers: [-1, 3, 2, 2, 3, 3], fingering: [0, 2, 1, 1, 3, 4], notes: ['C', 'E', 'A', 'D', 'E'], category: '6/9' },
  { name: 'D6/9', short: 'D6/9', fingers: [-1, -1, 0, 2, 0, 0], fingering: [0, 0, 0, 1, 0, 0], notes: ['D', 'A', 'B', 'E'], category: '6/9' },
  { name: 'E6/9', short: 'E6/9', fingers: [0, 2, 2, 1, 2, 2], fingering: [0, 2, 3, 1, 4, 4], notes: ['E', 'B', 'E', 'G#', 'C#', 'F#'], category: '6/9' },
  { name: 'G6/9', short: 'G6/9', fingers: [3, 0, 0, 2, 0, 0], fingering: [2, 0, 0, 1, 0, 0], notes: ['G', 'D', 'G', 'A', 'B', 'E'], category: '6/9' },
  { name: 'A6/9', short: 'A6/9', fingers: [-1, 0, 4, 4, 2, 2], fingering: [0, 0, 3, 4, 1, 2], notes: ['A', 'E', 'C#', 'F#', 'B'], category: '6/9' },

  // ===== MINOR 11 CHORDS =====
  { name: 'Am11', short: 'Am11', fingers: [-1, 0, 0, 0, 1, 0], fingering: [0, 0, 0, 0, 1, 0], notes: ['A', 'D', 'G', 'C', 'E'], category: 'm11' },
  { name: 'Dm11', short: 'Dm11', fingers: [-1, -1, 0, 0, 1, 1], fingering: [0, 0, 0, 0, 1, 1], notes: ['D', 'G', 'C', 'F'], category: 'm11' },
  { name: 'Em11', short: 'Em11', fingers: [0, 0, 0, 0, 0, 0], fingering: [0, 0, 0, 0, 0, 0], notes: ['E', 'A', 'D', 'G', 'B', 'E'], category: 'm11' },
  { name: 'Gm11', short: 'Gm11', fingers: [3, 3, 3, 3, 3, 3], fingering: [1, 1, 1, 1, 1, 1], notes: ['G', 'C', 'F', 'Bb', 'D', 'G'], category: 'm11' },

  // ===== 7#9 CHORDS (HENDRIX CHORD) =====
  { name: 'E7#9', short: 'E7#9', fingers: [0, 2, 0, 1, 3, 3], fingering: [0, 2, 0, 1, 3, 4], notes: ['E', 'B', 'D', 'G#', 'D', 'G'], category: '7#9' },
  { name: 'A7#9', short: 'A7#9', fingers: [-1, 0, 2, 0, 2, 3], fingering: [0, 0, 1, 0, 2, 4], notes: ['A', 'E', 'G', 'C', 'C'], category: '7#9' },
  { name: 'D7#9', short: 'D7#9', fingers: [-1, -1, 0, 2, 1, 3], fingering: [0, 0, 0, 2, 1, 4], notes: ['D', 'A', 'C', 'F'], category: '7#9' },
  { name: 'G7#9', short: 'G7#9', fingers: [3, 2, 0, 1, 3, 4], fingering: [3, 2, 0, 1, 3, 4], notes: ['G', 'B', 'D', 'F', 'D', 'A#'], category: '7#9' },
  { name: 'C7#9', short: 'C7#9', fingers: [-1, 3, 2, 3, 4, 4], fingering: [0, 2, 1, 3, 4, 4], notes: ['C', 'E', 'Bb', 'D#', 'G'], category: '7#9' },

  // ===== 7b9 CHORDS =====
  { name: 'E7b9', short: 'E7b9', fingers: [0, 2, 0, 1, 0, 1], fingering: [0, 2, 0, 1, 0, 1], notes: ['E', 'B', 'D', 'G#', 'B', 'F'], category: '7b9' },
  { name: 'A7b9', short: 'A7b9', fingers: [-1, 0, 2, 3, 2, 3], fingering: [0, 0, 1, 3, 2, 4], notes: ['A', 'E', 'G', 'Bb', 'C#'], category: '7b9' },
  { name: 'D7b9', short: 'D7b9', fingers: [-1, -1, 0, 2, 1, 2], fingering: [0, 0, 0, 2, 1, 3], notes: ['D', 'A', 'C', 'Eb', 'F#'], category: '7b9' },
  { name: 'G7b9', short: 'G7b9', fingers: [3, 2, 0, 1, 0, 1], fingering: [3, 2, 0, 1, 0, 1], notes: ['G', 'B', 'D', 'F', 'B', 'Ab'], category: '7b9' },
  { name: 'C7b9', short: 'C7b9', fingers: [-1, 3, 2, 3, 2, 3], fingering: [0, 2, 1, 3, 1, 4], notes: ['C', 'E', 'Bb', 'Db', 'E'], category: '7b9' },

  // ===== ADD11 CHORDS =====
  { name: 'Cadd11', short: 'Cadd11', fingers: [-1, 3, 3, 0, 1, 0], fingering: [0, 3, 4, 0, 1, 0], notes: ['C', 'G', 'C', 'F', 'C', 'E'], category: 'add11' },
  { name: 'Dadd11', short: 'Dadd11', fingers: [-1, -1, 0, 0, 3, 0], fingering: [0, 0, 0, 0, 2, 0], notes: ['D', 'G', 'D', 'E'], category: 'add11' },
  { name: 'Eadd11', short: 'Eadd11', fingers: [0, 2, 2, 1, 0, 2], fingering: [0, 2, 3, 1, 0, 4], notes: ['E', 'B', 'E', 'G#', 'B', 'A'], category: 'add11' },
  { name: 'Gadd11', short: 'Gadd11', fingers: [3, 0, 0, 0, 1, 3], fingering: [2, 0, 0, 0, 1, 3], notes: ['G', 'D', 'G', 'C', 'C', 'G'], category: 'add11' },
  { name: 'Aadd11', short: 'Aadd11', fingers: [-1, 0, 0, 2, 0, 0], fingering: [0, 0, 0, 1, 0, 0], notes: ['A', 'D', 'A', 'D', 'E'], category: 'add11' },

  // ===== 7#5 (AUGMENTED 7TH) CHORDS =====
  { name: 'C7#5', short: 'C7#5', fingers: [-1, 3, 2, 3, 1, 0], fingering: [0, 3, 2, 4, 1, 0], notes: ['C', 'E', 'G#', 'Bb', 'E'], category: '7#5' },
  { name: 'D7#5', short: 'D7#5', fingers: [-1, -1, 0, 3, 1, 2], fingering: [0, 0, 0, 3, 1, 2], notes: ['D', 'A#', 'C', 'F#'], category: '7#5' },
  { name: 'E7#5', short: 'E7#5', fingers: [0, 3, 0, 1, 1, 0], fingering: [0, 3, 0, 1, 2, 0], notes: ['E', 'C', 'D', 'G#', 'C', 'E'], category: '7#5' },
  { name: 'G7#5', short: 'G7#5', fingers: [3, 2, 1, 0, 0, 3], fingering: [3, 2, 1, 0, 0, 4], notes: ['G', 'B', 'D#', 'F', 'B', 'G'], category: '7#5' },
  { name: 'A7#5', short: 'A7#5', fingers: [-1, 0, 3, 0, 2, 1], fingering: [0, 0, 3, 0, 2, 1], notes: ['A', 'F', 'G', 'C#', 'F'], category: '7#5' },

  // ===== 7b5 (FLAT FIVE) CHORDS =====
  { name: 'C7b5', short: 'C7b5', fingers: [-1, 3, 4, 3, 5, -1], fingering: [0, 1, 2, 1, 4, 0], notes: ['C', 'E', 'Gb', 'Bb'], category: '7b5' },
  { name: 'D7b5', short: 'D7b5', fingers: [-1, -1, 0, 1, 1, 2], fingering: [0, 0, 0, 1, 1, 2], notes: ['D', 'Ab', 'C', 'F#'], category: '7b5' },
  { name: 'E7b5', short: 'E7b5', fingers: [0, 1, 0, 1, 3, 0], fingering: [0, 1, 0, 1, 3, 0], notes: ['E', 'Bb', 'D', 'G#', 'D', 'E'], category: '7b5' },
  { name: 'G7b5', short: 'G7b5', fingers: [3, 4, 3, 4, -1, -1], fingering: [1, 3, 2, 4, 0, 0], notes: ['G', 'Db', 'F', 'B'], category: '7b5' },
  { name: 'A7b5', short: 'A7b5', fingers: [-1, 0, 1, 0, 2, 3], fingering: [0, 0, 1, 0, 2, 4], notes: ['A', 'Eb', 'G', 'C#', 'G'], category: '7b5' },
];

/**
 * ChordDiagram - Canvas-based chord diagram component
 * Draws a guitar fretboard diagram showing finger positions for a chord
 */
function ChordDiagram({ chord, width = 120, height = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size accounting for device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Drawing constants
    const padding = 20;
    const fretboardWidth = width - padding * 2;
    const fretboardHeight = height - padding * 2 - 20; // Extra space for string labels
    const numStrings = 6;
    const numFrets = 4;
    const stringSpacing = fretboardWidth / (numStrings - 1);
    const fretSpacing = fretboardHeight / numFrets;

    // Determine if we need to show fret numbers (for barre chords)
    const minFret = Math.min(...chord.fingers.filter(f => f > 0));
    const showFretNumber = minFret > 1;
    const baseFret = showFretNumber ? minFret : 0;

    // Draw fret number if needed
    if (showFretNumber) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${baseFret}fr`, padding - 5, padding + fretSpacing);
    }

    // Draw frets (horizontal lines)
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = showFretNumber ? 2 : 3; // Thicker for nut
    for (let i = 0; i <= numFrets; i++) {
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * fretSpacing);
      ctx.lineTo(padding + fretboardWidth, padding + i * fretSpacing);
      ctx.stroke();
      if (i === 0) ctx.lineWidth = 2; // Only nut is thick
    }

    // Draw strings (vertical lines)
    ctx.lineWidth = 1;
    for (let i = 0; i < numStrings; i++) {
      ctx.beginPath();
      ctx.moveTo(padding + i * stringSpacing, padding);
      ctx.lineTo(padding + i * stringSpacing, padding + fretboardHeight);
      ctx.stroke();
    }

    // Draw finger positions and string status
    chord.fingers.forEach((fret, stringIndex) => {
      const x = padding + stringIndex * stringSpacing;

      if (fret === -1) {
        // Muted string (X)
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        const size = 6;
        ctx.beginPath();
        ctx.moveTo(x - size, padding - 12 - size);
        ctx.lineTo(x + size, padding - 12 + size);
        ctx.moveTo(x + size, padding - 12 - size);
        ctx.lineTo(x - size, padding - 12 + size);
        ctx.stroke();
      } else if (fret === 0) {
        // Open string (O)
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, padding - 12, 6, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Fretted note (filled circle)
        const adjustedFret = showFretNumber ? fret - baseFret + 1 : fret;
        const y = padding + (adjustedFret - 0.5) * fretSpacing;

        // Draw finger position - using teal brand color
        ctx.fillStyle = '#14b8a6';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw finger number
        if (chord.fingering && chord.fingering[stringIndex] > 0) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(chord.fingering[stringIndex].toString(), x, y);
        }
      }
    });

  }, [chord, width, height]);

  return <canvas ref={canvasRef} className="mx-auto" />;
}

ChordDiagram.propTypes = {
  chord: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fingers: PropTypes.arrayOf(PropTypes.number).isRequired,
    fingering: PropTypes.arrayOf(PropTypes.number),
    notes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

/**
 * ChordCard - Card component displaying a single chord
 */
function ChordCard({ chord, onPlay }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay(chord);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="chord-dictionary-card">
      <h3 className="chord-dictionary-card-title">{chord.name}</h3>
      <ChordDiagram chord={chord} />
      <button
        onClick={handlePlay}
        className={`chord-dictionary-play-btn ${isPlaying ? 'playing' : ''}`}
      >
        {isPlaying ? 'Playing...' : 'Play Chord'}
      </button>
    </div>
  );
}

ChordCard.propTypes = {
  chord: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fingers: PropTypes.arrayOf(PropTypes.number).isRequired,
    fingering: PropTypes.arrayOf(PropTypes.number),
    notes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onPlay: PropTypes.func.isRequired,
};

/**
 * ChordDictionary - Main component
 * Displays a searchable, filterable grid of guitar chords
 */
export default function ChordDictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, major, minor, maj7, min7, dom7
  const audioContextRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Note frequencies (A4 = 440 Hz)
  const getNoteFrequency = (noteName) => {
    const noteFrequencies = {
      'C': 130.81, 'C#': 138.59, 'Db': 138.59,
      'D': 146.83, 'D#': 155.56, 'Eb': 155.56,
      'E': 164.81,
      'F': 174.61, 'F#': 185.00, 'Gb': 185.00,
      'G': 196.00, 'G#': 207.65, 'Ab': 207.65,
      'A': 220.00, 'A#': 233.08, 'Bb': 233.08,
      'B': 246.94,
    };
    return noteFrequencies[noteName] || 440;
  };

  // Play chord using Web Audio API
  const playChord = (chord) => {
    if (!audioContextRef.current || !chord.notes) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const duration = 1.5;

    chord.notes.forEach((note, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(getNoteFrequency(note), now);

      // Stagger the notes slightly for a strumming effect
      const startTime = now + (index * 0.05);

      // Envelope (ADSR)
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.1, startTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  };

  // Filter chords based on search and filter
  const filteredChords = CHORD_DATA.filter(chord => {
    const matchesSearch = chord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chord.short.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') {
      return matchesSearch;
    }

    return matchesSearch && chord.category === filter;
  });

  // Get filter button class
  const getFilterClass = (filterValue) => {
    return `chord-dictionary-filter-btn ${filter === filterValue ? 'selected' : ''}`;
  };

  return (
    <div className="chord-dictionary-page">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="chord-dictionary-back-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <header className="chord-dictionary-header">
          <h1 className="chord-dictionary-title">Chord Dictionary</h1>
          <p className="chord-dictionary-subtitle">Interactive guitar chord diagrams with audio playback</p>
        </header>

        {/* Search and Filter Controls */}
        <div className="chord-dictionary-search-panel">
          <div className="chord-dictionary-search-grid">
            {/* Search */}
            <div>
              <label className="chord-dictionary-label">Search Chords</label>
              <input
                type="text"
                placeholder="Type chord name (e.g., C, Am, G Major...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="chord-dictionary-search-input"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="chord-dictionary-label">Filter by Type</label>
              <div className="chord-dictionary-filter-grid">
                <button onClick={() => setFilter('all')} className={getFilterClass('all')}>
                  All ({CHORD_DATA.length})
                </button>
                <button onClick={() => setFilter('major')} className={getFilterClass('major')}>
                  Major
                </button>
                <button onClick={() => setFilter('minor')} className={getFilterClass('minor')}>
                  Minor
                </button>
                <button onClick={() => setFilter('maj7')} className={getFilterClass('maj7')}>
                  Maj7
                </button>
                <button onClick={() => setFilter('min7')} className={getFilterClass('min7')}>
                  Min7
                </button>
                <button onClick={() => setFilter('dom7')} className={getFilterClass('dom7')}>
                  Dom7
                </button>
                <button onClick={() => setFilter('sus')} className={getFilterClass('sus')}>
                  Sus
                </button>
                <button onClick={() => setFilter('add9')} className={getFilterClass('add9')}>
                  Add9
                </button>
                <button onClick={() => setFilter('power')} className={getFilterClass('power')}>
                  Power
                </button>
                <button onClick={() => setFilter('dim')} className={getFilterClass('dim')}>
                  Dim
                </button>
                <button onClick={() => setFilter('aug')} className={getFilterClass('aug')}>
                  Aug
                </button>
                <button onClick={() => setFilter('9th')} className={getFilterClass('9th')}>
                  9th
                </button>
                <button onClick={() => setFilter('min9')} className={getFilterClass('min9')}>
                  Min9
                </button>
                <button onClick={() => setFilter('slash')} className={getFilterClass('slash')}>
                  Slash
                </button>
                <button onClick={() => setFilter('6th')} className={getFilterClass('6th')}>
                  6th
                </button>
                <button onClick={() => setFilter('m6')} className={getFilterClass('m6')}>
                  m6
                </button>
                <button onClick={() => setFilter('7sus4')} className={getFilterClass('7sus4')}>
                  7sus4
                </button>
                <button onClick={() => setFilter('maj9')} className={getFilterClass('maj9')}>
                  Maj9
                </button>
                <button onClick={() => setFilter('11th')} className={getFilterClass('11th')}>
                  11th
                </button>
                <button onClick={() => setFilter('13th')} className={getFilterClass('13th')}>
                  13th
                </button>
                <button onClick={() => setFilter('m7b5')} className={getFilterClass('m7b5')}>
                  m7b5
                </button>
                <button onClick={() => setFilter('dim7')} className={getFilterClass('dim7')}>
                  dim7
                </button>
                <button onClick={() => setFilter('mMaj7')} className={getFilterClass('mMaj7')}>
                  mMaj7
                </button>
                <button onClick={() => setFilter('6/9')} className={getFilterClass('6/9')}>
                  6/9
                </button>
                <button onClick={() => setFilter('m11')} className={getFilterClass('m11')}>
                  m11
                </button>
                <button onClick={() => setFilter('7#9')} className={getFilterClass('7#9')}>
                  7#9
                </button>
                <button onClick={() => setFilter('7b9')} className={getFilterClass('7b9')}>
                  7b9
                </button>
                <button onClick={() => setFilter('add11')} className={getFilterClass('add11')}>
                  add11
                </button>
                <button onClick={() => setFilter('7#5')} className={getFilterClass('7#5')}>
                  7#5
                </button>
                <button onClick={() => setFilter('7b5')} className={getFilterClass('7b5')}>
                  7b5
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="chord-dictionary-results-count">
          Showing {filteredChords.length} chord{filteredChords.length !== 1 ? 's' : ''}
        </div>

        {/* Chord Grid */}
        <div className="chord-dictionary-grid">
          {filteredChords.map((chord) => (
            <ChordCard key={chord.name} chord={chord} onPlay={playChord} />
          ))}
        </div>

        {/* No Results */}
        {filteredChords.length === 0 && (
          <div className="chord-dictionary-no-results">
            <p>No chords found matching &quot;{searchTerm}&quot;</p>
            <button
              onClick={() => setSearchTerm('')}
              className="chord-dictionary-clear-btn"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="chord-dictionary-legend">
          <h3 className="chord-dictionary-legend-title">How to Read Chord Diagrams</h3>
          <div className="chord-dictionary-legend-grid">
            <div className="chord-dictionary-legend-item">
              <div className="chord-dictionary-legend-icon open"></div>
              <div className="chord-dictionary-legend-text">
                <strong>Open String</strong>
                <span>Play the string without fretting</span>
              </div>
            </div>
            <div className="chord-dictionary-legend-item">
              <div className="chord-dictionary-legend-icon fretted"></div>
              <div className="chord-dictionary-legend-text">
                <strong>Fretted Note</strong>
                <span>Press string at indicated fret</span>
              </div>
            </div>
            <div className="chord-dictionary-legend-item">
              <div className="chord-dictionary-legend-icon muted">X</div>
              <div className="chord-dictionary-legend-text">
                <strong>Muted String</strong>
                <span>Don&apos;t play this string</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
