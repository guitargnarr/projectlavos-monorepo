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

        {/* Scale Info Panel */}
        <div className="fretvision-info-panel">
          <h3 className="fretvision-info-title">{rootNote} {formatScaleName(scaleType)} Scale</h3>

          <div>
            <h4 className="fretvision-notes-label">Notes in Scale</h4>
            <div className="fretvision-notes-list">
              {scaleNotes.map((note, i) => (
                <div
                  key={i}
                  className={`fretvision-note-pill ${note === rootNote ? 'root' : 'scale'}`}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="fretvision-legend">
            <div className="fretvision-legend-item">
              <span className="fretvision-legend-dot root"></span>
              Root Note
            </div>
            <div className="fretvision-legend-item">
              <span className="fretvision-legend-dot scale"></span>
              Scale Notes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
