import { useState } from 'react';
import { Link } from 'react-router-dom';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const TUNINGS = {
  "standard": ['E', 'A', 'D', 'G', 'B', 'E'],
  "drop-d": ['D', 'A', 'D', 'G', 'B', 'E'],
  "drop-c": ['C', 'G', 'C', 'F', 'A', 'D'],
  "7-string": ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
  "8-string": ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E']
};
const SCALES = {
  "major": [0, 2, 4, 5, 7, 9, 11],
  "minor": [0, 2, 3, 5, 7, 8, 10],
  "pentatonic-major": [0, 2, 4, 7, 9],
  "pentatonic-minor": [0, 3, 5, 7, 10],
  "blues": [0, 3, 5, 6, 7, 10],
  "phrygian": [0, 1, 3, 5, 7, 8, 10],
  "lydian": [0, 2, 4, 6, 7, 9, 11],
  "mixolydian": [0, 2, 4, 5, 7, 9, 10]
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
      'pentatonic-major': 'Major Pentatonic',
      'pentatonic-minor': 'Minor Pentatonic',
      'blues': 'Blues',
      'phrygian': 'Phrygian',
      'lydian': 'Lydian',
      'mixolydian': 'Mixolydian'
    };
    return names[scale] || scale;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link to="/" className="text-green-500 hover:text-green-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-green-400">FretVision</h1>
        <p className="text-gray-400">Visualize Guitar Scales and Chords</p>
      </header>

      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Guitar Tuning</label>
            <select
              value={tuning}
              onChange={(e) => setTuning(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-green-500"
            >
              <option value="standard">E Standard (6-string)</option>
              <option value="drop-d">Drop D (6-string)</option>
              <option value="drop-c">Drop C (6-string)</option>
              <option value="7-string">7-string Standard</option>
              <option value="8-string">8-string Standard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scale Type</label>
            <select
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-green-500"
            >
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="pentatonic-major">Pentatonic Major</option>
              <option value="pentatonic-minor">Pentatonic Minor</option>
              <option value="blues">Blues</option>
              <option value="phrygian">Phrygian</option>
              <option value="lydian">Lydian</option>
              <option value="mixolydian">Mixolydian</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Root Note</label>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {NOTE_NAMES.map(note => (
              <button
                key={note}
                onClick={() => setRootNote(note)}
                className={`py-2 px-3 rounded font-medium transition-all ${
                  rootNote === note
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 overflow-x-auto">
        <div className="min-w-max">
          <div className="flex mb-2">
            <div className="w-12"></div>
            {[...Array(13)].map((_, i) => (
              <div key={i} className="w-16 text-center text-sm text-gray-500">{i}</div>
            ))}
          </div>

          {TUNINGS[tuning].slice().reverse().map((stringNote, stringIndex) => (
            <div key={stringIndex} className="flex items-center mb-1">
              <div className="w-12 text-sm font-medium text-gray-400">{stringNote}</div>
              {[...Array(13)].map((_, fret) => {
                const note = getNoteAtFret(stringNote, fret);
                const inScale = isNoteInScale(note);
                const isRoot = isRootNote(note);

                return (
                  <div
                    key={fret}
                    className="w-16 h-12 border border-gray-700 flex items-center justify-center relative"
                  >
                    {inScale && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isRoot
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {note}
                      </div>
                    )}
                    {[3, 5, 7, 9, 12].includes(fret) && !inScale && (
                      <div className="absolute bottom-1 w-2 h-2 rounded-full bg-gray-600"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mt-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-2 text-green-400">{rootNote} {formatScaleName(scaleType)} Scale</h3>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Notes in Scale:</h4>
          <div className="flex flex-wrap gap-2">
            {scaleNotes.map((note, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-full font-medium ${
                  note === rootNote
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {note}
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <p><span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>Root Note</p>
          <p><span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>Scale Notes</p>
        </div>
      </div>
    </div>
  );
}
