/**
 * MIDI File Generation Utilities
 * Creates MIDI files from guitar tab note data
 */

const MIDI_HEADER = [0x4D, 0x54, 0x68, 0x64]; // 'MThd'
const MIDI_TRACK_HEADER = [0x4D, 0x54, 0x72, 0x6B]; // 'MTrk'

/**
 * Encode a value as MIDI variable-length quantity
 */
function encodeVariableLength(value) {
  if (value < 128) return [value];
  const result = [];
  result.push(value & 0x7F);
  value >>= 7;
  while (value > 0) {
    result.unshift((value & 0x7F) | 0x80);
    value >>= 7;
  }
  return result;
}

/**
 * Create a MIDI file from an array of notes
 * @param {Array<{midi: number}>} notes - Array of note objects with MIDI note numbers
 * @param {number} tempo - BPM (default 120)
 * @returns {Uint8Array} - MIDI file as binary data
 */
export function createMidiFile(notes, tempo = 120) {
  const ticksPerBeat = 480;
  const microsecondsPerBeat = Math.round(60000000 / tempo);

  // Build track data
  const trackData = [];

  // Tempo meta event
  trackData.push(0x00); // Delta time
  trackData.push(0xFF, 0x51, 0x03); // Tempo meta event
  trackData.push((microsecondsPerBeat >> 16) & 0xFF);
  trackData.push((microsecondsPerBeat >> 8) & 0xFF);
  trackData.push(microsecondsPerBeat & 0xFF);

  // Program change to acoustic guitar
  trackData.push(0x00); // Delta time
  trackData.push(0xC0, 0x19); // Channel 0, acoustic guitar (nylon)

  // Add notes
  const noteDuration = ticksPerBeat / 2; // Eighth notes
  let currentTime = 0;

  for (const note of notes) {
    // Note on
    trackData.push(...encodeVariableLength(currentTime === 0 ? 0 : 0));
    trackData.push(0x90, note.midi, 0x64); // Note on, velocity 100

    // Note off
    trackData.push(...encodeVariableLength(noteDuration));
    trackData.push(0x80, note.midi, 0x00); // Note off

    currentTime += noteDuration;
  }

  // End of track
  trackData.push(0x00);
  trackData.push(0xFF, 0x2F, 0x00);

  // Build file
  const file = [];

  // Header chunk
  file.push(...MIDI_HEADER);
  file.push(0x00, 0x00, 0x00, 0x06); // Header length
  file.push(0x00, 0x00); // Format 0
  file.push(0x00, 0x01); // 1 track
  file.push((ticksPerBeat >> 8) & 0xFF, ticksPerBeat & 0xFF);

  // Track chunk
  file.push(...MIDI_TRACK_HEADER);
  const trackLength = trackData.length;
  file.push((trackLength >> 24) & 0xFF);
  file.push((trackLength >> 16) & 0xFF);
  file.push((trackLength >> 8) & 0xFF);
  file.push(trackLength & 0xFF);
  file.push(...trackData);

  return new Uint8Array(file);
}

/**
 * Download a MIDI file to the user's device
 * @param {Uint8Array} midiData - MIDI file data
 * @param {string} filename - Name for the downloaded file
 */
export function downloadMidiFile(midiData, filename = 'riff.mid') {
  const blob = new Blob([midiData], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
