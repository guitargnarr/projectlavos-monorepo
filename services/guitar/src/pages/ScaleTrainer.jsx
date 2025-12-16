import { useState, useEffect, useRef, useCallback } from 'react';
import { NOTE_NAMES, SCALE_INFO } from '../lib/guitarTheory.js';

// Use SCALE_INFO from guitarTheory.js - now has all 12 scales:
// major, minor, pentatonic_major, pentatonic_minor, blues, phrygian,
// lydian, mixolydian, dorian, locrian, harmonic_minor, melodic_minor
const SCALES = SCALE_INFO;

const PRACTICE_MODES = [
  { id: 'ascending', name: 'Ascending', description: 'Play scale from low to high' },
  { id: 'descending', name: 'Descending', description: 'Play scale from high to low' },
  { id: 'random', name: 'Random', description: 'Notes appear in random order' },
];

// Standard tuning for fretboard display
const TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

// Base frequency for A4
const A4_FREQUENCY = 440;

export default function ScaleTrainer() {
  const [rootNote, setRootNote] = useState(0); // Index in NOTE_NAMES
  const [scaleType, setScaleType] = useState('pentatonic_minor');
  const [practiceMode, setPracticeMode] = useState('ascending');
  const [isListening, setIsListening] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [lastResult, setLastResult] = useState(null); // 'correct', 'incorrect', null
  const [detectedNote, setDetectedNote] = useState(null);
  const [error, setError] = useState(null);

  // Audio refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Practice sequence
  const [sequence, setSequence] = useState([]);

  // Generate scale notes
  const getScaleNotes = useCallback(() => {
    const scale = SCALES[scaleType];
    return scale.intervals.map(interval => (rootNote + interval) % 12);
  }, [rootNote, scaleType]);

  // Generate practice sequence
  const generateSequence = useCallback(() => {
    const notes = getScaleNotes();
    let seq = [...notes];

    switch (practiceMode) {
      case 'descending':
        seq = seq.reverse();
        break;
      case 'random':
        // Fisher-Yates shuffle
        for (let i = seq.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [seq[i], seq[j]] = [seq[j], seq[i]];
        }
        break;
      default: // ascending
        break;
    }

    return seq;
  }, [getScaleNotes, practiceMode]);

  // Autocorrelation for pitch detection (from Tuner)
  const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

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
  };

  // Convert frequency to note index (0-11)
  const frequencyToNoteIndex = (frequency) => {
    if (frequency <= 0) return -1;
    const noteNum = 12 * Math.log2(frequency / A4_FREQUENCY) + 69;
    return Math.round(noteNum) % 12;
  };

  // Pitch detection loop
  const detectPitch = useCallback(() => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;

    if (!analyser || !audioContext || !isPracticing) return;

    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, audioContext.sampleRate);

    if (frequency > 0) {
      const noteIndex = frequencyToNoteIndex(frequency);
      if (noteIndex >= 0) {
        setDetectedNote(noteIndex);

        // Check if it matches the target note
        const targetNote = sequence[currentNoteIndex];
        if (noteIndex === targetNote) {
          setLastResult('correct');
          setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));

          // Move to next note
          if (currentNoteIndex < sequence.length - 1) {
            setTimeout(() => {
              setCurrentNoteIndex(prev => prev + 1);
              setLastResult(null);
              setDetectedNote(null);
            }, 500);
          } else {
            // Sequence complete
            setTimeout(() => {
              setIsPracticing(false);
              setLastResult(null);
            }, 1000);
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  }, [isPracticing, sequence, currentNoteIndex]);

  // Start listening
  const startListening = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = stream;

      setIsListening(true);
    } catch (err) {
      setError('Microphone access denied. Please grant permission.');
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    microphoneRef.current = null;

    setIsListening(false);
    setIsPracticing(false);
    setDetectedNote(null);
  };

  // Start practice session
  const startPractice = () => {
    const seq = generateSequence();
    setSequence(seq);
    setCurrentNoteIndex(0);
    setScore({ correct: 0, total: 0 });
    setLastResult(null);
    setDetectedNote(null);
    setIsPracticing(true);
  };

  // Start pitch detection when practicing
  useEffect(() => {
    if (isPracticing && isListening) {
      detectPitch();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPracticing, isListening, detectPitch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopListening();
  }, []);

  const scaleNotes = getScaleNotes();
  const targetNote = sequence[currentNoteIndex];
  const scale = SCALES[scaleType];

  // Get note at fret for fretboard display
  const getNoteAtFret = (stringNote, fret) => {
    const stringIndex = NOTE_NAMES.indexOf(stringNote);
    return (stringIndex + fret) % 12;
  };

  // Get note class for fretboard
  const getNoteClass = (noteIndex, isRoot, isTarget) => {
    if (isTarget) return 'scale-trainer-note-dot target';
    if (isRoot) return 'scale-trainer-note-dot root';
    return 'scale-trainer-note-dot scale';
  };

  // Get progress note class
  const getProgressClass = (idx) => {
    if (idx < currentNoteIndex) return 'scale-trainer-progress-note completed';
    if (idx === currentNoteIndex) return 'scale-trainer-progress-note current';
    return 'scale-trainer-progress-note';
  };

  // Get target note class
  const getTargetClass = () => {
    if (lastResult === 'correct') return 'scale-trainer-target-note correct';
    if (lastResult === 'incorrect') return 'scale-trainer-target-note incorrect';
    return 'scale-trainer-target-note';
  };

  return (
    <div className="scale-trainer-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="scale-trainer-header">
          <h1 className="scale-trainer-title">Scale Trainer</h1>
          <p className="scale-trainer-subtitle">
            Practice scales with real-time pitch detection
          </p>
        </div>

        {/* Control Panel */}
        <div className="scale-trainer-panel">
          {/* Root Note Selection */}
          <div className="mb-6">
            <label className="scale-trainer-label">Root Note</label>
            <div className="scale-trainer-note-grid">
              {NOTE_NAMES.map((note, idx) => (
                <button
                  key={note}
                  onClick={() => setRootNote(idx)}
                  disabled={isPracticing}
                  className={`scale-trainer-note-btn ${rootNote === idx ? 'selected' : ''}`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Selection */}
          <div className="mb-6">
            <label className="scale-trainer-label">Scale</label>
            <div className="scale-trainer-scale-grid">
              {Object.entries(SCALES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setScaleType(key)}
                  disabled={isPracticing}
                  className={`scale-trainer-scale-btn ${scaleType === key ? 'selected' : ''}`}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Mode */}
          <div className="mb-6">
            <label className="scale-trainer-label">Practice Mode</label>
            <div className="scale-trainer-mode-grid">
              {PRACTICE_MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setPracticeMode(mode.id)}
                  disabled={isPracticing}
                  className={`scale-trainer-mode-btn ${practiceMode === mode.id ? 'selected' : ''}`}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="scale-trainer-action-grid">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`scale-trainer-listen-btn ${isListening ? 'active' : ''}`}
            >
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            <button
              onClick={startPractice}
              disabled={!isListening || isPracticing}
              className="scale-trainer-practice-btn"
            >
              {isPracticing ? 'Practicing...' : 'Start Practice'}
            </button>
          </div>

          {error && (
            <div className="scale-trainer-error">
              {error}
            </div>
          )}
        </div>

        {/* Practice Display */}
        {isPracticing && (
          <div className="scale-trainer-panel">
            <div className="scale-trainer-practice-display">
              <div className="scale-trainer-target-label">Play this note:</div>
              <div className={getTargetClass()}>
                {NOTE_NAMES[targetNote]}
              </div>
              {detectedNote !== null && (
                <div className="scale-trainer-detected">
                  You played: <span className={detectedNote === targetNote ? 'match' : 'no-match'}>
                    {NOTE_NAMES[detectedNote]}
                  </span>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="scale-trainer-progress">
              {sequence.map((note, idx) => (
                <div
                  key={idx}
                  className={getProgressClass(idx)}
                >
                  {NOTE_NAMES[note]}
                </div>
              ))}
            </div>

            {/* Score */}
            <div className="scale-trainer-score">
              <span className="scale-trainer-score-value">{score.correct}</span>
              <span className="scale-trainer-score-total"> / {score.total} correct</span>
            </div>
          </div>
        )}

        {/* Fretboard Display */}
        <div className="scale-trainer-panel">
          <div className="scale-trainer-fretboard">
            <h3 className="scale-trainer-fretboard-title">
              {NOTE_NAMES[rootNote]} {scale.name} Scale
            </h3>
            <div className="scale-trainer-fretboard-content">
              {/* Fret numbers */}
              <div className="scale-trainer-fret-numbers">
                <div className="scale-trainer-fret-label"></div>
                {[...Array(13)].map((_, i) => (
                  <div key={i} className="scale-trainer-fret-num">{i}</div>
                ))}
              </div>

              {/* Strings */}
              {TUNING.slice().reverse().map((stringNote, stringIdx) => (
                <div key={stringIdx} className="scale-trainer-string">
                  <div className="scale-trainer-string-label">{stringNote}</div>
                  {[...Array(13)].map((_, fret) => {
                    const noteIndex = getNoteAtFret(stringNote, fret);
                    const inScale = scaleNotes.includes(noteIndex);
                    const isRoot = noteIndex === rootNote;
                    const isTarget = isPracticing && noteIndex === targetNote;

                    return (
                      <div key={fret} className="scale-trainer-fret">
                        {inScale && (
                          <div className={getNoteClass(noteIndex, isRoot, isTarget)}>
                            {NOTE_NAMES[noteIndex]}
                          </div>
                        )}
                        {[3, 5, 7, 9, 12].includes(fret) && !inScale && (
                          <div className="scale-trainer-fret-marker"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="scale-trainer-legend">
              <div className="scale-trainer-legend-item">
                <div className="scale-trainer-legend-dot root"></div>
                <span>Root Note</span>
              </div>
              <div className="scale-trainer-legend-item">
                <div className="scale-trainer-legend-dot scale"></div>
                <span>Scale Notes</span>
              </div>
              {isPracticing && (
                <div className="scale-trainer-legend-item">
                  <div className="scale-trainer-legend-dot target"></div>
                  <span>Target Note</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="scale-trainer-instructions">
          <h2 className="scale-trainer-instructions-title">How to Use</h2>
          <ol className="scale-trainer-instructions-list">
            <li>Select a root note and scale type</li>
            <li>Choose a practice mode (ascending, descending, or random)</li>
            <li>Click &quot;Start Listening&quot; to enable microphone</li>
            <li>Click &quot;Start Practice&quot; to begin</li>
            <li>Play each highlighted note on your guitar</li>
            <li>The trainer detects your pitch and tracks your score!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
