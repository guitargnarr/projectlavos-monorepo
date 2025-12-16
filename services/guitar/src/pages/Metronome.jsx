import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Enhanced Metronome Component with Elite CSS
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

  // Get beat circle class
  const getBeatCircleClass = () => {
    if (!isPulsing) return 'metronome-beat-circle';
    return currentBeat === 0
      ? 'metronome-beat-circle downbeat'
      : 'metronome-beat-circle upbeat';
  };

  return (
    <div className="metronome-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="metronome-header">
          <h1 className="metronome-title">Metronome</h1>
          <p className="metronome-subtitle">
            Precise timing practice with visual feedback and tap tempo
          </p>
        </div>

        {/* Main Control Panel */}
        <div className="metronome-control-panel">
          {/* Visual Beat Indicator */}
          <div className="metronome-beat-container">
            <div className="relative">
              <div className={getBeatCircleClass()}>
                {isPlaying ? currentBeat + 1 : '–'}
              </div>
              {isPlaying && isPulsing && (
                <div className="metronome-beat-ring" style={{
                  color: currentBeat === 0 ? '#14b8a6' : '#f97316'
                }}></div>
              )}
            </div>
          </div>

          {/* BPM Control */}
          <div className="metronome-tempo-section">
            <label className="metronome-label">Tempo (BPM)</label>
            <div className="metronome-tempo-controls">
              <input
                type="range"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="metronome-slider"
                disabled={isPlaying}
              />
              <input
                type="number"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(Math.max(40, Math.min(240, Number(e.target.value) || 40)))}
                className="metronome-bpm-input"
                disabled={isPlaying}
              />
            </div>
          </div>

          {/* Play/Stop and Tap Tempo Buttons */}
          <div className="metronome-button-grid cols-2 mb-6">
            <button
              onClick={togglePlay}
              className={`metronome-button-start ${isPlaying ? 'active' : 'inactive'}`}
            >
              {isPlaying ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={handleTap}
              className="metronome-button-tap"
              disabled={isPlaying}
            >
              Tap Tempo {tapTimes.length > 0 && `(${tapTimes.length})`}
            </button>
          </div>

          {/* Time Signature */}
          <div className="mb-6">
            <label className="metronome-label">Time Signature</label>
            <div className="metronome-button-grid cols-6">
              {['2/4', '3/4', '4/4', '5/4', '6/8', '7/8'].map((sig) => (
                <button
                  key={sig}
                  onClick={() => setTimeSignature(sig)}
                  disabled={isPlaying}
                  className={`metronome-option-btn ${timeSignature === sig ? 'selected' : ''}`}
                >
                  {sig}
                </button>
              ))}
            </div>
          </div>

          {/* Subdivision */}
          <div className="mb-6">
            <label className="metronome-label">Subdivision</label>
            <div className="metronome-button-grid cols-3">
              {[
                { value: 'quarter', label: 'Quarter' },
                { value: 'eighth', label: 'Eighth' },
                { value: 'sixteenth', label: 'Sixteenth' },
              ].map((sub) => (
                <button
                  key={sub.value}
                  onClick={() => setSubdivision(sub.value)}
                  disabled={isPlaying}
                  className={`metronome-option-btn ${subdivision === sub.value ? 'selected-alt' : ''}`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Control */}
          <div className="metronome-volume-section">
            <label className="metronome-label">Volume</label>
            <div className="metronome-volume-controls">
              <span className="metronome-volume-icon">🔇</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="metronome-slider flex-1"
              />
              <span className="metronome-volume-icon">🔊</span>
              <span className="metronome-volume-value">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="metronome-instructions">
          <h2 className="metronome-instructions-title">How to Use</h2>
          <div className="metronome-instructions-list">
            <div className="metronome-instruction-item">
              <span className="metronome-instruction-bullet">•</span>
              <span><span className="metronome-instruction-teal">Set Tempo:</span> Use the slider or type a BPM value (40-240)</span>
            </div>
            <div className="metronome-instruction-item">
              <span className="metronome-instruction-bullet">•</span>
              <span><span className="metronome-instruction-teal">Tap Tempo:</span> Tap the button 2-4 times to set tempo by tapping the beat</span>
            </div>
            <div className="metronome-instruction-item">
              <span className="metronome-instruction-bullet">•</span>
              <span><span className="metronome-instruction-teal">Time Signature:</span> Choose your time signature (defaults to 4/4)</span>
            </div>
            <div className="metronome-instruction-item">
              <span className="metronome-instruction-bullet">•</span>
              <span><span className="metronome-instruction-teal">Subdivision:</span> Practice with quarter notes, eighth notes, or sixteenth notes</span>
            </div>
            <div className="metronome-instruction-item">
              <span className="metronome-instruction-bullet">•</span>
              <span><span className="metronome-instruction-highlight">Visual Feedback:</span> Teal pulse = downbeat, Orange pulse = other beats</span>
            </div>
            <div className="metronome-instruction-item">
              <span className="metronome-instruction-bullet">•</span>
              <span><span className="metronome-instruction-highlight">Audio:</span> High beep for downbeat, lower beep for other beats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
