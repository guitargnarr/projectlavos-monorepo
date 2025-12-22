/**
 * drumPatterns.js
 * Style-specific drum patterns for backing tracks
 *
 * Pattern format:
 * - Each pattern has beats array with beat position (0-3 for 4/4) and subdivision
 * - subdivision: 0 = on beat, 0.5 = eighth note, 0.25 = sixteenth note
 * - drums: array of drum names to play at that position
 * - velocity: optional, defaults to 1.0
 */

export const DRUM_PATTERNS = {
  // Classic blues shuffle feel
  blues: {
    name: 'Blues Shuffle',
    beatsPerBar: 4,
    pattern: [
      // Beat 1
      { position: 0, drums: ['kick', 'hihat'], velocity: 1.0 },
      { position: 0.33, drums: ['hihat'], velocity: 0.5 },  // Shuffle feel (triplet)
      { position: 0.66, drums: ['hihat'], velocity: 0.6 },
      // Beat 2
      { position: 1, drums: ['snare', 'hihat'], velocity: 0.9 },
      { position: 1.33, drums: ['hihat'], velocity: 0.5 },
      { position: 1.66, drums: ['hihat'], velocity: 0.6 },
      // Beat 3
      { position: 2, drums: ['kick', 'hihat'], velocity: 0.9 },
      { position: 2.33, drums: ['hihat'], velocity: 0.5 },
      { position: 2.66, drums: ['hihat'], velocity: 0.6 },
      // Beat 4
      { position: 3, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 3.33, drums: ['hihat'], velocity: 0.5 },
      { position: 3.66, drums: ['hihat'], velocity: 0.6 },
    ],
  },

  // Straight rock beat
  rock: {
    name: 'Rock Beat',
    beatsPerBar: 4,
    pattern: [
      // Beat 1
      { position: 0, drums: ['kick', 'hihat'], velocity: 1.0 },
      { position: 0.5, drums: ['hihat'], velocity: 0.6 },
      // Beat 2
      { position: 1, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 1.5, drums: ['hihat'], velocity: 0.6 },
      // Beat 3
      { position: 2, drums: ['kick', 'hihat'], velocity: 0.9 },
      { position: 2.5, drums: ['kick', 'hihat'], velocity: 0.7 },
      // Beat 4
      { position: 3, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 3.5, drums: ['hihat'], velocity: 0.6 },
    ],
  },

  // Minor blues - slightly darker feel
  'minor-blues': {
    name: 'Minor Blues',
    beatsPerBar: 4,
    pattern: [
      // Similar to blues but with more emphasis on 2 and 4
      { position: 0, drums: ['kick', 'hihat'], velocity: 0.8 },
      { position: 0.5, drums: ['hihat'], velocity: 0.4 },
      { position: 1, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 1.5, drums: ['hihat'], velocity: 0.5 },
      { position: 2, drums: ['kick', 'hihat'], velocity: 0.7 },
      { position: 2.5, drums: ['hihat'], velocity: 0.4 },
      { position: 3, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 3.5, drums: ['kick', 'hihat'], velocity: 0.6 },
    ],
  },

  // Jazz swing feel - ride cymbal focus
  jazz: {
    name: 'Jazz Swing',
    beatsPerBar: 4,
    pattern: [
      // Ride cymbal pattern (swing feel)
      { position: 0, drums: ['kick', 'ride'], velocity: 0.9 },
      { position: 0.66, drums: ['ride'], velocity: 0.5 },  // Swing triplet
      { position: 1, drums: ['ride'], velocity: 0.7 },
      { position: 1.66, drums: ['ride'], velocity: 0.5 },
      { position: 2, drums: ['kick', 'ride'], velocity: 0.8 },
      { position: 2.66, drums: ['ride'], velocity: 0.5 },
      { position: 3, drums: ['ride'], velocity: 0.7 },
      { position: 3.66, drums: ['ride'], velocity: 0.5 },
      // Hi-hat on 2 and 4 (with foot)
      { position: 1, drums: ['hihat'], velocity: 0.3 },
      { position: 3, drums: ['hihat'], velocity: 0.3 },
    ],
  },

  // Pop feel - tight and consistent
  pop: {
    name: 'Pop Beat',
    beatsPerBar: 4,
    pattern: [
      { position: 0, drums: ['kick', 'hihat'], velocity: 1.0 },
      { position: 0.5, drums: ['hihat'], velocity: 0.5 },
      { position: 1, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 1.5, drums: ['hihat'], velocity: 0.5 },
      { position: 2, drums: ['kick', 'hihat'], velocity: 0.9 },
      { position: 2.5, drums: ['hihat'], velocity: 0.5 },
      { position: 3, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 3.5, drums: ['hihat'], velocity: 0.5 },
    ],
  },

  // Funk - syncopated with ghost notes
  funk: {
    name: 'Funk Groove',
    beatsPerBar: 4,
    pattern: [
      { position: 0, drums: ['kick', 'hihat'], velocity: 1.0 },
      { position: 0.25, drums: ['hihat'], velocity: 0.3 },
      { position: 0.5, drums: ['hihat'], velocity: 0.5 },
      { position: 0.75, drums: ['kick', 'hihat'], velocity: 0.7 },
      { position: 1, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 1.25, drums: ['hihat'], velocity: 0.3 },
      { position: 1.5, drums: ['kick', 'hihat'], velocity: 0.6 },
      { position: 1.75, drums: ['hihat'], velocity: 0.4 },
      { position: 2, drums: ['hihat'], velocity: 0.7 },
      { position: 2.25, drums: ['snare', 'hihat'], velocity: 0.3 },  // Ghost note
      { position: 2.5, drums: ['kick', 'hihat'], velocity: 0.8 },
      { position: 2.75, drums: ['hihat'], velocity: 0.4 },
      { position: 3, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 3.25, drums: ['hihat'], velocity: 0.3 },
      { position: 3.5, drums: ['hihat'], velocity: 0.5 },
      { position: 3.75, drums: ['kick', 'hihat'], velocity: 0.5 },
    ],
  },

  // Country - train beat
  country: {
    name: 'Country Train',
    beatsPerBar: 4,
    pattern: [
      { position: 0, drums: ['kick', 'hihat'], velocity: 1.0 },
      { position: 0.5, drums: ['hihat'], velocity: 0.6 },
      { position: 1, drums: ['snare', 'hihat'], velocity: 0.8 },
      { position: 1.5, drums: ['hihat'], velocity: 0.6 },
      { position: 2, drums: ['kick', 'hihat'], velocity: 0.9 },
      { position: 2.5, drums: ['hihat'], velocity: 0.6 },
      { position: 3, drums: ['snare', 'hihat'], velocity: 0.8 },
      { position: 3.5, drums: ['hihat'], velocity: 0.6 },
    ],
  },

  // Motown - classic soul feel
  motown: {
    name: 'Motown Soul',
    beatsPerBar: 4,
    pattern: [
      { position: 0, drums: ['kick', 'hihat'], velocity: 0.9 },
      { position: 0.5, drums: ['hihat'], velocity: 0.5 },
      { position: 1, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 1.5, drums: ['hihat'], velocity: 0.5 },
      { position: 2, drums: ['kick', 'hihat'], velocity: 0.8 },
      { position: 2.25, drums: ['kick'], velocity: 0.5 },
      { position: 2.5, drums: ['hihat'], velocity: 0.5 },
      { position: 3, drums: ['snare', 'hihat'], velocity: 1.0 },
      { position: 3.5, drums: ['hihat'], velocity: 0.5 },
      { position: 3.75, drums: ['kick'], velocity: 0.4 },
    ],
  },
};

/**
 * Get drum pattern for a style
 * @param {string} style - Style name
 * @returns {Object} Pattern object with name, beatsPerBar, and pattern array
 */
export function getDrumPattern(style) {
  return DRUM_PATTERNS[style] || DRUM_PATTERNS.rock;
}

/**
 * Calculate pattern events for a given bar with BPM
 * @param {string} style - Style name
 * @param {number} barStartTime - Audio context time when bar starts
 * @param {number} bpm - Beats per minute
 * @returns {Array} Array of {time, drums, velocity} events
 */
export function getBarEvents(style, barStartTime, bpm) {
  const pattern = getDrumPattern(style);
  const beatDuration = 60 / bpm;

  return pattern.pattern.map(event => ({
    time: barStartTime + (event.position * beatDuration),
    drums: event.drums,
    velocity: event.velocity || 1.0,
  }));
}

export default DRUM_PATTERNS;
