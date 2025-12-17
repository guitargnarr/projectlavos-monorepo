/**
 * Pitch Detection Utilities
 *
 * Extracted from Tuner.jsx and ScaleTrainer.jsx to eliminate code duplication.
 * Uses autocorrelation algorithm for accurate pitch detection from audio buffers.
 */

// All 12 chromatic notes for detection
export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Base frequency for A4
export const A4_FREQUENCY = 440;

/**
 * Autocorrelation algorithm for pitch detection
 * @param {Float32Array} buffer - Audio time domain data
 * @param {number} sampleRate - Audio context sample rate
 * @returns {number} Detected frequency in Hz, or -1 if no pitch detected
 */
export function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let rms = 0;

  // Calculate RMS (root mean square) for signal strength
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);

  // Signal too weak to detect pitch
  if (rms < 0.01) return -1;

  let lastCorrelation = 1;
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }

    correlation = 1 - correlation / MAX_SAMPLES;

    if (correlation > 0.9 && correlation > lastCorrelation) {
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    }

    lastCorrelation = correlation;
  }

  if (bestCorrelation > 0.01) {
    return sampleRate / bestOffset;
  }
  return -1;
}

/**
 * Convert frequency to note index (0-11 representing C through B)
 * @param {number} frequency - Frequency in Hz
 * @returns {number} Note index (0-11), or -1 if invalid
 */
export function frequencyToNoteIndex(frequency) {
  if (frequency <= 0) return -1;
  const noteNum = 12 * Math.log2(frequency / A4_FREQUENCY) + 69;
  return Math.round(noteNum) % 12;
}

/**
 * Convert frequency to note name
 * @param {number} frequency - Frequency in Hz
 * @returns {string|null} Note name (e.g., 'C#') or null if invalid
 */
export function frequencyToNote(frequency) {
  if (!frequency || frequency < 20) return null;
  const noteIndex = frequencyToNoteIndex(frequency);
  return noteIndex >= 0 ? CHROMATIC_NOTES[noteIndex] : null;
}

/**
 * Convert frequency difference to cents
 * Cents are 1/100th of a semitone - used for tuning accuracy
 * @param {number} detected - Detected frequency in Hz
 * @param {number} target - Target frequency in Hz
 * @returns {number} Difference in cents (positive = sharp, negative = flat)
 */
export function frequencyToCents(detected, target) {
  return 1200 * Math.log2(detected / target);
}

/**
 * Get note with octave from frequency
 * @param {number} frequency - Frequency in Hz
 * @returns {{note: string, octave: number}|null} Note info or null if invalid
 */
export function frequencyToNoteWithOctave(frequency) {
  if (!frequency || frequency < 20) return null;
  const noteNum = 12 * Math.log2(frequency / A4_FREQUENCY) + 69;
  const noteIndex = Math.round(noteNum) % 12;
  const octave = Math.floor(Math.round(noteNum) / 12) - 1;
  return {
    note: CHROMATIC_NOTES[noteIndex],
    octave,
  };
}
