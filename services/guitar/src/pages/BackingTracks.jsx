import { useState, useEffect, useRef, useCallback } from 'react';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chord progressions by style (using Roman numeral notation)
const PROGRESSIONS = {
  rock: { name: 'Rock (I-IV-V-I)', chords: ['I', 'IV', 'V', 'I'], beatsPerChord: 4 },
  blues: { name: '12-Bar Blues', chords: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'], beatsPerChord: 4 },
  'minor-blues': { name: 'Minor Blues (i-iv-V)', chords: ['i', 'i', 'i', 'i', 'iv', 'iv', 'i', 'i', 'V', 'iv', 'i', 'V'], beatsPerChord: 4 },
  jazz: { name: 'Jazz ii-V-I', chords: ['ii', 'V', 'I', 'I'], beatsPerChord: 4 },
  pop: { name: 'Pop (I-V-vi-IV)', chords: ['I', 'V', 'vi', 'IV'], beatsPerChord: 4 },
  funk: { name: 'Funk (i-IV)', chords: ['i', 'IV', 'i', 'IV'], beatsPerChord: 4 },
  country: { name: 'Country (I-IV-V-IV)', chords: ['I', 'IV', 'V', 'IV'], beatsPerChord: 4 },
  motown: { name: 'Motown (I-vi-IV-V)', chords: ['I', 'vi', 'IV', 'V'], beatsPerChord: 4 },
};

// Map Roman numerals to semitone offsets and chord quality
const CHORD_INTERVALS = {
  'I': { offset: 0, quality: 'major' },
  'i': { offset: 0, quality: 'minor' },
  'ii': { offset: 2, quality: 'minor' },
  'II': { offset: 2, quality: 'major' },
  'iii': { offset: 4, quality: 'minor' },
  'III': { offset: 4, quality: 'major' },
  'IV': { offset: 5, quality: 'major' },
  'iv': { offset: 5, quality: 'minor' },
  'V': { offset: 7, quality: 'major' },
  'v': { offset: 7, quality: 'minor' },
  'vi': { offset: 9, quality: 'minor' },
  'VI': { offset: 9, quality: 'major' },
  'vii': { offset: 11, quality: 'diminished' },
  'VII': { offset: 11, quality: 'major' },
};

// Base frequencies for notes (octave 2 for bass)
const BASE_FREQUENCIES = {
  'C': 65.41, 'C#': 69.30, 'D': 73.42, 'D#': 77.78,
  'E': 82.41, 'F': 87.31, 'F#': 92.50, 'G': 98.00,
  'G#': 103.83, 'A': 110.00, 'A#': 116.54, 'B': 123.47
};

export default function BackingTracks() {
  const [selectedKey, setSelectedKey] = useState('A');
  const [bpm, setBpm] = useState(100);
  const [style, setStyle] = useState('blues');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Tap tempo state
  const [tapTimes, setTapTimes] = useState([]);
  const tapTimeoutRef = useRef(null);

  // Audio refs
  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIDRef = useRef(null);

  // Get chord name from Roman numeral and key
  const getChordName = useCallback((romanNumeral, key) => {
    const interval = CHORD_INTERVALS[romanNumeral];
    if (!interval) return key;

    const keyIndex = NOTE_NAMES.indexOf(key);
    const chordRootIndex = (keyIndex + interval.offset) % 12;
    const chordRoot = NOTE_NAMES[chordRootIndex];

    const qualitySuffix = interval.quality === 'minor' ? 'm' :
                          interval.quality === 'diminished' ? 'dim' : '';

    return `${chordRoot}${qualitySuffix}`;
  }, []);

  // Get frequency for a chord root
  const getChordFrequency = useCallback((romanNumeral, key) => {
    const interval = CHORD_INTERVALS[romanNumeral];
    if (!interval) return BASE_FREQUENCIES[key];

    const keyIndex = NOTE_NAMES.indexOf(key);
    const chordRootIndex = (keyIndex + interval.offset) % 12;
    const chordRoot = NOTE_NAMES[chordRootIndex];

    return BASE_FREQUENCIES[chordRoot];
  }, []);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play a bass note
  const playBassNote = useCallback((frequency, time, duration, isDownbeat) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;

    // Louder on downbeat
    const noteVolume = isDownbeat ? volume : volume * 0.7;
    gainNode.gain.setValueAtTime(noteVolume, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration * 0.9);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }, [volume]);

  // Play a click/hi-hat sound
  const playClick = useCallback((time, isDownbeat) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = isDownbeat ? 1000 : 800;

    gainNode.gain.setValueAtTime(volume * 0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    oscillator.start(time);
    oscillator.stop(time + 0.05);
  }, [volume]);

  // Schedule a beat
  const scheduleBeat = useCallback((beatNumber, time) => {
    const progression = PROGRESSIONS[style];
    const beatsPerChord = progression.beatsPerChord;
    const totalBeats = progression.chords.length * beatsPerChord;

    const beatInProgression = beatNumber % totalBeats;
    const chordIndex = Math.floor(beatInProgression / beatsPerChord);
    const beatInChord = beatInProgression % beatsPerChord;
    const isDownbeat = beatInChord === 0;

    const romanNumeral = progression.chords[chordIndex];
    const frequency = getChordFrequency(romanNumeral, selectedKey);

    // Calculate beat duration
    const beatDuration = 60 / bpm;

    // Play bass note on beats 1 and 3 (half notes pattern)
    if (beatInChord === 0 || beatInChord === 2) {
      playBassNote(frequency, time, beatDuration * 1.5, isDownbeat);
    }

    // Play click on every beat
    playClick(time, isDownbeat);

    // Update visual state
    const audioContext = audioContextRef.current;
    const delay = Math.max(0, (time - audioContext.currentTime) * 1000);

    setTimeout(() => {
      setCurrentChordIndex(chordIndex);
      setCurrentBeat(beatInChord);
    }, delay);
  }, [style, selectedKey, bpm, getChordFrequency, playBassNote, playClick]);

  // Scheduler loop
  const scheduler = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const scheduleAheadTime = 0.1;
    const beatDuration = 60 / bpm;

    while (nextNoteTimeRef.current < audioContext.currentTime + scheduleAheadTime) {
      scheduleBeat(currentBeatRef.current, nextNoteTimeRef.current);
      nextNoteTimeRef.current += beatDuration;
      currentBeatRef.current++;
    }

    timerIDRef.current = setTimeout(scheduler, 25);
  }, [bpm, scheduleBeat]);

  // Start playback
  const start = useCallback(() => {
    const audioContext = initAudioContext();
    currentBeatRef.current = 0;
    setCurrentChordIndex(0);
    setCurrentBeat(0);
    nextNoteTimeRef.current = audioContext.currentTime;
    scheduler();
    setIsPlaying(true);
  }, [initAudioContext, scheduler]);

  // Stop playback
  const stop = useCallback(() => {
    if (timerIDRef.current) {
      clearTimeout(timerIDRef.current);
      timerIDRef.current = null;
    }
    setIsPlaying(false);
    setCurrentChordIndex(0);
    setCurrentBeat(0);
  }, []);

  // Toggle play/stop
  const togglePlay = () => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  };

  // Tap tempo
  const handleTap = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].slice(-4);
    setTapTimes(newTapTimes);

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      setTapTimes([]);
    }, 2000);

    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);
      setBpm(Math.max(40, Math.min(200, calculatedBpm)));
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stop();
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  const progression = PROGRESSIONS[style];
  const currentChord = progression.chords[currentChordIndex];
  const currentChordName = getChordName(currentChord, selectedKey);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Backing Tracks
        </h1>
        <p className="text-gray-400">
          Practice with chord progressions in any key
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-6">
        {/* Current Chord Display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-100 ${
              isPlaying && currentBeat === 0
                ? 'bg-orange-500 text-gray-900 scale-110 shadow-lg shadow-orange-500/50'
                : isPlaying
                  ? 'bg-gray-700 text-orange-400'
                  : 'bg-gray-700 text-gray-400'
            }`}>
              <span className="text-4xl font-bold">{isPlaying ? currentChordName : '–'}</span>
              <span className="text-sm mt-2">{isPlaying ? `Beat ${currentBeat + 1}` : 'Ready'}</span>
            </div>
            {isPlaying && currentBeat === 0 && (
              <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-75"></div>
            )}
          </div>
        </div>

        {/* Chord Progression Display */}
        {isPlaying && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {progression.chords.map((chord, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded font-mono transition-all ${
                  idx === currentChordIndex
                    ? 'bg-orange-500 text-gray-900 scale-110'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {getChordName(chord, selectedKey)}
              </div>
            ))}
          </div>
        )}

        {/* Key Selection */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Key</label>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {NOTE_NAMES.map(note => (
              <button
                key={note}
                onClick={() => setSelectedKey(note)}
                disabled={isPlaying}
                className={`py-3 px-2 rounded font-medium transition-all ${
                  selectedKey === note
                    ? 'bg-orange-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(PROGRESSIONS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setStyle(key)}
                disabled={isPlaying}
                className={`py-2 px-3 rounded text-sm transition-all ${
                  style === key
                    ? 'bg-orange-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{progression.name}</p>
        </div>

        {/* BPM Control */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Tempo (BPM)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="40"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              disabled={isPlaying}
            />
            <input
              type="number"
              min="40"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Math.max(40, Math.min(200, Number(e.target.value) || 40)))}
              className="w-20 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-center font-mono text-lg"
              disabled={isPlaying}
            />
          </div>
        </div>

        {/* Play/Stop and Tap Tempo */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`py-4 px-6 rounded-lg font-bold text-lg transition-all ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-gray-900'
            }`}
          >
            {isPlaying ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleTap}
            className="py-4 px-6 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPlaying}
          >
            Tap Tempo {tapTimes.length > 0 && `(${tapTimes.length})`}
          </button>
        </div>

        {/* Volume Control */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">Volume</label>
          <div className="flex items-center gap-4">
            <span className="text-2xl">-</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <span className="text-2xl">+</span>
            <span className="w-12 text-center font-mono text-sm">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3 text-orange-400">How to Use</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start">
            <span className="text-orange-400 mr-2">1.</span>
            <span><strong>Choose a key</strong> to practice in (e.g., A for blues, G for rock)</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-400 mr-2">2.</span>
            <span><strong>Select a style</strong> with different chord progressions</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-400 mr-2">3.</span>
            <span><strong>Set the tempo</strong> using the slider or tap tempo</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-400 mr-2">4.</span>
            <span><strong>Press Start</strong> and improvise over the progression!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
