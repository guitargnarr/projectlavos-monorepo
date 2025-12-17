/**
 * Chord Library
 *
 * Comprehensive chord data including:
 * - Finger positions for guitar
 * - Fingering suggestions
 * - Note names
 * - Categories for filtering
 *
 * Extracted from ChordDictionary.jsx for reusability across components.
 */

/**
 * Chord data structure:
 * - name: Full chord name (e.g., "C Major")
 * - short: Abbreviated name for display (e.g., "C")
 * - fingers: Array of 6 elements (one per string, low E to high E)
 *   - -1 = don't play (muted)
 *   - 0 = open string
 *   - 1-12 = fret number
 * - fingering: Array showing which finger to use (1=index, 2=middle, 3=ring, 4=pinky)
 * - notes: Array of note names played
 * - category: Chord category for filtering
 */

// Chord type definitions (intervals from root) - shared with EarTraining
export const CHORD_INTERVALS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 4, 7, 14],
  power: [0, 7],
};

// Chord types for ear training (simplified version)
export const CHORD_TYPES_SIMPLE = [
  { name: 'Major', intervals: [0, 4, 7] },
  { name: 'Minor', intervals: [0, 3, 7] },
  { name: 'Diminished', intervals: [0, 3, 6] },
  { name: 'Augmented', intervals: [0, 4, 8] },
  { name: 'Major 7th', intervals: [0, 4, 7, 11] },
  { name: 'Minor 7th', intervals: [0, 3, 7, 10] },
  { name: 'Dominant 7th', intervals: [0, 4, 7, 10] },
];

// All chord categories
export const CHORD_CATEGORIES = [
  { id: 'major', name: 'Major' },
  { id: 'minor', name: 'Minor' },
  { id: 'maj7', name: 'Major 7th' },
  { id: 'min7', name: 'Minor 7th' },
  { id: 'dom7', name: 'Dominant 7th' },
  { id: 'sus', name: 'Suspended' },
  { id: 'add9', name: 'Add9' },
  { id: 'power', name: 'Power' },
  { id: 'dim', name: 'Diminished' },
  { id: 'aug', name: 'Augmented' },
  { id: '9th', name: '9th' },
  { id: 'min9', name: 'Minor 9th' },
  { id: 'slash', name: 'Slash/Inversions' },
  { id: '6th', name: '6th' },
  { id: 'm6', name: 'Minor 6th' },
  { id: '7sus4', name: '7sus4' },
  { id: 'maj9', name: 'Major 9th' },
  { id: '11th', name: '11th' },
  { id: '13th', name: '13th' },
  { id: 'm7b5', name: 'Half-Dim' },
  { id: 'dim7', name: 'Dim 7th' },
  { id: 'mMaj7', name: 'MinMaj7' },
  { id: '6/9', name: '6/9' },
  { id: 'm11', name: 'Minor 11' },
  { id: '7#9', name: '7#9 (Hendrix)' },
  { id: '7b9', name: '7b9' },
  { id: 'add11', name: 'Add11' },
  { id: '7#5', name: 'Aug 7th' },
  { id: '7b5', name: '7b5' },
];

// Complete chord dictionary
export const CHORD_DATA = [
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

  // ===== POWER CHORDS =====
  { name: 'C Power', short: 'C5', fingers: [-1, 3, 5, 5, -1, -1], fingering: [0, 1, 3, 4, 0, 0], notes: ['C', 'G', 'C'], category: 'power' },
  { name: 'D Power', short: 'D5', fingers: [-1, -1, 0, 2, 3, -1], fingering: [0, 0, 0, 1, 2, 0], notes: ['D', 'A', 'D'], category: 'power' },
  { name: 'E Power', short: 'E5', fingers: [0, 2, 2, -1, -1, -1], fingering: [0, 1, 2, 0, 0, 0], notes: ['E', 'B', 'E'], category: 'power' },
  { name: 'F Power', short: 'F5', fingers: [1, 3, 3, -1, -1, -1], fingering: [1, 3, 4, 0, 0, 0], notes: ['F', 'C', 'F'], category: 'power' },
  { name: 'G Power', short: 'G5', fingers: [3, 5, 5, -1, -1, -1], fingering: [1, 3, 4, 0, 0, 0], notes: ['G', 'D', 'G'], category: 'power' },
  { name: 'A Power', short: 'A5', fingers: [-1, 0, 2, 2, -1, -1], fingering: [0, 0, 1, 2, 0, 0], notes: ['A', 'E', 'A'], category: 'power' },
  { name: 'B Power', short: 'B5', fingers: [-1, 2, 4, 4, -1, -1], fingering: [0, 1, 3, 4, 0, 0], notes: ['B', 'F#', 'B'], category: 'power' },

  // ===== DOMINANT 7TH CHORDS =====
  { name: 'C Dominant 7', short: 'C7', fingers: [-1, 3, 2, 3, 1, 0], fingering: [0, 3, 2, 4, 1, 0], notes: ['C', 'E', 'Bb', 'C', 'E'], category: 'dom7' },
  { name: 'D Dominant 7', short: 'D7', fingers: [-1, -1, 0, 2, 1, 2], fingering: [0, 0, 0, 2, 1, 3], notes: ['D', 'A', 'C', 'F#'], category: 'dom7' },
  { name: 'E Dominant 7', short: 'E7', fingers: [0, 2, 0, 1, 0, 0], fingering: [0, 2, 0, 1, 0, 0], notes: ['E', 'B', 'D', 'G#', 'B', 'E'], category: 'dom7' },
  { name: 'G Dominant 7', short: 'G7', fingers: [3, 2, 0, 0, 0, 1], fingering: [3, 2, 0, 0, 0, 1], notes: ['G', 'B', 'D', 'G', 'B', 'F'], category: 'dom7' },
  { name: 'A Dominant 7', short: 'A7', fingers: [-1, 0, 2, 0, 2, 0], fingering: [0, 0, 1, 0, 2, 0], notes: ['A', 'E', 'G', 'C#', 'E'], category: 'dom7' },

  // ===== MAJOR 7TH CHORDS =====
  { name: 'C Major 7', short: 'Cmaj7', fingers: [-1, 3, 2, 0, 0, 0], fingering: [0, 3, 2, 0, 0, 0], notes: ['C', 'E', 'G', 'B', 'E'], category: 'maj7' },
  { name: 'D Major 7', short: 'Dmaj7', fingers: [-1, -1, 0, 2, 2, 2], fingering: [0, 0, 0, 1, 1, 1], notes: ['D', 'A', 'D', 'F#', 'A', 'C#'], category: 'maj7' },
  { name: 'G Major 7', short: 'Gmaj7', fingers: [3, 2, 0, 0, 0, 2], fingering: [3, 2, 0, 0, 0, 1], notes: ['G', 'B', 'D', 'G', 'B', 'F#'], category: 'maj7' },
  { name: 'A Major 7', short: 'Amaj7', fingers: [-1, 0, 2, 1, 2, 0], fingering: [0, 0, 2, 1, 3, 0], notes: ['A', 'E', 'G#', 'C#', 'E'], category: 'maj7' },

  // ===== MINOR 7TH CHORDS =====
  { name: 'A Minor 7', short: 'Am7', fingers: [-1, 0, 2, 0, 1, 0], fingering: [0, 0, 2, 0, 1, 0], notes: ['A', 'E', 'G', 'C', 'E'], category: 'min7' },
  { name: 'D Minor 7', short: 'Dm7', fingers: [-1, -1, 0, 2, 1, 1], fingering: [0, 0, 0, 2, 1, 1], notes: ['D', 'A', 'C', 'F'], category: 'min7' },
  { name: 'E Minor 7', short: 'Em7', fingers: [0, 2, 0, 0, 0, 0], fingering: [0, 2, 0, 0, 0, 0], notes: ['E', 'B', 'D', 'G', 'B', 'E'], category: 'min7' },

  // ===== SUS CHORDS =====
  { name: 'D Sus2', short: 'Dsus2', fingers: [-1, -1, 0, 2, 3, 0], fingering: [0, 0, 0, 1, 2, 0], notes: ['D', 'A', 'D', 'E'], category: 'sus' },
  { name: 'D Sus4', short: 'Dsus4', fingers: [-1, -1, 0, 2, 3, 3], fingering: [0, 0, 0, 1, 2, 3], notes: ['D', 'A', 'D', 'G'], category: 'sus' },
  { name: 'A Sus2', short: 'Asus2', fingers: [-1, 0, 2, 2, 0, 0], fingering: [0, 0, 1, 2, 0, 0], notes: ['A', 'E', 'A', 'B', 'E'], category: 'sus' },
  { name: 'A Sus4', short: 'Asus4', fingers: [-1, 0, 2, 2, 3, 0], fingering: [0, 0, 1, 2, 3, 0], notes: ['A', 'E', 'A', 'D', 'E'], category: 'sus' },
  { name: 'E Sus4', short: 'Esus4', fingers: [0, 2, 2, 2, 0, 0], fingering: [0, 2, 3, 4, 0, 0], notes: ['E', 'B', 'E', 'A', 'B', 'E'], category: 'sus' },

  // ===== ADD9 CHORDS =====
  { name: 'C Add9', short: 'Cadd9', fingers: [-1, 3, 2, 0, 3, 0], fingering: [0, 2, 1, 0, 3, 0], notes: ['C', 'E', 'G', 'D', 'E'], category: 'add9' },
  { name: 'G Add9', short: 'Gadd9', fingers: [3, 0, 0, 2, 0, 3], fingering: [2, 0, 0, 1, 0, 3], notes: ['G', 'D', 'G', 'A', 'B', 'G'], category: 'add9' },

  // ===== DIMINISHED =====
  { name: 'B Diminished', short: 'Bdim', fingers: [-1, 2, 3, 4, 3, -1], fingering: [0, 1, 2, 4, 3, 0], notes: ['B', 'F', 'A', 'D'], category: 'dim' },

  // ===== AUGMENTED =====
  { name: 'C Augmented', short: 'Caug', fingers: [-1, 3, 2, 1, 1, 0], fingering: [0, 4, 3, 1, 2, 0], notes: ['C', 'E', 'G#', 'C', 'E'], category: 'aug' },
];

// Helper functions

/**
 * Get all chords in a category
 * @param {string} category - Category ID
 * @returns {Array} Filtered chord array
 */
export function getChordsByCategory(category) {
  return CHORD_DATA.filter(chord => chord.category === category);
}

/**
 * Get chord by short name
 * @param {string} shortName - Short chord name (e.g., 'Am7')
 * @returns {object|undefined} Chord object or undefined
 */
export function getChordByShortName(shortName) {
  return CHORD_DATA.find(chord => chord.short === shortName);
}

/**
 * Get chord by full name
 * @param {string} name - Full chord name (e.g., 'A Minor 7')
 * @returns {object|undefined} Chord object or undefined
 */
export function getChordByName(name) {
  return CHORD_DATA.find(chord => chord.name === name);
}

/**
 * Search chords by name (partial match)
 * @param {string} query - Search query
 * @returns {Array} Matching chords
 */
export function searchChords(query) {
  const lowerQuery = query.toLowerCase();
  return CHORD_DATA.filter(chord =>
    chord.name.toLowerCase().includes(lowerQuery) ||
    chord.short.toLowerCase().includes(lowerQuery)
  );
}

export default CHORD_DATA;
