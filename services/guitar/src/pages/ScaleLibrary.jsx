import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

// Scale definitions with intervals and formulas
const SCALES = {
  'major': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: 'W-W-H-W-W-W-H',
    name: 'Major (Ionian)',
    degrees: ['1', '2', '3', '4', '5', '6', '7']
  },
  'minor': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: 'W-H-W-W-H-W-W',
    name: 'Natural Minor (Aeolian)',
    degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7']
  },
  'pentatonic-major': {
    intervals: [0, 2, 4, 7, 9],
    formula: 'W-W-3H-W-3H',
    name: 'Major Pentatonic',
    degrees: ['1', '2', '3', '5', '6']
  },
  'pentatonic-minor': {
    intervals: [0, 3, 5, 7, 10],
    formula: '3H-W-W-3H-W',
    name: 'Minor Pentatonic',
    degrees: ['1', 'b3', '4', '5', 'b7']
  },
  'blues': {
    intervals: [0, 3, 5, 6, 7, 10],
    formula: '3H-W-H-H-3H-W',
    name: 'Blues Scale',
    degrees: ['1', 'b3', '4', 'b5', '5', 'b7']
  },
  'dorian': {
    intervals: [0, 2, 3, 5, 7, 9, 10],
    formula: 'W-H-W-W-W-H-W',
    name: 'Dorian',
    degrees: ['1', '2', 'b3', '4', '5', '6', 'b7']
  },
  'phrygian': {
    intervals: [0, 1, 3, 5, 7, 8, 10],
    formula: 'H-W-W-W-H-W-W',
    name: 'Phrygian',
    degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7']
  },
  'lydian': {
    intervals: [0, 2, 4, 6, 7, 9, 11],
    formula: 'W-W-W-H-W-W-H',
    name: 'Lydian',
    degrees: ['1', '2', '3', '#4', '5', '6', '7']
  },
  'mixolydian': {
    intervals: [0, 2, 4, 5, 7, 9, 10],
    formula: 'W-W-H-W-W-H-W',
    name: 'Mixolydian',
    degrees: ['1', '2', '3', '4', '5', '6', 'b7']
  },
  'locrian': {
    intervals: [0, 1, 3, 5, 6, 8, 10],
    formula: 'H-W-W-H-W-W-W',
    name: 'Locrian',
    degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7']
  }
};

// Canvas Fretboard Component
function FretboardCanvas({ rootNote, scaleType, showIntervals }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1F2937'; // gray-800
    ctx.fillRect(0, 0, width, height);

    // Fretboard dimensions
    const numFrets = 12;
    const numStrings = 6;
    const fretWidth = (width - 100) / numFrets;
    const stringSpacing = (height - 60) / (numStrings - 1);
    const offsetX = 50;
    const offsetY = 30;

    // Get scale info
    const scale = SCALES[scaleType];
    const rootIndex = NOTE_NAMES.indexOf(rootNote);
    const scaleNotes = scale.intervals.map(interval =>
      NOTE_NAMES[(rootIndex + interval) % 12]
    );

    const getNoteAtFret = (stringNote, fret) => {
      const stringIndex = NOTE_NAMES.indexOf(stringNote);
      const noteIndex = (stringIndex + fret) % 12;
      return NOTE_NAMES[noteIndex];
    };

    const getIntervalDegree = (note) => {
      const noteIndex = NOTE_NAMES.indexOf(note);
      const rootIdx = NOTE_NAMES.indexOf(rootNote);
      const interval = (noteIndex - rootIdx + 12) % 12;
      const scaleIndex = scale.intervals.indexOf(interval);
      return scaleIndex >= 0 ? scale.degrees[scaleIndex] : null;
    };

    // Draw strings
    ctx.strokeStyle = '#4B5563'; // gray-600
    for (let s = 0; s < numStrings; s++) {
      ctx.lineWidth = 1 + (numStrings - s) * 0.3;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + s * stringSpacing);
      ctx.lineTo(width - 20, offsetY + s * stringSpacing);
      ctx.stroke();
    }

    // Draw frets
    ctx.strokeStyle = '#6B7280'; // gray-500
    ctx.lineWidth = 2;
    for (let f = 0; f <= numFrets; f++) {
      const x = offsetX + f * fretWidth;
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + (numStrings - 1) * stringSpacing);
      ctx.stroke();
    }

    // Draw fret markers
    const markerFrets = [3, 5, 7, 9, 12];
    ctx.fillStyle = '#4B5563'; // gray-600
    markerFrets.forEach(fret => {
      const x = offsetX + (fret - 0.5) * fretWidth;
      const y = offsetY + ((numStrings - 1) * stringSpacing) / 2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw fret numbers
    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    for (let f = 0; f <= numFrets; f++) {
      const x = offsetX + f * fretWidth;
      ctx.fillText(f.toString(), x, offsetY - 10);
    }

    // Draw string names
    ctx.textAlign = 'right';
    STANDARD_TUNING.slice().reverse().forEach((stringNote, idx) => {
      const y = offsetY + idx * stringSpacing + 4;
      ctx.fillText(stringNote, offsetX - 10, y);
    });

    // Draw scale notes
    STANDARD_TUNING.slice().reverse().forEach((stringNote, stringIdx) => {
      for (let fret = 0; fret <= numFrets; fret++) {
        const note = getNoteAtFret(stringNote, fret);

        if (scaleNotes.includes(note)) {
          const x = offsetX + (fret === 0 ? 0 : fret - 0.5) * fretWidth;
          const y = offsetY + stringIdx * stringSpacing;
          const isRoot = note === rootNote;

          // Draw circle
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, 2 * Math.PI);
          ctx.fillStyle = isRoot ? '#EF4444' : '#3B82F6'; // red-500 or blue-500
          ctx.fill();
          ctx.strokeStyle = isRoot ? '#DC2626' : '#2563EB'; // darker border
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw label (note name or interval)
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          const label = showIntervals ? getIntervalDegree(note) : note;
          ctx.fillText(label, x, y + 4);
        }
      }
    });
  }, [rootNote, scaleType, showIntervals]);

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={280}
      className="w-full rounded-lg"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

FretboardCanvas.propTypes = {
  rootNote: PropTypes.string.isRequired,
  scaleType: PropTypes.string.isRequired,
  showIntervals: PropTypes.bool.isRequired
};

// Main Scale Library Component
export default function ScaleLibrary() {
  const [rootNote, setRootNote] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [showIntervals, setShowIntervals] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Initialize Web Audio context on mount
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const calculateScaleNotes = () => {
    const rootIndex = NOTE_NAMES.indexOf(rootNote);
    const scale = SCALES[scaleType];
    return scale.intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTE_NAMES[noteIndex];
    });
  };

  const playScale = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const audioContext = audioContextRef.current;
    const scaleNotes = calculateScaleNotes();
    const rootIndex = NOTE_NAMES.indexOf(rootNote);

    // Note frequencies (A4 = 440Hz as reference)
    const getFrequency = (note) => {
      const A4 = 440;
      const noteIndex = NOTE_NAMES.indexOf(note);
      const rootIdx = NOTE_NAMES.indexOf('A');
      const semitones = noteIndex - rootIdx;
      // Adjust to play in comfortable octave
      const octaveAdjust = semitones < 0 ? 12 : 0;
      return A4 * Math.pow(2, (semitones + octaveAdjust) / 12);
    };

    // Play ascending scale
    for (let i = 0; i < scaleNotes.length; i++) {
      const note = scaleNotes[i];
      const frequency = getFrequency(note);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const startTime = audioContext.currentTime + i * 0.3;
      const endTime = startTime + 0.25;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    }

    // Play descending scale
    const descendingDelay = scaleNotes.length * 0.3 + 0.2;
    for (let i = scaleNotes.length - 1; i >= 0; i--) {
      const note = scaleNotes[i];
      const frequency = getFrequency(note);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const startTime = audioContext.currentTime + descendingDelay + (scaleNotes.length - 1 - i) * 0.3;
      const endTime = startTime + 0.25;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    }

    // Reset playing state after animation completes
    setTimeout(() => {
      setIsPlaying(false);
    }, (scaleNotes.length * 0.3 * 2 + 0.5) * 1000);
  };

  const scaleNotes = calculateScaleNotes();
  const scaleInfo = SCALES[scaleType];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/" className="text-green-500 hover:text-green-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-green-400">Scale Library</h1>
        <p className="text-gray-400">Master guitar scales with interactive fretboard visualization</p>
      </header>

      {/* Controls */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Root Note Selector */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">Root Note</label>
            <div className="grid grid-cols-6 gap-2">
              {NOTE_NAMES.map(note => (
                <button
                  key={note}
                  onClick={() => setRootNote(note)}
                  className={`py-3 px-3 rounded font-medium transition-all ${
                    rootNote === note
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Type Selector */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">Scale Type</label>
            <select
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-green-500 text-gray-100"
            >
              <optgroup label="Common Scales">
                <option value="major">Major (Ionian)</option>
                <option value="minor">Natural Minor (Aeolian)</option>
                <option value="pentatonic-major">Major Pentatonic</option>
                <option value="pentatonic-minor">Minor Pentatonic</option>
                <option value="blues">Blues Scale</option>
              </optgroup>
              <optgroup label="Modes">
                <option value="dorian">Dorian</option>
                <option value="phrygian">Phrygian</option>
                <option value="lydian">Lydian</option>
                <option value="mixolydian">Mixolydian</option>
                <option value="locrian">Locrian</option>
              </optgroup>
            </select>

            {/* Display Options */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showIntervals}
                  onChange={(e) => setShowIntervals(e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm text-gray-300">Show intervals instead of note names</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Fretboard Visualization */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-green-400">Fretboard Visualization</h2>
        <FretboardCanvas
          rootNote={rootNote}
          scaleType={scaleType}
          showIntervals={showIntervals}
        />
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-600"></div>
            <span className="text-gray-300">Root Note</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-blue-600"></div>
            <span className="text-gray-300">Scale Notes</span>
          </div>
        </div>
      </div>

      {/* Scale Information */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scale Notes */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-green-400">
            {rootNote} {scaleInfo.name}
          </h3>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Notes:</h4>
            <div className="flex flex-wrap gap-2">
              {scaleNotes.map((note, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-full font-medium ${
                    note === rootNote
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Intervals:</h4>
            <div className="flex flex-wrap gap-2">
              {scaleInfo.degrees.map((degree, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded bg-gray-700 text-gray-200 text-sm font-mono"
                >
                  {degree}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Formula:</h4>
            <div className="bg-gray-700 rounded px-4 py-2 text-gray-200 font-mono text-sm">
              {scaleInfo.formula}
            </div>
            <p className="text-xs text-gray-500 mt-1">W = Whole step, H = Half step</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-green-400">Audio Playback</h3>
          <p className="text-gray-400 mb-4">
            Listen to the {rootNote} {scaleInfo.name} scale played ascending and descending.
          </p>

          <button
            onClick={playScale}
            disabled={isPlaying}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              isPlaying
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isPlaying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Playing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Play Scale
              </span>
            )}
          </button>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Practice Tips:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Start slowly and focus on accuracy</li>
              <li>• Practice ascending and descending</li>
              <li>• Learn scale patterns across the fretboard</li>
              <li>• Apply scales to improvisation and solos</li>
              <li>• Combine with backing tracks for practice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
