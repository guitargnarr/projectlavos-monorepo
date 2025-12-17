import Soundfont from 'soundfont-player';
import { MIDI_BASE } from './guitarTheory';

/**
 * GuitarSynthesizer - Audio playback for guitar notes using Soundfont
 * Supports multiple tunings with proper MIDI note mapping
 */
class GuitarSynthesizer {
  constructor(tuning = 'standard') {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.instrument = null;
    this.loading = true;
    this.tuning = tuning;
    // Get MIDI base notes for the selected tuning (reversed: high string first in display order)
    const baseMidi = MIDI_BASE[tuning] || MIDI_BASE.standard;
    this.stringBaseMidi = [...baseMidi].reverse(); // [E4, B3, G3, D3, A2, E2] for standard
  }

  setTuning(tuning) {
    this.tuning = tuning;
    const baseMidi = MIDI_BASE[tuning] || MIDI_BASE.standard;
    this.stringBaseMidi = [...baseMidi].reverse();
  }

  async loadInstrument() {
    try {
      this.instrument = await Soundfont.instrument(this.audioContext, 'acoustic_guitar_nylon');
      this.loading = false;
      return true;
    } catch (error) {
      console.error('Failed to load soundfont:', error);
      this.loading = false;
      return false;
    }
  }

  playNote(string, fret, duration = 0.5) {
    if (!this.instrument || this.loading) return;
    const midiNote = this.stringBaseMidi[string] + fret;
    // Add natural decay - duration is minimum, sustain extends it
    const sustain = Math.max(duration * 1.5, 0.8);
    this.instrument.play(midiNote, this.audioContext.currentTime, {
      duration: sustain,
      gain: 0.7,
      decay: 0.3,
      sustain: 0.6,
      release: 0.4
    });
  }

  playMetronomeTick(isDownbeat = false) {
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.frequency.value = isDownbeat ? 1000 : 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  isReady() {
    return !this.loading && this.instrument !== null;
  }
}

export default GuitarSynthesizer;
