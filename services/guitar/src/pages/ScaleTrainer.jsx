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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
          Scale Trainer
        </h1>
        <p className="text-gray-400">
          Practice scales with real-time pitch detection
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        {/* Root Note Selection */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Root Note</label>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {NOTE_NAMES.map((note, idx) => (
              <button
                key={note}
                onClick={() => setRootNote(idx)}
                disabled={isPracticing}
                className={`py-3 px-2 rounded font-medium transition-all ${
                  rootNote === idx
                    ? 'bg-teal-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Selection */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Scale</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {Object.entries(SCALES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setScaleType(key)}
                disabled={isPracticing}
                className={`py-2 px-3 rounded text-sm transition-all ${
                  scaleType === key
                    ? 'bg-teal-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>

        {/* Practice Mode */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Practice Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {PRACTICE_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setPracticeMode(mode.id)}
                disabled={isPracticing}
                className={`py-2 px-3 rounded text-sm transition-all ${
                  practiceMode === mode.id
                    ? 'bg-cyan-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`py-4 px-6 rounded-lg font-bold text-lg transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-teal-500 hover:bg-teal-600 text-gray-900'
            }`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <button
            onClick={startPractice}
            disabled={!isListening || isPracticing}
            className="py-4 px-6 bg-cyan-500 hover:bg-cyan-600 text-gray-900 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPracticing ? 'Practicing...' : 'Start Practice'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Practice Display */}
      {isPracticing && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-400 mb-2">Play this note:</div>
            <div className={`text-6xl font-bold mb-2 transition-all ${
              lastResult === 'correct' ? 'text-green-400 scale-110' :
              lastResult === 'incorrect' ? 'text-red-400' :
              'text-teal-400'
            }`}>
              {NOTE_NAMES[targetNote]}
            </div>
            {detectedNote !== null && (
              <div className="text-lg text-gray-400">
                You played: <span className={detectedNote === targetNote ? 'text-green-400' : 'text-red-400'}>
                  {NOTE_NAMES[detectedNote]}
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mb-4">
            {sequence.map((note, idx) => (
              <div
                key={idx}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  idx < currentNoteIndex
                    ? 'bg-green-500 text-gray-900'
                    : idx === currentNoteIndex
                      ? 'bg-teal-500 text-gray-900 scale-110'
                      : 'bg-gray-700 text-gray-400'
                }`}
              >
                {NOTE_NAMES[note]}
              </div>
            ))}
          </div>

          {/* Score */}
          <div className="text-center">
            <span className="text-2xl font-bold text-green-400">{score.correct}</span>
            <span className="text-gray-400"> / {score.total} correct</span>
          </div>
        </div>
      )}

      {/* Fretboard Display */}
      <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
        <h3 className="text-xl font-bold mb-4 text-teal-400">
          {NOTE_NAMES[rootNote]} {scale.name} Scale
        </h3>
        <div className="min-w-max">
          {/* Fret numbers */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {[...Array(13)].map((_, i) => (
              <div key={i} className="w-14 text-center text-sm text-gray-500">{i}</div>
            ))}
          </div>

          {/* Strings */}
          {TUNING.slice().reverse().map((stringNote, stringIdx) => (
            <div key={stringIdx} className="flex items-center mb-1">
              <div className="w-12 text-sm font-medium text-gray-400">{stringNote}</div>
              {[...Array(13)].map((_, fret) => {
                const noteIndex = getNoteAtFret(stringNote, fret);
                const inScale = scaleNotes.includes(noteIndex);
                const isRoot = noteIndex === rootNote;
                const isTarget = isPracticing && noteIndex === targetNote;

                return (
                  <div
                    key={fret}
                    className="w-14 h-10 border border-gray-700 flex items-center justify-center relative"
                  >
                    {inScale && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isTarget
                          ? 'bg-yellow-400 text-gray-900 animate-pulse'
                          : isRoot
                            ? 'bg-teal-500 text-gray-900'
                            : 'bg-cyan-500 text-gray-900'
                      }`}>
                        {NOTE_NAMES[noteIndex]}
                      </div>
                    )}
                    {[3, 5, 7, 9, 12].includes(fret) && !inScale && (
                      <div className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-teal-500"></div>
            <span>Root Note</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
            <span>Scale Notes</span>
          </div>
          {isPracticing && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span>Target Note</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-3 text-teal-400">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Select a root note and scale type</li>
          <li>Choose a practice mode (ascending, descending, or random)</li>
          <li>Click &quot;Start Listening&quot; to enable microphone</li>
          <li>Click &quot;Start Practice&quot; to begin</li>
          <li>Play each highlighted note on your guitar</li>
          <li>The trainer detects your pitch and tracks your score!</li>
        </ol>
      </div>
    </div>
  );
}
