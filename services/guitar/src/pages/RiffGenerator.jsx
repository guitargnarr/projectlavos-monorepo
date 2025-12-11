import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Soundfont from 'soundfont-player';
import { generateTab, getScaleInfo, SCALES, NOTE_NAMES, GuitarTheory, TUNINGS, CHORD_PROGRESSIONS } from '../lib/guitarTheory';

// MIDI file generation utilities
const MIDI_HEADER = [0x4D, 0x54, 0x68, 0x64]; // 'MThd'
const MIDI_TRACK_HEADER = [0x4D, 0x54, 0x72, 0x6B]; // 'MTrk'

function createMidiFile(notes, tempo = 120) {
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

// Reuse GuitarSynthesizer from TabPlayer with improved sustain
class GuitarSynthesizer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.instrument = null;
    this.loading = true;
    this.stringBaseMidi = [64, 59, 55, 50, 45, 40];
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

const ROOTS = ['E', 'A', 'D', 'G', 'C', 'F', 'B', 'F#', 'C#', 'G#', 'D#', 'A#'];
const PATTERNS = [
  { value: 'ascending', label: 'Ascending', desc: 'Low to high, string by string' },
  { value: 'descending', label: 'Descending', desc: 'High to low' },
  { value: 'pedal', label: 'Pedal Tone', desc: 'Root + melody alternating' },
  { value: 'arpeggio', label: 'Arpeggio', desc: '1-3-5 sweep pattern' },
  { value: 'random', label: 'Random', desc: 'Weighted random notes' },
  { value: '3nps', label: '3 Notes/String', desc: 'Speed picking pattern (7-note scales only)' },
  { value: 'power_chords', label: 'Power Chords', desc: 'Heavy riff with power chords' },
  { value: 'progression', label: 'Progression', desc: 'Chord progression pattern' },
];

const TUNING_OPTIONS = [
  { value: 'standard', label: 'Standard (EADGBE)' },
  { value: 'drop_d', label: 'Drop D (DADGBE)' },
  { value: 'drop_c', label: 'Drop C (CGCFAD)' },
  { value: 'half_step_down', label: 'Half Step Down (Eb)' },
];

const PROGRESSION_OPTIONS = [
  { value: 'blues_12bar', label: '12-Bar Blues', desc: 'I-IV-V classic progression' },
  { value: 'pop_4chord', label: 'Pop 4-Chord', desc: 'I-V-vi-IV (most popular)' },
  { value: 'rock_power', label: 'Rock Power', desc: 'I-IV-V-V rock progression' },
  { value: 'jazz_251', label: 'Jazz ii-V-I', desc: 'Classic jazz turnaround' },
  { value: 'metal_riff', label: 'Metal Riff', desc: 'Phrygian-based i-bVII-bVI-V' },
  { value: 'sad_progression', label: 'Sad/Emotional', desc: 'vi-IV-I-V axis progression' },
  { value: 'andalusian', label: 'Andalusian', desc: 'Flamenco bVII-bVI-V-i' },
];

// Mini fretboard component - responsive with dynamic fret range
function MiniFretboard({ activeNotes, scaleNotes, root, position }) {
  const strings = ['e', 'B', 'G', 'D', 'A', 'E'];
  const startFret = Math.max(0, (position - 1) * 3);
  const fretCount = 6;

  const theory = new GuitarTheory();
  const scaleNoteNames = scaleNotes || [];

  return (
    <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700" role="img" aria-label={`Fretboard showing ${root} scale at position ${position}`}>
      <div className="flex justify-between text-xs text-slate-500 mb-1 pl-5 sm:pl-6">
        {Array.from({ length: fretCount }, (_, i) => (
          <span key={i} className="w-6 sm:w-8 text-center">{startFret + i}</span>
        ))}
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        {strings.map((stringName, stringIdx) => (
          <div key={stringName} className="flex items-center">
            <span className="w-4 sm:w-5 text-xs text-slate-500 font-mono">{stringName}</span>
            <div className="flex-1 flex h-5 sm:h-6 border-b border-slate-600 relative">
              {Array.from({ length: fretCount }, (_, fretOffset) => {
                const fret = startFret + fretOffset;
                const note = theory.getNoteAtFret(5 - stringIdx, fret);
                const isActive = activeNotes.some(n => n.string === stringIdx && n.fret === fret);
                const isInScale = scaleNoteNames.includes(note);
                const isRoot = note === root;

                return (
                  <div
                    key={fretOffset}
                    className={`w-6 sm:w-8 h-full flex items-center justify-center border-r border-slate-700 relative ${
                      fretOffset === 0 && startFret === 0 ? 'border-l-4 border-l-slate-400' : ''
                    }`}
                  >
                    {isInScale && (
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-100 ${
                          isActive
                            ? 'bg-orange-500 text-white scale-125 shadow-lg shadow-orange-500/50'
                            : isRoot
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-600 text-slate-300'
                        }`}
                        role="note"
                        aria-label={`${note} at fret ${fret}${isActive ? ', playing' : ''}`}
                      >
                        {fret}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 sm:gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-teal-500" aria-hidden="true"></span> Root
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-600" aria-hidden="true"></span> Scale
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-orange-500" aria-hidden="true"></span> Playing
        </span>
      </div>
    </div>
  );
}

// Free tier limits
const FREE_GENERATIONS_PER_DAY = 10;
const FREE_PATTERNS = ['ascending', 'descending'];
const FREE_SCALES = ['major', 'minor', 'pentatonic_minor'];

function isPremiumFeature(pattern, scale) {
  return !FREE_PATTERNS.includes(pattern) || !FREE_SCALES.includes(scale);
}

function getGenerationsToday() {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem('riff_gen_count');
  if (stored) {
    const { date, count } = JSON.parse(stored);
    if (date === today) return count;
  }
  return 0;
}

function incrementGenerations() {
  const today = new Date().toISOString().split('T')[0];
  const count = getGenerationsToday() + 1;
  localStorage.setItem('riff_gen_count', JSON.stringify({ date: today, count }));
  return count;
}

// Premium upgrade modal
function UpgradeModal({ isOpen, onClose, reason }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-teal-500/30">
        <h2 id="upgrade-title" className="text-xl font-bold text-teal-400 mb-4">Upgrade to Premium</h2>
        <p className="text-slate-300 mb-4">{reason}</p>
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <div className="text-2xl font-bold text-white mb-1">$9.99<span className="text-sm text-slate-400">/month</span></div>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>- Unlimited riff generations</li>
            <li>- All patterns (3NPS, Pedal, Arpeggio, Random)</li>
            <li>- All 15+ scales</li>
            <li>- MIDI export</li>
          </ul>
        </div>
        <div className="flex gap-3">
          <Link
            to="/pricing"
            className="flex-1 py-3 bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold rounded-lg text-center"
          >
            View Plans
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RiffGenerator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load from URL or defaults
  const [root, setRoot] = useState(searchParams.get('root') || 'E');
  const [scale, setScale] = useState(searchParams.get('scale') || 'phrygian');
  const [pattern, setPattern] = useState(searchParams.get('pattern') || 'ascending');
  const [position, setPosition] = useState(parseInt(searchParams.get('position')) || 1);
  const [bars, setBars] = useState(parseInt(searchParams.get('bars')) || 2);
  const [tempo, setTempo] = useState(parseInt(searchParams.get('tempo')) || 120);
  const [tuning, setTuning] = useState(searchParams.get('tuning') || 'standard');
  const [progression, setProgression] = useState(searchParams.get('progression') || 'blues_12bar');

  const [tab, setTab] = useState('');
  const [scaleInfo, setScaleInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [activeNotes, setActiveNotes] = useState([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [generationsToday, setGenerationsToday] = useState(getGenerationsToday());
  const [copyFeedback, setCopyFeedback] = useState('');

  const synthRef = useRef(null);
  const tabDataRef = useRef([]);
  const positionRef = useRef(0);
  const intervalRef = useRef(null);
  const beatCountRef = useRef(0);
  const loopEnabledRef = useRef(false);

  // Keep ref in sync with state for use in interval callback
  useEffect(() => {
    loopEnabledRef.current = loopEnabled;
  }, [loopEnabled]);

  // Initialize synth
  useEffect(() => {
    const init = async () => {
      synthRef.current = new GuitarSynthesizer();
      await synthRef.current.loadInstrument();
      setIsLoading(false);
    };
    init();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update URL when settings change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('root', root);
    params.set('scale', scale);
    params.set('pattern', pattern);
    params.set('position', position.toString());
    params.set('bars', bars.toString());
    params.set('tempo', tempo.toString());
    params.set('tuning', tuning);
    if (pattern === 'progression') {
      params.set('progression', progression);
    }
    setSearchParams(params, { replace: true });
  }, [root, scale, pattern, position, bars, tempo, tuning, progression, setSearchParams]);

  // Generate tab when params change
  useEffect(() => {
    setError(null);
    try {
      const scaleIntervals = SCALES[scale];
      if (pattern === '3nps' && scaleIntervals.length !== 7) {
        setError(`3NPS requires a 7-note scale. ${scale.replace(/_/g, ' ')} has ${scaleIntervals.length} notes. Try Major, Minor, or a mode.`);
        setTab('');
        setScaleInfo(getScaleInfo(root, scale));
        tabDataRef.current = [];
        return;
      }

      const newTab = generateTab(root, scale, pattern, bars, position, tuning, pattern === 'progression' ? progression : null);
      setTab(newTab);
      setScaleInfo(getScaleInfo(root, scale));
      parseTab(newTab);
    } catch (err) {
      setError(err.message);
      setTab('');
    }
  }, [root, scale, pattern, position, bars, tuning, progression]);

  const parseTab = useCallback((tabString) => {
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
      const column = { notes: [], duration: 1 };
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

    tabDataRef.current = data;
  }, []);

  const playTab = useCallback(() => {
    if (!synthRef.current?.isReady() || tabDataRef.current.length === 0) return;

    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setActiveNotes([]);
      setCurrentNoteIndex(0);
      positionRef.current = 0;
      beatCountRef.current = 0;
      return;
    }

    setIsPlaying(true);
    positionRef.current = 0;
    beatCountRef.current = 0;

    const beatDuration = 60000 / (tempo * 2);

    const playNextNote = () => {
      const pos = positionRef.current;
      if (pos >= tabDataRef.current.length) {
        // Check if loop is enabled
        if (loopEnabledRef.current) {
          positionRef.current = 0;
          beatCountRef.current = 0;
          // Continue playing from beginning
          return;
        }
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        setActiveNotes([]);
        setCurrentNoteIndex(0);
        positionRef.current = 0;
        beatCountRef.current = 0;
        return;
      }

      // Metronome
      if (metronomeEnabled) {
        const isDownbeat = beatCountRef.current % 4 === 0;
        synthRef.current.playMetronomeTick(isDownbeat);
      }
      beatCountRef.current++;

      const column = tabDataRef.current[pos];
      setActiveNotes(column.notes);
      setCurrentNoteIndex(pos);

      for (const note of column.notes) {
        synthRef.current.playNote(note.string, note.fret, beatDuration / 1000);
      }

      positionRef.current++;
    };

    playNextNote();
    intervalRef.current = setInterval(playNextNote, beatDuration);
  }, [isPlaying, tempo, metronomeEnabled]);

  const regenerate = () => {
    // Check free tier limits
    if (generationsToday >= FREE_GENERATIONS_PER_DAY) {
      setUpgradeReason(`You've used all ${FREE_GENERATIONS_PER_DAY} free generations today. Upgrade for unlimited access!`);
      setShowUpgrade(true);
      return;
    }

    if (isPremiumFeature(pattern, scale)) {
      setUpgradeReason(`${pattern.charAt(0).toUpperCase() + pattern.slice(1)} pattern with ${scale.replace(/_/g, ' ')} scale is a premium feature.`);
      setShowUpgrade(true);
      return;
    }

    const newTab = generateTab(root, scale, pattern, bars, position);
    setTab(newTab);
    parseTab(newTab);
    setGenerationsToday(incrementGenerations());
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopyFeedback('Link copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const copyTab = async () => {
    if (!tab) return;
    await navigator.clipboard.writeText(tab);
    setCopyFeedback('Tab copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const TABPLAYER_MIDI = [64, 59, 55, 50, 45, 40];

  const exportMidi = () => {
    // Gate MIDI export behind premium
    if (isPremiumFeature(pattern, scale) || generationsToday >= FREE_GENERATIONS_PER_DAY) {
      setUpgradeReason('MIDI export is a premium feature. Upgrade for unlimited exports!');
      setShowUpgrade(true);
      return;
    }

    if (tabDataRef.current.length === 0) return;

    // Convert tab data to MIDI notes
    const midiNotes = [];
    for (const col of tabDataRef.current) {
      for (const note of col.notes) {
        const midi = TABPLAYER_MIDI[note.string] + note.fret;
        midiNotes.push({ midi });
      }
    }

    const midiData = createMidiFile(midiNotes, tempo);
    const blob = new Blob([midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${root}_${scale}_${pattern}.mid`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTab = () => {
    if (!tab) return;
    const header = `# ${root} ${scale.replace('_', ' ')} - ${pattern.replace('_', ' ')}\n# Tempo: ${tempo} BPM\n# Generated by guitar.projectlavos.com\n\n`;
    const blob = new Blob([header + tab], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${root}_${scale}_${pattern}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // GP5 API URL (set via env var when API is deployed)
  const GP5_API_URL = import.meta.env.VITE_GP5_API_URL || null;

  const exportGP5 = async () => {
    if (!tab) return;

    if (!GP5_API_URL) {
      alert('Guitar Pro export coming soon! Use Tab or MIDI export for now.');
      return;
    }

    try {
      const response = await fetch(`${GP5_API_URL}/generate-gp5`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          root,
          scale,
          pattern,
          bars,
          tuning: 'standard',
          tempo,
          position,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${root}_${scale}_${pattern}.gp5`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('GP5 export error:', error);
      alert('GP5 export failed. Try Tab or MIDI export instead.');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          playTab();
          break;
        case 'r':
          e.preventDefault();
          regenerate();
          break;
        case 'm':
          e.preventDefault();
          setMetronomeEnabled(prev => !prev);
          break;
        case 'l':
          e.preventDefault();
          setLoopEnabled(prev => !prev);
          break;
        case 'c':
          e.preventDefault();
          copyTab();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setTempo(prev => Math.min(200, prev + 5));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setTempo(prev => Math.max(60, prev - 5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playTab]);

  const scaleNoteNames = scaleInfo ? scaleInfo.notes.split(', ') : [];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-teal-400 hover:text-teal-300" aria-label="Back to home">
              &larr; Back
            </Link>
            <h1 className="text-xl font-bold">Riff Generator</h1>
          </div>
          <div className="flex gap-2 items-center">
            {/* Copy feedback toast */}
            {copyFeedback && (
              <span className="text-teal-400 text-sm animate-pulse">{copyFeedback}</span>
            )}
            <button
              onClick={copyTab}
              disabled={!tab}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm disabled:opacity-50"
              title="Copy tab to clipboard (C)"
              aria-label="Copy tab to clipboard"
            >
              Copy
            </button>
            <button
              onClick={exportTab}
              disabled={!tab}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-500 rounded text-sm disabled:opacity-50"
              title="Download Tab file"
              aria-label="Download Tab file"
            >
              Tab
            </button>
            <button
              onClick={exportMidi}
              disabled={tabDataRef.current.length === 0}
              className="px-3 py-2 bg-orange-600 hover:bg-orange-500 rounded text-sm disabled:opacity-50"
              title="Download MIDI file (Premium)"
              aria-label="Download MIDI file"
            >
              MIDI
            </button>
            <button
              onClick={exportGP5}
              disabled={!tab}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm disabled:opacity-50"
              title="Download Guitar Pro file"
              aria-label="Download Guitar Pro file"
            >
              GP5
            </button>
            <button
              onClick={copyShareLink}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
              title="Copy share link"
              aria-label="Copy share link"
            >
              Share
            </button>
            <Link
              to={`/tabplayer?tab=${encodeURIComponent(tab)}`}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
              aria-label="Open in TabPlayer"
            >
              TabPlayer
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-teal-400">Scale Settings</h2>

              {/* Root */}
              <div>
                <label id="root-label" className="block text-sm text-slate-400 mb-2">Root Note</label>
                <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-labelledby="root-label">
                  {ROOTS.map(r => (
                    <button
                      key={r}
                      onClick={() => setRoot(r)}
                      role="radio"
                      aria-checked={root === r}
                      className={`py-2 rounded text-sm font-medium transition-colors ${
                        root === r
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <label htmlFor="scale-select" className="block text-sm text-slate-400 mb-2">Scale</label>
                <select
                  id="scale-select"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                >
                  {Object.keys(SCALES).map(s => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')} ({SCALES[s].length} notes)
                    </option>
                  ))}
                </select>
              </div>

              {/* Tuning */}
              <div>
                <label htmlFor="tuning-select" className="block text-sm text-slate-400 mb-2">Tuning</label>
                <select
                  id="tuning-select"
                  value={tuning}
                  onChange={(e) => setTuning(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                >
                  {TUNING_OPTIONS.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scale Info */}
              {scaleInfo && (
                <div className="bg-slate-700/50 rounded p-3">
                  <div className="text-sm text-slate-400">Notes in scale:</div>
                  <div className="text-teal-300 font-mono">{scaleInfo.notes}</div>
                  <div className="text-sm text-slate-500 mt-1">Tuning: {TUNING_OPTIONS.find(t => t.value === tuning)?.label}</div>
                </div>
              )}
            </div>

            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-teal-400">Pattern Settings</h2>

              {/* Pattern */}
              <div>
                <label id="pattern-label" className="block text-sm text-slate-400 mb-2">Pattern</label>
                <div className="space-y-2" role="radiogroup" aria-labelledby="pattern-label">
                  {PATTERNS.map(p => {
                    const isDisabled = p.value === '3nps' && SCALES[scale].length !== 7;
                    return (
                      <button
                        key={p.value}
                        onClick={() => !isDisabled && setPattern(p.value)}
                        disabled={isDisabled}
                        role="radio"
                        aria-checked={pattern === p.value}
                        aria-disabled={isDisabled}
                        className={`w-full text-left px-4 py-3 rounded transition-colors ${
                          isDisabled
                            ? 'bg-slate-800 border border-slate-700 opacity-50 cursor-not-allowed'
                            : pattern === p.value
                            ? 'bg-teal-500/20 border border-teal-500'
                            : 'bg-slate-700 hover:bg-slate-600 border border-transparent'
                        }`}
                      >
                        <div className="font-medium">{p.label}</div>
                        <div className="text-sm text-slate-400">{p.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progression Selector (only when progression pattern selected) */}
              {pattern === 'progression' && (
                <div>
                  <label htmlFor="progression-select" className="block text-sm text-slate-400 mb-2">Chord Progression</label>
                  <select
                    id="progression-select"
                    value={progression}
                    onChange={(e) => setProgression(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white mb-2"
                  >
                    {PROGRESSION_OPTIONS.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">
                    {PROGRESSION_OPTIONS.find(p => p.value === progression)?.desc}
                  </p>
                </div>
              )}

              {/* Position & Bars */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="position-slider" className="block text-sm text-slate-400 mb-2">Position (1-5)</label>
                  <input
                    id="position-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={position}
                    onChange={(e) => setPosition(parseInt(e.target.value))}
                    className="w-full"
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-valuenow={position}
                  />
                  <div className="text-center text-teal-300">{position}</div>
                </div>
                <div>
                  <label htmlFor="bars-slider" className="block text-sm text-slate-400 mb-2">Bars</label>
                  <input
                    id="bars-slider"
                    type="range"
                    min="1"
                    max="8"
                    value={bars}
                    onChange={(e) => setBars(parseInt(e.target.value))}
                    className="w-full"
                    aria-valuemin={1}
                    aria-valuemax={8}
                    aria-valuenow={bars}
                  />
                  <div className="text-center text-teal-300">{bars}</div>
                </div>
              </div>

              {/* Tempo */}
              <div>
                <label htmlFor="tempo-slider" className="block text-sm text-slate-400 mb-2">Tempo: {tempo} BPM</label>
                <input
                  id="tempo-slider"
                  type="range"
                  min="60"
                  max="200"
                  value={tempo}
                  onChange={(e) => setTempo(parseInt(e.target.value))}
                  className="w-full"
                  aria-valuemin={60}
                  aria-valuemax={200}
                  aria-valuenow={tempo}
                />
              </div>

              {/* Metronome & Loop Toggles */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-400">Metronome</label>
                  <button
                    onClick={() => setMetronomeEnabled(!metronomeEnabled)}
                    aria-pressed={metronomeEnabled}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      metronomeEnabled
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {metronomeEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-400">Loop</label>
                  <button
                    onClick={() => setLoopEnabled(!loopEnabled)}
                    aria-pressed={loopEnabled}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      loopEnabled
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {loopEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Display & Controls */}
          <div className="space-y-6">
            {/* Fretboard Visualization */}
            <MiniFretboard
              activeNotes={activeNotes}
              scaleNotes={scaleNoteNames}
              root={root}
              position={position}
            />

            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-teal-400">Generated Tab</h2>
                <button
                  onClick={regenerate}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                  aria-label="Regenerate tab"
                >
                  Regenerate (R)
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm" role="alert">
                  {error}
                </div>
              )}

              {/* Tab Display */}
              <div className="bg-slate-900 rounded border border-teal-500/30 p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400 whitespace-pre" aria-label="Generated guitar tablature">{tab || '// Select a valid pattern'}</pre>
              </div>

              {/* Progress indicator */}
              {isPlaying && tabDataRef.current.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentNoteIndex + 1} aria-valuemin={1} aria-valuemax={tabDataRef.current.length}>
                    <div
                      className="h-full bg-teal-500 transition-all duration-100"
                      style={{ width: `${(currentNoteIndex / tabDataRef.current.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1 text-center">
                    {currentNoteIndex + 1} / {tabDataRef.current.length}
                    {loopEnabled && <span className="text-teal-400 ml-2">(looping)</span>}
                  </div>
                </div>
              )}

              {/* Play Controls */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={playTab}
                  disabled={isLoading || tabDataRef.current.length === 0}
                  aria-label={isPlaying ? 'Stop playback' : 'Start playback'}
                  className={`flex-1 py-3 rounded font-medium transition-colors ${
                    isPlaying
                      ? 'bg-orange-500 hover:bg-orange-400'
                      : 'bg-teal-500 hover:bg-teal-400'
                  } ${isLoading || tabDataRef.current.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Loading...' : isPlaying ? 'Stop (Space)' : 'Play (Space)'}
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 text-sm text-slate-400">
                <p>Position {position} = frets {position === 1 ? '0-4' : `~${(position - 1) * 3}-${(position - 1) * 3 + 4}`}</p>
                <p>{tabDataRef.current.length} notes at {tempo} BPM</p>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-slate-800/50 rounded-lg p-4 text-sm text-slate-400">
              <h3 className="font-medium text-slate-300 mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Space</kbd> Play/Stop</div>
                <div><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">R</kbd> Regenerate</div>
                <div><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">M</kbd> Metronome</div>
                <div><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">L</kbd> Loop</div>
                <div><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">C</kbd> Copy Tab</div>
                <div><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">&uarr;/&darr;</kbd> Tempo</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Free tier info */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-slate-800/50 rounded-lg p-4 text-sm text-slate-400 flex items-center justify-between">
          <div>
            <span className="text-slate-300">Free tier: </span>
            {generationsToday}/{FREE_GENERATIONS_PER_DAY} generations today
            {isPremiumFeature(pattern, scale) && (
              <span className="text-orange-400 ml-2">(Premium feature selected)</span>
            )}
          </div>
          <Link to="/pricing" className="text-teal-400 hover:text-teal-300">
            Upgrade
          </Link>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
      />
    </div>
  );
}
