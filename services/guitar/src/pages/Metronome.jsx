import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Enhanced Metronome Component
 *
 * Features:
 * - BPM control (40-240) via slider and numeric input
 * - Tap tempo (tap 4x to set BPM)
 * - Time signatures (2/4, 3/4, 4/4, 5/4, 6/8, 7/8)
 * - Subdivisions (quarter, eighth, sixteenth notes)
 * - Volume control
 * - Visual feedback with animated pulse
 * - Web Audio API for precise timing
 * - localStorage persistence
 */
export default function Metronome() {
  // Load settings from localStorage
  const loadSettings = () => {
    const saved = localStorage.getItem('guitar-metronome-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load metronome settings:', e);
      }
    }
    return {
      bpm: 120,
      timeSignature: '4/4',
      subdivision: 'quarter',
      volume: 0.5,
    };
  };

  const [bpm, setBpm] = useState(loadSettings().bpm);
  const [timeSignature, setTimeSignature] = useState(loadSettings().timeSignature);
  const [subdivision, setSubdivision] = useState(loadSettings().subdivision);
  const [volume, setVolume] = useState(loadSettings().volume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  // Tap tempo state
  const [tapTimes, setTapTimes] = useState([]);
  const tapTimeoutRef = useRef(null);

  // Web Audio API refs
  const audioContextRef = useRef(null);
  const nextNoteTimeRef = useRef(0.0);
  const currentBeatRef = useRef(0);
  const timerIDRef = useRef(null);

  // Save settings to localStorage
  useEffect(() => {
    const settings = { bpm, timeSignature, subdivision, volume };
    localStorage.setItem('guitar-metronome-settings', JSON.stringify(settings));
  }, [bpm, timeSignature, subdivision, volume]);

  // Get beats per measure from time signature
  const getBeatsPerMeasure = useCallback(() => {
    const [beats] = timeSignature.split('/').map(Number);
    return beats;
  }, [timeSignature]);

  // Get subdivision multiplier
  const getSubdivisionMultiplier = useCallback(() => {
    switch (subdivision) {
      case 'eighth':
        return 2;
      case 'sixteenth':
        return 4;
      default:
        return 1;
    }
  }, [subdivision]);

  // Calculate interval in seconds
  const getInterval = useCallback(() => {
    const beatsPerSecond = bpm / 60;
    const subdivisionMultiplier = getSubdivisionMultiplier();
    return 1 / (beatsPerSecond * subdivisionMultiplier);
  }, [bpm, getSubdivisionMultiplier]);

  // Initialize Web Audio API
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play beep using Web Audio API
  const playBeep = useCallback((isDownbeat) => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Higher frequency for downbeat, lower for other beats
    oscillator.frequency.value = isDownbeat ? 1000 : 800;
    oscillator.type = 'sine';

    // Apply volume
    gainNode.gain.value = volume;

    const now = audioContext.currentTime;
    oscillator.start(now);

    // Quick fade out for crisp beep
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    oscillator.stop(now + 0.05);
  }, [volume, initAudioContext]);

  // Schedule next note
  const scheduleNote = useCallback((beatNumber, time) => {
    const beatsPerMeasure = getBeatsPerMeasure();
    const subdivisionMultiplier = getSubdivisionMultiplier();

    // Determine if this is a downbeat (first beat of measure)
    const isDownbeat = beatNumber % (beatsPerMeasure * subdivisionMultiplier) === 0;

    // Schedule the beep
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = isDownbeat ? 1000 : 800;
    oscillator.type = 'sine';
    gainNode.gain.value = volume;

    oscillator.start(time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    oscillator.stop(time + 0.05);

    // Update visual beat counter (only on main beats, not subdivisions)
    if (subdivision === 'quarter' || beatNumber % subdivisionMultiplier === 0) {
      const displayBeat = Math.floor(beatNumber / subdivisionMultiplier) % beatsPerMeasure;
      setTimeout(() => {
        setCurrentBeat(displayBeat);
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 100);
      }, (time - audioContext.currentTime) * 1000);
    }
  }, [getBeatsPerMeasure, getSubdivisionMultiplier, subdivision, volume]);

  // Scheduler that runs frequently to schedule notes in advance
  const scheduler = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // Schedule notes 100ms in advance
    const scheduleAheadTime = 0.1;

    while (nextNoteTimeRef.current < audioContext.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, nextNoteTimeRef.current);

      // Advance to next note
      const interval = getInterval();
      nextNoteTimeRef.current += interval;
      currentBeatRef.current++;
    }

    timerIDRef.current = setTimeout(scheduler, 25);
  }, [scheduleNote, getInterval]);

  // Start metronome
  const start = useCallback(() => {
    const audioContext = initAudioContext();

    // Reset beat counter
    currentBeatRef.current = 0;
    setCurrentBeat(0);

    // Initialize timing
    nextNoteTimeRef.current = audioContext.currentTime;

    // Start scheduler
    scheduler();
    setIsPlaying(true);
  }, [initAudioContext, scheduler]);

  // Stop metronome
  const stop = useCallback(() => {
    if (timerIDRef.current) {
      clearTimeout(timerIDRef.current);
      timerIDRef.current = null;
    }
    setIsPlaying(false);
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
    const newTapTimes = [...tapTimes, now].slice(-4); // Keep last 4 taps
    setTapTimes(newTapTimes);

    // Clear previous timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // Reset tap times after 2 seconds of inactivity
    tapTimeoutRef.current = setTimeout(() => {
      setTapTimes([]);
    }, 2000);

    // Calculate BPM if we have at least 2 taps
    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);

      // Clamp to valid range
      const clampedBpm = Math.max(40, Math.min(240, calculatedBpm));
      setBpm(clampedBpm);
    }
  };

  // Cleanup on unmount
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

  const beatsPerMeasure = getBeatsPerMeasure();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Metronome
        </h1>
        <p className="text-gray-400">
          Precise timing practice with visual feedback and tap tempo
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-6">
        {/* Visual Beat Indicator */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className={`w-48 h-48 rounded-full flex items-center justify-center text-6xl font-bold transition-all duration-100 ${
                isPulsing
                  ? currentBeat === 0
                    ? 'bg-green-500 text-gray-900 scale-110 shadow-lg shadow-green-500/50'
                    : 'bg-blue-500 text-gray-900 scale-110 shadow-lg shadow-blue-500/50'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {isPlaying ? currentBeat + 1 : '–'}
            </div>
            {isPlaying && (
              <div className={`absolute inset-0 rounded-full border-4 ${
                currentBeat === 0 ? 'border-green-400' : 'border-blue-400'
              } animate-ping opacity-75`}></div>
            )}
          </div>
        </div>

        {/* BPM Control */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">
            Tempo (BPM)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              disabled={isPlaying}
            />
            <input
              type="number"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(Math.max(40, Math.min(240, Number(e.target.value) || 40)))}
              className="w-20 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-center font-mono text-lg"
              disabled={isPlaying}
            />
          </div>
        </div>

        {/* Play/Stop and Tap Tempo Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`py-4 px-6 rounded-lg font-bold text-lg transition-all ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-gray-900'
            }`}
          >
            {isPlaying ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleTap}
            className="py-4 px-6 bg-blue-500 hover:bg-blue-600 text-gray-900 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPlaying}
          >
            Tap Tempo {tapTimes.length > 0 && `(${tapTimes.length})`}
          </button>
        </div>

        {/* Time Signature */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">
            Time Signature
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {['2/4', '3/4', '4/4', '5/4', '6/8', '7/8'].map((sig) => (
              <button
                key={sig}
                onClick={() => setTimeSignature(sig)}
                disabled={isPlaying}
                className={`py-2 px-4 rounded font-mono transition-all ${
                  timeSignature === sig
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {sig}
              </button>
            ))}
          </div>
        </div>

        {/* Subdivision */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">
            Subdivision
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'quarter', label: 'Quarter ♩' },
              { value: 'eighth', label: 'Eighth ♪' },
              { value: 'sixteenth', label: 'Sixteenth 𝅘𝅥𝅯' },
            ].map((sub) => (
              <button
                key={sub.value}
                onClick={() => setSubdivision(sub.value)}
                disabled={isPlaying}
                className={`py-2 px-4 rounded transition-all ${
                  subdivision === sub.value
                    ? 'bg-blue-500 text-gray-900'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">
            Volume
          </label>
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔇</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-2xl">🔊</span>
            <span className="w-12 text-center font-mono text-sm">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3 text-green-400">How to Use</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">•</span>
            <span><strong>Set Tempo:</strong> Use the slider or type a BPM value (40-240)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">•</span>
            <span><strong>Tap Tempo:</strong> Tap the button 2-4 times to set tempo by tapping the beat</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">•</span>
            <span><strong>Time Signature:</strong> Choose your time signature (defaults to 4/4)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">•</span>
            <span><strong>Subdivision:</strong> Practice with quarter notes, eighth notes, or sixteenth notes</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">•</span>
            <span><strong>Visual Feedback:</strong> Green pulse = downbeat, Blue pulse = other beats</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">•</span>
            <span><strong>Audio:</strong> High beep for downbeat, lower beep for other beats</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
