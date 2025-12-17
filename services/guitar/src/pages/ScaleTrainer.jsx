import { useState, useEffect, useRef, useCallback } from 'react';
import { NOTE_NAMES, SCALE_INFO } from '../lib/guitarTheory.js';
import GuitarSynthesizer from '../lib/GuitarSynthesizer';

// Use SCALE_INFO from guitarTheory.js - now has all 12 scales
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

// Scale examples with famous songs and use cases
const SCALE_EXAMPLES = [
  {
    scale: 'pentatonic_minor',
    name: 'Minor Pentatonic',
    genre: 'Rock/Blues',
    description: 'The most essential scale for rock and blues guitar. Five notes that always sound good over minor and dominant 7th chords.',
    songs: ['Stairway to Heaven - Led Zeppelin', 'Back in Black - AC/DC', 'Voodoo Child - Jimi Hendrix']
  },
  {
    scale: 'blues',
    name: 'Blues Scale',
    genre: 'Blues/Rock',
    description: 'Minor pentatonic with an added "blue note" (b5). Creates that classic bluesy, gritty sound.',
    songs: ['The Thrill Is Gone - B.B. King', 'Pride and Joy - Stevie Ray Vaughan', 'Crossroads - Cream']
  },
  {
    scale: 'major',
    name: 'Major Scale',
    genre: 'Pop/Country',
    description: 'The foundation of Western music. Bright, happy sound. Essential for understanding all other scales and modes.',
    songs: ['Let It Be - Beatles', 'Sweet Home Alabama - Lynyrd Skynyrd', 'Wonderful Tonight - Eric Clapton']
  },
  {
    scale: 'minor',
    name: 'Natural Minor',
    genre: 'Rock/Metal',
    description: 'Sad, melancholic sound. The relative minor of the major scale. Foundation for many metal riffs.',
    songs: ['Nothing Else Matters - Metallica', 'Stairway to Heaven - Led Zeppelin', 'Hotel California - Eagles']
  },
  {
    scale: 'dorian',
    name: 'Dorian Mode',
    genre: 'Jazz/Funk',
    description: 'Minor scale with a raised 6th. Creates a sophisticated, jazzy minor sound. Great for minor 7th chords.',
    songs: ['So What - Miles Davis', 'Oye Como Va - Santana', 'Another Brick in the Wall - Pink Floyd']
  },
  {
    scale: 'phrygian',
    name: 'Phrygian Mode',
    genre: 'Metal/Flamenco',
    description: 'Dark, Spanish/Middle Eastern flavor. The b2 interval creates tension and drama. Popular in thrash metal.',
    songs: ['War - Joe Satriani', 'Wherever I May Roam - Metallica', 'Hangar 18 - Megadeth']
  },
  {
    scale: 'mixolydian',
    name: 'Mixolydian Mode',
    genre: 'Rock/Blues',
    description: 'Major scale with a b7. Perfect for dominant 7th chords. Creates that classic rock swagger.',
    songs: ['Sweet Child O\' Mine - Guns N\' Roses', 'Sympathy for the Devil - Rolling Stones', 'Norwegian Wood - Beatles']
  },
  {
    scale: 'harmonic_minor',
    name: 'Harmonic Minor',
    genre: 'Classical/Metal',
    description: 'Natural minor with a raised 7th. Creates dramatic, exotic sound. Essential for neoclassical shred.',
    songs: ['Mr. Crowley - Ozzy Osbourne', 'Far Beyond the Sun - Yngwie Malmsteen', 'Gates of Babylon - Rainbow']
  },
  {
    scale: 'lydian',
    name: 'Lydian Mode',
    genre: 'Fusion/Progressive',
    description: 'Major scale with a #4. Dreamy, floating quality. Popular in film scores and progressive rock.',
    songs: ['Flying in a Blue Dream - Joe Satriani', 'Freewill - Rush', 'The Simpsons Theme']
  },
  {
    scale: 'locrian',
    name: 'Locrian Mode',
    genre: 'Jazz/Experimental',
    description: 'The darkest mode with a diminished quality. Rarely used as a key center but essential for diminished chords.',
    songs: ['Dust to Dust - John Kirkpatrick', 'Army of Me - Bjork', 'YYZ - Rush (bridge)']
  },
  {
    scale: 'pentatonic_major',
    name: 'Major Pentatonic',
    genre: 'Country/Pop',
    description: 'Five-note scale with a bright, happy sound. Country music staple. Great for major chord progressions.',
    songs: ['My Girl - Temptations', 'Honky Tonk Women - Rolling Stones', 'Centerfold - J. Geils Band']
  },
  {
    scale: 'melodic_minor',
    name: 'Melodic Minor',
    genre: 'Jazz/Fusion',
    description: 'Minor scale with raised 6th and 7th. Sophisticated jazz sound. Parent scale of many advanced modes.',
    songs: ['Donna Lee - Charlie Parker', 'Spain - Chick Corea', 'Black Market - Weather Report']
  }
];

export default function ScaleTrainer() {
  const [rootNote, setRootNote] = useState(0); // Index in NOTE_NAMES
  const [scaleType, setScaleType] = useState('pentatonic_minor');
  const [practiceMode, setPracticeMode] = useState('ascending');
  const [isListening, setIsListening] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [lastResult, setLastResult] = useState(null);
  const [detectedNote, setDetectedNote] = useState(null);
  const [error, setError] = useState(null);
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const [playingPosition, setPlayingPosition] = useState(null); // {string, fret}

  // Audio refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const synthRef = useRef(null);
  const [synthReady, setSynthReady] = useState(false);
  const [synthLoading, setSynthLoading] = useState(false);

  // Lazy load synthesizer - only when user wants to play
  const ensureSynthReady = async () => {
    if (synthRef.current && synthReady) return true;
    if (synthLoading) return false;

    setSynthLoading(true);
    try {
      synthRef.current = new GuitarSynthesizer();
      const success = await synthRef.current.loadInstrument();
      setSynthReady(success);
      setSynthLoading(false);
      return success;
    } catch (err) {
      console.error('Failed to load synth:', err);
      setSynthLoading(false);
      return false;
    }
  };

  // Generate proper scale fingering pattern (box position)
  const generateScalePattern = () => {
    const scaleNotes = getScaleNotes();
    // String open notes (note index): E=4, A=9, D=2, G=7, B=11, E=4
    const stringOpenNotes = [4, 9, 2, 7, 11, 4];

    // Find root note position on low E string (E = note index 4)
    // This gives us fret 0-11 where the root note appears
    let startFret = (rootNote - 4 + 12) % 12;

    // For roots that would start high (fret 8+), use open position instead
    if (startFret >= 8) startFret = 0;

    const pattern = [];

    // Go through each string from low E (0) to high E (5)
    for (let stringIdx = 0; stringIdx <= 5; stringIdx++) {
      const openNote = stringOpenNotes[stringIdx];

      // Find scale notes playable on this string within the position (startFret to startFret+4)
      for (let fret = startFret; fret <= startFret + 4; fret++) {
        if (fret < 0 || fret > 12) continue;
        const noteAtFret = (openNote + fret) % 12;

        if (scaleNotes.includes(noteAtFret)) {
          pattern.push({ string: stringIdx, fret, note: noteAtFret });
        }
      }
    }

    // Sort by string then fret for proper ascending order
    pattern.sort((a, b) => {
      if (a.string !== b.string) return a.string - b.string;
      return a.fret - b.fret;
    });

    return pattern;
  };

  // Play a note at specific position
  // GuitarSynthesizer uses reversed string order (0=high E), pattern uses (0=low E)
  const playNoteAtPosition = (stringIdx, fret) => {
    if (!synthRef.current || !synthReady) return;
    const synthStringIdx = 5 - stringIdx; // Convert to synth's reversed order
    synthRef.current.playNote(synthStringIdx, fret, 1.0);
  };

  // Play entire scale with animation - proper fingering pattern (ascending only)
  const playScale = async () => {
    if (isPlayingScale || synthLoading) return;

    // Lazy load synth on first play
    const ready = await ensureSynthReady();
    if (!ready) return;

    const pattern = generateScalePattern();
    if (pattern.length === 0) return;

    setIsPlayingScale(true);

    // Play ascending only
    for (let i = 0; i < pattern.length; i++) {
      const pos = pattern[i];
      setPlayingPosition({ string: pos.string, fret: pos.fret });
      playNoteAtPosition(pos.string, pos.fret);
      await new Promise(resolve => setTimeout(resolve, 450));
    }

    setPlayingPosition(null);
    setIsPlayingScale(false);
  };

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
        for (let i = seq.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [seq[i], seq[j]] = [seq[j], seq[i]];
        }
        break;
      default:
        break;
    }

    return seq;
  }, [getScaleNotes, practiceMode]);

  // Autocorrelation for pitch detection
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

  // Convert frequency to note index
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

        const targetNote = sequence[currentNoteIndex];
        if (noteIndex === targetNote) {
          setLastResult('correct');
          setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));

          if (currentNoteIndex < sequence.length - 1) {
            setTimeout(() => {
              setCurrentNoteIndex(prev => prev + 1);
              setLastResult(null);
              setDetectedNote(null);
            }, 500);
          } else {
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
    try {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (microphoneRef.current) {
        microphoneRef.current.getTracks().forEach(track => {
          try { track.stop(); } catch (e) { /* ignore */ }
        });
        microphoneRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      audioContextRef.current = null;
      analyserRef.current = null;

      // Reset all related state
      setIsListening(false);
      setIsPracticing(false);
      setDetectedNote(null);
      setCurrentNoteIndex(0);
      setLastResult(null);
      setError(null);
    } catch (err) {
      console.error('Error stopping listener:', err);
      // Force state reset even on error
      setIsListening(false);
      setIsPracticing(false);
    }
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
  const getNoteClass = (noteIndex, isRoot, isTarget, stringIdx, fret) => {
    const isPlaying = playingPosition &&
      playingPosition.string === stringIdx &&
      playingPosition.fret === fret;
    if (isPlaying) return 'scale-trainer-note-dot playing';
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

  // Get current scale example
  const currentExample = SCALE_EXAMPLES.find(ex => ex.scale === scaleType);

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
              onClick={playScale}
              disabled={isPlayingScale || synthLoading}
              className="scale-trainer-play-scale-btn"
            >
              {synthLoading ? 'Loading...' : isPlayingScale ? 'Playing...' : 'Play Scale'}
            </button>
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
              <button
                onClick={() => playReferenceNote(targetNote)}
                disabled={!synthReady}
                className="scale-trainer-play-ref-btn"
                title="Hear the target note"
              >
                {synthReady ? 'Hear Note' : 'Loading...'}
              </button>
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

                    // Convert display stringIdx back to TUNING index (reversed)
                    const tuningIdx = 5 - stringIdx;
                    return (
                      <div key={fret} className="scale-trainer-fret">
                        {inScale && (
                          <div className={getNoteClass(noteIndex, isRoot, isTarget, tuningIdx, fret)}>
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

        {/* Current Scale Info */}
        {currentExample && (
          <div className="scale-trainer-panel">
            <div className="scale-trainer-example-header">
              <h3 className="scale-trainer-example-scale">{currentExample.name}</h3>
              <span className="scale-trainer-example-genre">{currentExample.genre}</span>
            </div>
            <p className="scale-trainer-example-description">{currentExample.description}</p>
            <div className="scale-trainer-example-songs">
              <div className="scale-trainer-example-songs-label">Famous Songs</div>
              <div className="scale-trainer-example-song-list">
                {currentExample.songs.map((song, idx) => (
                  <span key={idx} className="scale-trainer-example-song">{song}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scale Examples Library */}
        <div className="scale-trainer-examples">
          <h2 className="scale-trainer-examples-title">Scale Reference Library</h2>
          <p className="scale-trainer-examples-subtitle">
            Explore different scales and discover the songs that use them
          </p>
          <div className="scale-trainer-examples-grid">
            {SCALE_EXAMPLES.map((example) => (
              <div
                key={example.scale}
                className={`scale-trainer-example-card ${scaleType === example.scale ? 'ring-2 ring-teal-500' : ''}`}
                onClick={() => setScaleType(example.scale)}
                style={{ cursor: 'pointer' }}
              >
                <div className="scale-trainer-example-header">
                  <span className="scale-trainer-example-scale">{example.name}</span>
                  <span className="scale-trainer-example-genre">{example.genre}</span>
                </div>
                <p className="scale-trainer-example-description">{example.description}</p>
                <div className="scale-trainer-example-songs">
                  <div className="scale-trainer-example-songs-label">Famous Songs</div>
                  <div className="scale-trainer-example-song-list">
                    {example.songs.slice(0, 2).map((song, idx) => (
                      <span key={idx} className="scale-trainer-example-song">{song}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
