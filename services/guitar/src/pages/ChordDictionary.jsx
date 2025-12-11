import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Chord data structure:
 * - name: Chord name (e.g., "C Major")
 * - fingers: Array of 6 elements (one per string, low E to high E)
 *   - -1 = don't play (muted)
 *   - 0 = open string
 *   - 1-12 = fret number
 * - fingering: Optional array showing which finger to use (1=index, 2=middle, 3=ring, 4=pinky)
 * - notes: Array of note names played (for audio playback)
 */
const CHORD_DATA = [
  // Major Chords
  { name: 'C Major', short: 'C', fingers: [-1, 3, 2, 0, 1, 0], fingering: [0, 3, 2, 0, 1, 0], notes: ['C', 'E', 'G', 'C', 'E'] },
  { name: 'D Major', short: 'D', fingers: [-1, -1, 0, 2, 3, 2], fingering: [0, 0, 0, 1, 3, 2], notes: ['D', 'A', 'D', 'F#'] },
  { name: 'E Major', short: 'E', fingers: [0, 2, 2, 1, 0, 0], fingering: [0, 2, 3, 1, 0, 0], notes: ['E', 'B', 'E', 'G#', 'B', 'E'] },
  { name: 'F Major', short: 'F', fingers: [1, 3, 3, 2, 1, 1], fingering: [1, 3, 4, 2, 1, 1], notes: ['F', 'A', 'C', 'F', 'A', 'F'] },
  { name: 'G Major', short: 'G', fingers: [3, 2, 0, 0, 0, 3], fingering: [3, 2, 0, 0, 0, 4], notes: ['G', 'B', 'D', 'G', 'B', 'G'] },
  { name: 'A Major', short: 'A', fingers: [-1, 0, 2, 2, 2, 0], fingering: [0, 0, 1, 2, 3, 0], notes: ['A', 'E', 'A', 'C#', 'E'] },
  { name: 'B Major', short: 'B', fingers: [-1, 2, 4, 4, 4, 2], fingering: [0, 1, 3, 3, 3, 1], notes: ['B', 'F#', 'B', 'D#', 'F#'] },

  // Minor Chords
  { name: 'C Minor', short: 'Cm', fingers: [-1, 3, 5, 5, 4, 3], fingering: [0, 1, 3, 4, 2, 1], notes: ['C', 'G', 'C', 'Eb', 'G'] },
  { name: 'D Minor', short: 'Dm', fingers: [-1, -1, 0, 2, 3, 1], fingering: [0, 0, 0, 2, 3, 1], notes: ['D', 'A', 'D', 'F'] },
  { name: 'E Minor', short: 'Em', fingers: [0, 2, 2, 0, 0, 0], fingering: [0, 2, 3, 0, 0, 0], notes: ['E', 'B', 'E', 'G', 'B', 'E'] },
  { name: 'F Minor', short: 'Fm', fingers: [1, 3, 3, 1, 1, 1], fingering: [1, 3, 4, 1, 1, 1], notes: ['F', 'Ab', 'C', 'F', 'Ab', 'F'] },
  { name: 'G Minor', short: 'Gm', fingers: [3, 5, 5, 3, 3, 3], fingering: [1, 3, 4, 1, 1, 1], notes: ['G', 'Bb', 'D', 'G', 'Bb', 'G'] },
  { name: 'A Minor', short: 'Am', fingers: [-1, 0, 2, 2, 1, 0], fingering: [0, 0, 2, 3, 1, 0], notes: ['A', 'E', 'A', 'C', 'E'] },
  { name: 'B Minor', short: 'Bm', fingers: [-1, 2, 4, 4, 3, 2], fingering: [0, 1, 3, 4, 2, 1], notes: ['B', 'F#', 'B', 'D', 'F#'] },

  // 7th Chords - Major 7th
  { name: 'C Major 7', short: 'Cmaj7', fingers: [-1, 3, 2, 0, 0, 0], fingering: [0, 3, 2, 0, 0, 0], notes: ['C', 'E', 'G', 'B', 'E'] },
  { name: 'D Major 7', short: 'Dmaj7', fingers: [-1, -1, 0, 2, 2, 2], fingering: [0, 0, 0, 1, 1, 1], notes: ['D', 'A', 'D', 'F#', 'A', 'C#'] },
  { name: 'F Major 7', short: 'Fmaj7', fingers: [-1, -1, 3, 2, 1, 0], fingering: [0, 0, 3, 2, 1, 0], notes: ['F', 'A', 'C', 'E'] },
  { name: 'G Major 7', short: 'Gmaj7', fingers: [3, 2, 0, 0, 0, 2], fingering: [3, 2, 0, 0, 0, 1], notes: ['G', 'B', 'D', 'G', 'B', 'F#'] },
  { name: 'A Major 7', short: 'Amaj7', fingers: [-1, 0, 2, 1, 2, 0], fingering: [0, 0, 2, 1, 3, 0], notes: ['A', 'E', 'G#', 'C#', 'E'] },

  // 7th Chords - Minor 7th
  { name: 'A Minor 7', short: 'Am7', fingers: [-1, 0, 2, 0, 1, 0], fingering: [0, 0, 2, 0, 1, 0], notes: ['A', 'E', 'G', 'C', 'E'] },
  { name: 'B Minor 7', short: 'Bm7', fingers: [-1, 2, 0, 2, 0, 2], fingering: [0, 1, 0, 2, 0, 3], notes: ['B', 'F#', 'A', 'D', 'F#'] },
  { name: 'D Minor 7', short: 'Dm7', fingers: [-1, -1, 0, 2, 1, 1], fingering: [0, 0, 0, 2, 1, 1], notes: ['D', 'A', 'C', 'F'] },
  { name: 'E Minor 7', short: 'Em7', fingers: [0, 2, 0, 0, 0, 0], fingering: [0, 2, 0, 0, 0, 0], notes: ['E', 'B', 'D', 'G', 'B', 'E'] },

  // 7th Chords - Dominant 7th
  { name: 'A Dominant 7', short: 'A7', fingers: [-1, 0, 2, 0, 2, 0], fingering: [0, 0, 1, 0, 2, 0], notes: ['A', 'E', 'G', 'C#', 'E'] },
  { name: 'B Dominant 7', short: 'B7', fingers: [-1, 2, 1, 2, 0, 2], fingering: [0, 2, 1, 3, 0, 4], notes: ['B', 'D#', 'A', 'B', 'F#'] },
  { name: 'C Dominant 7', short: 'C7', fingers: [-1, 3, 2, 3, 1, 0], fingering: [0, 3, 2, 4, 1, 0], notes: ['C', 'E', 'Bb', 'C', 'E'] },
  { name: 'D Dominant 7', short: 'D7', fingers: [-1, -1, 0, 2, 1, 2], fingering: [0, 0, 0, 2, 1, 3], notes: ['D', 'A', 'C', 'F#'] },
  { name: 'E Dominant 7', short: 'E7', fingers: [0, 2, 0, 1, 0, 0], fingering: [0, 2, 0, 1, 0, 0], notes: ['E', 'B', 'D', 'G#', 'B', 'E'] },
  { name: 'G Dominant 7', short: 'G7', fingers: [3, 2, 0, 0, 0, 1], fingering: [3, 2, 0, 0, 0, 1], notes: ['G', 'B', 'D', 'G', 'B', 'F'] },
];

/**
 * ChordDiagram - Canvas-based chord diagram component
 * Draws a guitar fretboard diagram showing finger positions for a chord
 */
function ChordDiagram({ chord, width = 120, height = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size accounting for device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Drawing constants
    const padding = 20;
    const fretboardWidth = width - padding * 2;
    const fretboardHeight = height - padding * 2 - 20; // Extra space for string labels
    const numStrings = 6;
    const numFrets = 4;
    const stringSpacing = fretboardWidth / (numStrings - 1);
    const fretSpacing = fretboardHeight / numFrets;

    // Determine if we need to show fret numbers (for barre chords)
    const minFret = Math.min(...chord.fingers.filter(f => f > 0));
    const showFretNumber = minFret > 1;
    const baseFret = showFretNumber ? minFret : 0;

    // Draw fret number if needed
    if (showFretNumber) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${baseFret}fr`, padding - 5, padding + fretSpacing);
    }

    // Draw frets (horizontal lines)
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = showFretNumber ? 2 : 3; // Thicker for nut
    for (let i = 0; i <= numFrets; i++) {
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * fretSpacing);
      ctx.lineTo(padding + fretboardWidth, padding + i * fretSpacing);
      ctx.stroke();
      if (i === 0) ctx.lineWidth = 2; // Only nut is thick
    }

    // Draw strings (vertical lines)
    ctx.lineWidth = 1;
    for (let i = 0; i < numStrings; i++) {
      ctx.beginPath();
      ctx.moveTo(padding + i * stringSpacing, padding);
      ctx.lineTo(padding + i * stringSpacing, padding + fretboardHeight);
      ctx.stroke();
    }

    // Draw finger positions and string status
    chord.fingers.forEach((fret, stringIndex) => {
      const x = padding + stringIndex * stringSpacing;

      if (fret === -1) {
        // Muted string (X)
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        const size = 6;
        ctx.beginPath();
        ctx.moveTo(x - size, padding - 12 - size);
        ctx.lineTo(x + size, padding - 12 + size);
        ctx.moveTo(x + size, padding - 12 - size);
        ctx.lineTo(x - size, padding - 12 + size);
        ctx.stroke();
      } else if (fret === 0) {
        // Open string (O)
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, padding - 12, 6, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Fretted note (filled circle)
        const adjustedFret = showFretNumber ? fret - baseFret + 1 : fret;
        const y = padding + (adjustedFret - 0.5) * fretSpacing;

        // Draw finger position
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw finger number
        if (chord.fingering && chord.fingering[stringIndex] > 0) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(chord.fingering[stringIndex].toString(), x, y);
        }
      }
    });

  }, [chord, width, height]);

  return <canvas ref={canvasRef} className="mx-auto" />;
}

ChordDiagram.propTypes = {
  chord: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fingers: PropTypes.arrayOf(PropTypes.number).isRequired,
    fingering: PropTypes.arrayOf(PropTypes.number),
    notes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

/**
 * ChordCard - Card component displaying a single chord
 */
function ChordCard({ chord, onPlay }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay(chord);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all">
      <h3 className="text-lg font-bold mb-3 text-center text-blue-400">{chord.name}</h3>
      <ChordDiagram chord={chord} />
      <button
        onClick={handlePlay}
        className={`mt-4 w-full py-2 rounded font-medium transition-all ${
          isPlaying
            ? 'bg-green-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        {isPlaying ? 'Playing...' : 'Play Chord'}
      </button>
    </div>
  );
}

ChordCard.propTypes = {
  chord: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fingers: PropTypes.arrayOf(PropTypes.number).isRequired,
    fingering: PropTypes.arrayOf(PropTypes.number),
    notes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onPlay: PropTypes.func.isRequired,
};

/**
 * ChordDictionary - Main component
 * Displays a searchable, filterable grid of guitar chords
 */
export default function ChordDictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, major, minor, maj7, min7, dom7
  const audioContextRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Note frequencies (A4 = 440 Hz)
  const getNoteFrequency = (noteName) => {
    const noteFrequencies = {
      'C': 130.81, 'C#': 138.59, 'Db': 138.59,
      'D': 146.83, 'D#': 155.56, 'Eb': 155.56,
      'E': 164.81,
      'F': 174.61, 'F#': 185.00, 'Gb': 185.00,
      'G': 196.00, 'G#': 207.65, 'Ab': 207.65,
      'A': 220.00, 'A#': 233.08, 'Bb': 233.08,
      'B': 246.94,
    };
    return noteFrequencies[noteName] || 440;
  };

  // Play chord using Web Audio API
  const playChord = (chord) => {
    if (!audioContextRef.current || !chord.notes) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const duration = 1.5;

    chord.notes.forEach((note, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(getNoteFrequency(note), now);

      // Stagger the notes slightly for a strumming effect
      const startTime = now + (index * 0.05);

      // Envelope (ADSR)
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.1, startTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  };

  // Filter chords based on search and filter
  const filteredChords = CHORD_DATA.filter(chord => {
    const matchesSearch = chord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chord.short.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'major') {
      return matchesSearch && chord.name.includes('Major') && !chord.name.includes('7');
    } else if (filter === 'minor') {
      return matchesSearch && chord.name.includes('Minor') && !chord.name.includes('7');
    } else if (filter === 'maj7') {
      return matchesSearch && chord.name.includes('Major 7');
    } else if (filter === 'min7') {
      return matchesSearch && chord.name.includes('Minor 7');
    } else if (filter === 'dom7') {
      return matchesSearch && chord.name.includes('Dominant 7');
    }

    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-blue-400">Chord Dictionary</h1>
        <p className="text-gray-400">Interactive guitar chord diagrams with audio playback</p>
      </header>

      {/* Search and Filter Controls */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search Chords</label>
            <input
              type="text"
              placeholder="Type chord name (e.g., C, Am, G Major...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`py-2 px-2 rounded font-medium text-sm transition-all ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({CHORD_DATA.length})
              </button>
              <button
                onClick={() => setFilter('major')}
                className={`py-2 px-2 rounded font-medium text-sm transition-all ${
                  filter === 'major'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Major
              </button>
              <button
                onClick={() => setFilter('minor')}
                className={`py-2 px-2 rounded font-medium text-sm transition-all ${
                  filter === 'minor'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Minor
              </button>
              <button
                onClick={() => setFilter('maj7')}
                className={`py-2 px-2 rounded font-medium text-sm transition-all ${
                  filter === 'maj7'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Maj7
              </button>
              <button
                onClick={() => setFilter('min7')}
                className={`py-2 px-2 rounded font-medium text-sm transition-all ${
                  filter === 'min7'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Min7
              </button>
              <button
                onClick={() => setFilter('dom7')}
                className={`py-2 px-2 rounded font-medium text-sm transition-all ${
                  filter === 'dom7'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Dom7
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-400">
        Showing {filteredChords.length} chord{filteredChords.length !== 1 ? 's' : ''}
      </div>

      {/* Chord Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredChords.map((chord) => (
          <ChordCard key={chord.name} chord={chord} onPlay={playChord} />
        ))}
      </div>

      {/* No Results */}
      {filteredChords.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">No chords found matching &quot;{searchTerm}&quot;</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-blue-400">How to Read Chord Diagrams</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex-shrink-0 mt-0.5"></div>
            <div>
              <p className="font-medium text-gray-300">Open String</p>
              <p className="text-gray-500">Play the string without fretting</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></div>
            <div>
              <p className="font-medium text-gray-300">Fretted Note</p>
              <p className="text-gray-500">Press string at indicated fret</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-red-500 text-xl font-bold flex-shrink-0 w-6 text-center">X</div>
            <div>
              <p className="font-medium text-gray-300">Muted String</p>
              <p className="text-gray-500">Don&apos;t play this string</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
