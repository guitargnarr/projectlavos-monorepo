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

        // Draw finger position - using teal brand color
        ctx.fillStyle = '#14b8a6';
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
    <div className="chord-dictionary-card">
      <h3 className="chord-dictionary-card-title">{chord.name}</h3>
      <ChordDiagram chord={chord} />
      <button
        onClick={handlePlay}
        className={`chord-dictionary-play-btn ${isPlaying ? 'playing' : ''}`}
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

  // Get filter button class
  const getFilterClass = (filterValue) => {
    return `chord-dictionary-filter-btn ${filter === filterValue ? 'selected' : ''}`;
  };

  return (
    <div className="chord-dictionary-page">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="chord-dictionary-back-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <header className="chord-dictionary-header">
          <h1 className="chord-dictionary-title">Chord Dictionary</h1>
          <p className="chord-dictionary-subtitle">Interactive guitar chord diagrams with audio playback</p>
        </header>

        {/* Search and Filter Controls */}
        <div className="chord-dictionary-search-panel">
          <div className="chord-dictionary-search-grid">
            {/* Search */}
            <div>
              <label className="chord-dictionary-label">Search Chords</label>
              <input
                type="text"
                placeholder="Type chord name (e.g., C, Am, G Major...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="chord-dictionary-search-input"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="chord-dictionary-label">Filter by Type</label>
              <div className="chord-dictionary-filter-grid">
                <button
                  onClick={() => setFilter('all')}
                  className={getFilterClass('all')}
                >
                  All ({CHORD_DATA.length})
                </button>
                <button
                  onClick={() => setFilter('major')}
                  className={getFilterClass('major')}
                >
                  Major
                </button>
                <button
                  onClick={() => setFilter('minor')}
                  className={getFilterClass('minor')}
                >
                  Minor
                </button>
                <button
                  onClick={() => setFilter('maj7')}
                  className={getFilterClass('maj7')}
                >
                  Maj7
                </button>
                <button
                  onClick={() => setFilter('min7')}
                  className={getFilterClass('min7')}
                >
                  Min7
                </button>
                <button
                  onClick={() => setFilter('dom7')}
                  className={getFilterClass('dom7')}
                >
                  Dom7
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="chord-dictionary-results-count">
          Showing {filteredChords.length} chord{filteredChords.length !== 1 ? 's' : ''}
        </div>

        {/* Chord Grid */}
        <div className="chord-dictionary-grid">
          {filteredChords.map((chord) => (
            <ChordCard key={chord.name} chord={chord} onPlay={playChord} />
          ))}
        </div>

        {/* No Results */}
        {filteredChords.length === 0 && (
          <div className="chord-dictionary-no-results">
            <p>No chords found matching &quot;{searchTerm}&quot;</p>
            <button
              onClick={() => setSearchTerm('')}
              className="chord-dictionary-clear-btn"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="chord-dictionary-legend">
          <h3 className="chord-dictionary-legend-title">How to Read Chord Diagrams</h3>
          <div className="chord-dictionary-legend-grid">
            <div className="chord-dictionary-legend-item">
              <div className="chord-dictionary-legend-icon open"></div>
              <div className="chord-dictionary-legend-text">
                <strong>Open String</strong>
                <span>Play the string without fretting</span>
              </div>
            </div>
            <div className="chord-dictionary-legend-item">
              <div className="chord-dictionary-legend-icon fretted"></div>
              <div className="chord-dictionary-legend-text">
                <strong>Fretted Note</strong>
                <span>Press string at indicated fret</span>
              </div>
            </div>
            <div className="chord-dictionary-legend-item">
              <div className="chord-dictionary-legend-icon muted">X</div>
              <div className="chord-dictionary-legend-text">
                <strong>Muted String</strong>
                <span>Don&apos;t play this string</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
