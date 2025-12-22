import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NOTE_NAMES, SCALES } from '../lib/guitarTheory.js';

// Extended tunings (includes 7 and 8 string)
const TUNINGS = {
  standard: ['E', 'A', 'D', 'G', 'B', 'E'],
  drop_d: ['D', 'A', 'D', 'G', 'B', 'E'],
  drop_c: ['C', 'G', 'C', 'F', 'A', 'D'],
  '7-string': ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
  '8-string': ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E']
};

// Fret markers (inlay positions)
const INLAY_FRETS = [3, 5, 7, 9, 12];

// Scale metadata for Music Info Card
const SCALE_METADATA = {
  major: { mode: 'Ionian', formula: 'W-W-H-W-W-W-H', degrees: ['1', '2', '3', '4', '5', '6', '7'] },
  minor: { mode: 'Aeolian (Natural Minor)', formula: 'W-H-W-W-H-W-W', degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  pentatonic_major: { mode: 'Major Pentatonic', formula: 'W-W-m3-W-m3', degrees: ['1', '2', '3', '5', '6'] },
  pentatonic_minor: { mode: 'Minor Pentatonic', formula: 'm3-W-W-m3-W', degrees: ['1', 'b3', '4', '5', 'b7'] },
  blues: { mode: 'Blues Scale', formula: 'm3-W-H-H-m3-W', degrees: ['1', 'b3', '4', 'b5', '5', 'b7'] },
  phrygian: { mode: 'Phrygian', formula: 'H-W-W-W-H-W-W', degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
  lydian: { mode: 'Lydian', formula: 'W-W-W-H-W-W-H', degrees: ['1', '2', '3', '#4', '5', '6', '7'] },
  mixolydian: { mode: 'Mixolydian', formula: 'W-W-H-W-W-H-W', degrees: ['1', '2', '3', '4', '5', '6', 'b7'] },
  dorian: { mode: 'Dorian', formula: 'W-H-W-W-W-H-W', degrees: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
  locrian: { mode: 'Locrian', formula: 'H-W-W-H-W-W-W', degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
  harmonic_minor: { mode: 'Harmonic Minor', formula: 'W-H-W-W-H-m3-H', degrees: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
  melodic_minor: { mode: 'Melodic Minor', formula: 'W-H-W-W-W-W-H', degrees: ['1', '2', 'b3', '4', '5', '6', '7'] }
};

// Get interval color class for a note position in scale
const getIntervalColor = (noteIndex, scaleLength) => {
  // Root (1st)
  if (noteIndex === 0) return 'interval-root';
  // Third (3rd position - index 2 for 7-note, varies for pentatonic)
  if (scaleLength === 7 && noteIndex === 2) return 'interval-third';
  if (scaleLength === 5 && noteIndex === 2) return 'interval-fifth'; // Pentatonic: 1-b3-4-5-b7, index 2 is 4th
  if (scaleLength === 6 && noteIndex === 2) return 'interval-third'; // Blues
  // Fifth (5th position)
  if (scaleLength === 7 && noteIndex === 4) return 'interval-fifth';
  if (scaleLength === 5 && noteIndex === 3) return 'interval-fifth'; // Pentatonic
  if (scaleLength === 6 && noteIndex === 4) return 'interval-fifth'; // Blues (actual 5th)
  // Seventh (7th position for 7-note scales)
  if (scaleLength === 7 && noteIndex === 6) return 'interval-seventh';
  if (scaleLength === 5 && noteIndex === 4) return 'interval-seventh'; // Pentatonic b7
  if (scaleLength === 6 && noteIndex === 5) return 'interval-seventh'; // Blues b7
  return 'interval-other';
};

export default function FretVision() {
  const [rootNote, setRootNote] = useState('B');
  const [scaleType, setScaleType] = useState('minor');
  const [tuning, setTuning] = useState('standard');

  const calculateScaleNotes = (root, scale) => {
    const rootIndex = NOTE_NAMES.indexOf(root);
    const scaleIntervals = SCALES[scale];
    return scaleIntervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTE_NAMES[noteIndex];
    });
  };

  const scaleNotes = calculateScaleNotes(rootNote, scaleType);

  const getNoteAtFret = (stringNote, fret) => {
    const stringIndex = NOTE_NAMES.indexOf(stringNote);
    const noteIndex = (stringIndex + fret) % 12;
    return NOTE_NAMES[noteIndex];
  };

  const isNoteInScale = (note) => scaleNotes.includes(note);
  const isRootNote = (note) => note === rootNote;

  const formatScaleName = (scale) => {
    const names = {
      'major': 'Major',
      'minor': 'Minor',
      'pentatonic_major': 'Major Pentatonic',
      'pentatonic_minor': 'Minor Pentatonic',
      'blues': 'Blues',
      'phrygian': 'Phrygian',
      'lydian': 'Lydian',
      'mixolydian': 'Mixolydian',
      'dorian': 'Dorian',
      'locrian': 'Locrian',
      'harmonic_minor': 'Harmonic Minor',
      'melodic_minor': 'Melodic Minor'
    };
    return names[scale] || scale;
  };

  return (
    <div className="fretvision-page">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="fretvision-back-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <header className="fretvision-header">
          <h1 className="fretvision-title">FretVision</h1>
          <div className="fretvision-title-accent"></div>
          <p className="fretvision-subtitle">Visualize Guitar Scales and Modes</p>
        </header>

        {/* Control Panel */}
        <div className="fretvision-control-panel">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Tuning Select */}
            <div>
              <label className="fretvision-select-label">Guitar Tuning</label>
              <select
                value={tuning}
                onChange={(e) => setTuning(e.target.value)}
                className="fretvision-select"
              >
                <option value="standard">E Standard (6-string)</option>
                <option value="drop_d">Drop D (6-string)</option>
                <option value="drop_c">Drop C (6-string)</option>
                <option value="7-string">7-string Standard</option>
                <option value="8-string">8-string Standard</option>
              </select>
            </div>

            {/* Scale Select */}
            <div>
              <label className="fretvision-select-label">Scale Type</label>
              <select
                value={scaleType}
                onChange={(e) => setScaleType(e.target.value)}
                className="fretvision-select"
              >
                <option value="major">Major (Ionian)</option>
                <option value="minor">Minor (Aeolian)</option>
                <option value="pentatonic_major">Major Pentatonic</option>
                <option value="pentatonic_minor">Minor Pentatonic</option>
                <option value="blues">Blues</option>
                <option value="dorian">Dorian</option>
                <option value="phrygian">Phrygian</option>
                <option value="lydian">Lydian</option>
                <option value="mixolydian">Mixolydian</option>
                <option value="locrian">Locrian</option>
                <option value="harmonic_minor">Harmonic Minor</option>
                <option value="melodic_minor">Melodic Minor</option>
              </select>
            </div>
          </div>

          {/* Root Note Grid */}
          <div>
            <label className="fretvision-select-label">Root Note</label>
            <div className="fretvision-root-grid">
              {NOTE_NAMES.map(note => (
                <button
                  key={note}
                  onClick={() => setRootNote(note)}
                  className={`fretvision-root-button ${rootNote === note ? 'selected' : ''}`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fretboard */}
        <div className="fretvision-fretboard">
          <div className="fretvision-fretboard-inner">
            {/* Fret Numbers */}
            <div className="fretvision-fret-numbers">
              <div className="fretvision-fret-number" style={{ width: '3rem' }}></div>
              {[...Array(13)].map((_, i) => (
                <div key={i} className="fretvision-fret-number">{i}</div>
              ))}
            </div>

            {/* Strings */}
            {TUNINGS[tuning].slice().reverse().map((stringNote, stringIndex) => (
              <div key={stringIndex} className="fretvision-string-row">
                <div className="fretvision-string-label">{stringNote}</div>
                {[...Array(13)].map((_, fret) => {
                  const note = getNoteAtFret(stringNote, fret);
                  const inScale = isNoteInScale(note);
                  const isRoot = isRootNote(note);
                  const hasInlay = INLAY_FRETS.includes(fret) && stringIndex === Math.floor(TUNINGS[tuning].length / 2);

                  return (
                    <div
                      key={fret}
                      className={`fretvision-fret-cell ${fret === 0 ? 'nut' : ''}`}
                    >
                      {inScale && (
                        <div className={`fretvision-note-dot ${isRoot ? 'root' : 'scale'}`}>
                          {note}
                        </div>
                      )}
                      {hasInlay && !inScale && (
                        <div className="fretvision-inlay"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Music Info Card */}
        <div className="fretvision-info-panel music-info-card">
          {/* Title with Mode */}
          <div className="music-info-header">
            <h3 className="fretvision-info-title">{rootNote} {formatScaleName(scaleType)} Scale</h3>
            <span className="music-info-mode">{SCALE_METADATA[scaleType]?.mode || scaleType}</span>
          </div>

          {/* Interval Formula */}
          <div className="music-info-section">
            <h4 className="fretvision-notes-label">Interval Formula</h4>
            <div className="music-info-formula">
              {SCALE_METADATA[scaleType]?.formula || 'N/A'}
            </div>
          </div>

          {/* Color-coded Notes */}
          <div className="music-info-section">
            <h4 className="fretvision-notes-label">Notes in Scale</h4>
            <div className="fretvision-notes-list">
              {scaleNotes.map((note, i) => (
                <div
                  key={i}
                  className={`fretvision-note-pill ${getIntervalColor(i, scaleNotes.length)}`}
                  title={SCALE_METADATA[scaleType]?.degrees?.[i] || `${i + 1}`}
                >
                  <span className="note-name">{note}</span>
                  <span className="note-degree">{SCALE_METADATA[scaleType]?.degrees?.[i] || ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Legend with Interval Colors */}
          <div className="fretvision-legend music-info-legend">
            <div className="fretvision-legend-item">
              <span className="fretvision-legend-dot interval-root"></span>
              Root (1)
            </div>
            <div className="fretvision-legend-item">
              <span className="fretvision-legend-dot interval-third"></span>
              Third (3)
            </div>
            <div className="fretvision-legend-item">
              <span className="fretvision-legend-dot interval-fifth"></span>
              Fifth (5)
            </div>
            <div className="fretvision-legend-item">
              <span className="fretvision-legend-dot interval-seventh"></span>
              Seventh (7)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
