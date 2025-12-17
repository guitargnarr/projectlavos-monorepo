import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { generateTab, getScaleInfo, SCALES, NOTE_NAMES, GuitarTheory, TUNINGS, MIDI_BASE, CHORD_PROGRESSIONS } from '../lib/guitarTheory';
import GuitarSynthesizer from '../lib/GuitarSynthesizer';
import { createMidiFile, downloadMidiFile } from '../lib/midiGenerator';
import { InteractiveFretboard } from '../components/riffgen';

const ROOTS = ['E', 'A', 'D', 'G', 'C', 'F', 'B', 'F#', 'C#', 'G#', 'D#', 'A#'];
const PATTERNS = [
  { value: 'ascending', label: 'Ascending', desc: 'Low to high, string by string' },
  { value: 'descending', label: 'Descending', desc: 'High to low' },
  { value: 'pedal', label: 'Pedal Tone', desc: 'Root + melody alternating' },
  { value: 'arpeggio', label: 'Arpeggio', desc: '1-3-5 sweep pattern' },
  { value: 'random', label: 'Random', desc: 'Weighted random notes' },
  { value: '3nps', label: '3 Notes/String', desc: 'Speed picking pattern (7-note scales only)' },
  { value: 'power_chords', label: 'Power Chords', desc: 'Heavy riff with power chords' },
  { value: 'progression', label: 'Progression', desc: 'Chord progression pattern' },
];

const TUNING_OPTIONS = [
  { value: 'standard', label: 'Standard (EADGBE)' },
  { value: 'drop_d', label: 'Drop D (DADGBE)' },
  { value: 'drop_c', label: 'Drop C (CGCFAD)' },
  { value: 'half_step_down', label: 'Half Step Down (Eb)' },
];

const PROGRESSION_OPTIONS = [
  { value: 'blues_12bar', label: '12-Bar Blues', desc: 'I-IV-V classic progression' },
  { value: 'pop_4chord', label: 'Pop 4-Chord', desc: 'I-V-vi-IV (most popular)' },
  { value: 'rock_power', label: 'Rock Power', desc: 'I-IV-V-V rock progression' },
  { value: 'jazz_251', label: 'Jazz ii-V-I', desc: 'Classic jazz turnaround' },
  { value: 'metal_riff', label: 'Metal Riff', desc: 'Phrygian-based i-bVII-bVI-V' },
  { value: 'sad_progression', label: 'Sad/Emotional', desc: 'vi-IV-I-V axis progression' },
  { value: 'andalusian', label: 'Andalusian', desc: 'Flamenco bVII-bVI-V-i' },
];

export default function RiffGenerator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load from URL or defaults
  const [root, setRoot] = useState(searchParams.get('root') || 'E');
  const [scale, setScale] = useState(searchParams.get('scale') || 'phrygian');
  const [pattern, setPattern] = useState(searchParams.get('pattern') || 'ascending');
  const [position, setPosition] = useState(parseInt(searchParams.get('position')) || 1);
  const [bars, setBars] = useState(parseInt(searchParams.get('bars')) || 2);
  const [tempo, setTempo] = useState(parseInt(searchParams.get('tempo')) || 120);
  const [tuning, setTuning] = useState(searchParams.get('tuning') || 'standard');
  const [progression, setProgression] = useState(searchParams.get('progression') || 'blues_12bar');

  const [tab, setTab] = useState('');
  const [scaleInfo, setScaleInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [activeNotes, setActiveNotes] = useState([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');

  const synthRef = useRef(null);
  const tabDataRef = useRef([]);
  const positionRef = useRef(0);
  const intervalRef = useRef(null);
  const beatCountRef = useRef(0);
  const loopEnabledRef = useRef(false);

  // Keep ref in sync with state for use in interval callback
  useEffect(() => {
    loopEnabledRef.current = loopEnabled;
  }, [loopEnabled]);

  // Initialize synth
  useEffect(() => {
    const init = async () => {
      synthRef.current = new GuitarSynthesizer(tuning);
      await synthRef.current.loadInstrument();
      setIsLoading(false);
    };
    init();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update synth tuning when tuning changes
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.setTuning(tuning);
    }
  }, [tuning]);

  // Update URL when settings change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('root', root);
    params.set('scale', scale);
    params.set('pattern', pattern);
    params.set('position', position.toString());
    params.set('bars', bars.toString());
    params.set('tempo', tempo.toString());
    params.set('tuning', tuning);
    if (pattern === 'progression') {
      params.set('progression', progression);
    }
    setSearchParams(params, { replace: true });
  }, [root, scale, pattern, position, bars, tempo, tuning, progression, setSearchParams]);

  // Generate tab when params change
  useEffect(() => {
    setError(null);
    try {
      const scaleIntervals = SCALES[scale];
      if (pattern === '3nps' && scaleIntervals.length !== 7) {
        setError(`3NPS requires a 7-note scale. ${scale.replace(/_/g, ' ')} has ${scaleIntervals.length} notes. Try Major, Minor, or a mode.`);
        setTab('');
        setScaleInfo(getScaleInfo(root, scale));
        tabDataRef.current = [];
        return;
      }

      const newTab = generateTab(root, scale, pattern, bars, position, tuning, pattern === 'progression' ? progression : null);
      setTab(newTab);
      setScaleInfo(getScaleInfo(root, scale));
      parseTab(newTab);
    } catch (err) {
      setError(err.message);
      setTab('');
    }
  }, [root, scale, pattern, position, bars, tuning, progression]);

  const parseTab = useCallback((tabString) => {
    const lines = tabString.split('\n');
    const cleanedLines = lines.map(line => line.substring(2));
    const data = [];

    const stringNotes = cleanedLines.map(line => {
      const notes = [];
      let i = 0;
      while (i < line.length) {
        if (!/\d/.test(line[i])) {
          i++;
          continue;
        }
        let numStr = '';
        const startPos = i;
        while (i < line.length && /\d/.test(line[i])) {
          numStr += line[i];
          i++;
        }
        notes.push({ fret: parseInt(numStr), position: startPos });
      }
      return notes;
    });

    const allPositions = new Set();
    stringNotes.forEach(notes => {
      notes.forEach(n => allPositions.add(n.position));
    });
    const sortedPositions = Array.from(allPositions).sort((a, b) => a - b);

    for (const pos of sortedPositions) {
      const column = { notes: [], duration: 1 };
      for (let string = 0; string < 6; string++) {
        const note = stringNotes[string].find(n => n.position === pos);
        if (note) {
          column.notes.push({ string, fret: note.fret });
        }
      }
      if (column.notes.length > 0) {
        data.push(column);
      }
    }

    tabDataRef.current = data;
  }, []);

  const playTab = useCallback(() => {
    if (!synthRef.current?.isReady() || tabDataRef.current.length === 0) return;

    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setActiveNotes([]);
      setCurrentNoteIndex(0);
      positionRef.current = 0;
      beatCountRef.current = 0;
      return;
    }

    setIsPlaying(true);
    positionRef.current = 0;
    beatCountRef.current = 0;

    const beatDuration = 60000 / (tempo * 2);

    const playNextNote = () => {
      const pos = positionRef.current;
      if (pos >= tabDataRef.current.length) {
        // Check if loop is enabled
        if (loopEnabledRef.current) {
          positionRef.current = 0;
          beatCountRef.current = 0;
          // Continue playing from beginning
          return;
        }
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        setActiveNotes([]);
        setCurrentNoteIndex(0);
        positionRef.current = 0;
        beatCountRef.current = 0;
        return;
      }

      // Metronome
      if (metronomeEnabled) {
        const isDownbeat = beatCountRef.current % 4 === 0;
        synthRef.current.playMetronomeTick(isDownbeat);
      }
      beatCountRef.current++;

      const column = tabDataRef.current[pos];
      setActiveNotes(column.notes);
      setCurrentNoteIndex(pos);

      for (const note of column.notes) {
        synthRef.current.playNote(note.string, note.fret, beatDuration / 1000);
      }

      positionRef.current++;
    };

    playNextNote();
    intervalRef.current = setInterval(playNextNote, beatDuration);
  }, [isPlaying, tempo, metronomeEnabled]);

  // Handle clicking a note on the interactive fretboard
  const handleNoteClick = useCallback((stringIdx, fret, note) => {
    if (!synthRef.current?.isReady()) return;
    synthRef.current.playNote(stringIdx, fret, 0.8);
    // Briefly highlight the clicked note
    setActiveNotes([{ string: stringIdx, fret }]);
    setTimeout(() => setActiveNotes([]), 300);
  }, []);

  const regenerate = () => {
    const newTab = generateTab(root, scale, pattern, bars, position);
    setTab(newTab);
    parseTab(newTab);
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopyFeedback('Link copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const copyTab = async () => {
    if (!tab) return;
    await navigator.clipboard.writeText(tab);
    setCopyFeedback('Tab copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const TABPLAYER_MIDI = [64, 59, 55, 50, 45, 40];

  const exportMidi = () => {
    if (tabDataRef.current.length === 0) return;

    // Convert tab data to MIDI notes
    const midiNotes = [];
    for (const col of tabDataRef.current) {
      for (const note of col.notes) {
        const midi = TABPLAYER_MIDI[note.string] + note.fret;
        midiNotes.push({ midi });
      }
    }

    const midiData = createMidiFile(midiNotes, tempo);
    const blob = new Blob([midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${root}_${scale}_${pattern}.mid`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTab = () => {
    if (!tab) return;
    const header = `# ${root} ${scale.replace('_', ' ')} - ${pattern.replace('_', ' ')}\n# Tempo: ${tempo} BPM\n# Generated by guitar.projectlavos.com\n\n`;
    const blob = new Blob([header + tab], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${root}_${scale}_${pattern}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // GP5 API URL (set via env var when API is deployed)
  const GP5_API_URL = import.meta.env.VITE_GP5_API_URL || null;

  const exportGP5 = async () => {
    if (!tab) return;

    if (!GP5_API_URL) {
      alert('Guitar Pro export coming soon! Use Tab or MIDI export for now.');
      return;
    }

    try {
      const response = await fetch(`${GP5_API_URL}/generate-gp5`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          root,
          scale,
          pattern,
          bars,
          tuning: 'standard',
          tempo,
          position,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${root}_${scale}_${pattern}.gp5`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('GP5 export error:', error);
      alert('GP5 export failed. Try Tab or MIDI export instead.');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          playTab();
          break;
        case 'r':
          e.preventDefault();
          regenerate();
          break;
        case 'm':
          e.preventDefault();
          setMetronomeEnabled(prev => !prev);
          break;
        case 'l':
          e.preventDefault();
          setLoopEnabled(prev => !prev);
          break;
        case 'c':
          e.preventDefault();
          copyTab();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setTempo(prev => Math.min(200, prev + 5));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setTempo(prev => Math.max(60, prev - 5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playTab]);

  const scaleNoteNames = scaleInfo ? scaleInfo.notes.split(', ') : [];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-teal-400 hover:text-teal-300" aria-label="Back to home">
              &larr; Back
            </Link>
            <h1 className="text-xl font-bold">Riff Generator</h1>
          </div>
          <div className="flex gap-2 items-center">
            {/* Copy feedback toast */}
            {copyFeedback && (
              <span className="text-teal-400 text-sm animate-pulse">{copyFeedback}</span>
            )}
            <button
              onClick={copyTab}
              disabled={!tab}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm disabled:opacity-50"
              title="Copy tab to clipboard (C)"
              aria-label="Copy tab to clipboard"
            >
              Copy
            </button>
            <button
              onClick={exportTab}
              disabled={!tab}
              className="export-btn-elite export-btn-tab"
              title="Download Tab file"
              aria-label="Download Tab file"
            >
              Tab
            </button>
            <button
              onClick={exportMidi}
              disabled={tabDataRef.current.length === 0}
              className="export-btn-elite export-btn-midi"
              title="Download MIDI file (Premium)"
              aria-label="Download MIDI file"
            >
              MIDI
            </button>
            <button
              onClick={exportGP5}
              disabled={!tab}
              className="export-btn-elite export-btn-gp5"
              title="Download Guitar Pro file"
              aria-label="Download Guitar Pro file"
            >
              GP5
            </button>
            <button
              onClick={copyShareLink}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
              title="Copy share link"
              aria-label="Copy share link"
            >
              Share
            </button>
            <Link
              to={`/tabplayer?tab=${encodeURIComponent(tab)}`}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
              aria-label="Open in TabPlayer"
            >
              TabPlayer
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="settings-panel-elite p-6 space-y-4">
              <h2 className="section-header-elite">Scale Settings</h2>

              {/* Root */}
              <div>
                <label id="root-label" className="block text-sm text-slate-400 mb-2">Root Note</label>
                <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-labelledby="root-label">
                  {ROOTS.map(r => (
                    <button
                      key={r}
                      onClick={() => setRoot(r)}
                      role="radio"
                      aria-checked={root === r}
                      className={`py-2 rounded text-sm root-btn-elite ${
                        root === r ? 'selected' : 'text-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <label htmlFor="scale-select" className="block text-sm text-slate-400 mb-2">Scale</label>
                <select
                  id="scale-select"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="w-full select-elite"
                >
                  {Object.keys(SCALES).map(s => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')} ({SCALES[s].length} notes)
                    </option>
                  ))}
                </select>
              </div>

              {/* Tuning */}
              <div>
                <label htmlFor="tuning-select" className="block text-sm text-slate-400 mb-2">Tuning</label>
                <select
                  id="tuning-select"
                  value={tuning}
                  onChange={(e) => setTuning(e.target.value)}
                  className="w-full select-elite"
                >
                  {TUNING_OPTIONS.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scale Info */}
              {scaleInfo && (
                <div className="scale-info-elite">
                  <div className="text-sm text-slate-400">Notes in scale:</div>
                  <div className="scale-notes-display">{scaleInfo.notes}</div>
                  <div className="text-sm text-slate-500 mt-1">Tuning: {TUNING_OPTIONS.find(t => t.value === tuning)?.label}</div>
                </div>
              )}
            </div>

            <div className="settings-panel-elite p-6 space-y-4">
              <h2 className="section-header-elite">Pattern Settings</h2>

              {/* Pattern */}
              <div>
                <label id="pattern-label" className="block text-sm text-slate-400 mb-2">Pattern</label>
                <div className="space-y-2" role="radiogroup" aria-labelledby="pattern-label">
                  {PATTERNS.map(p => {
                    const isDisabled = p.value === '3nps' && SCALES[scale].length !== 7;
                    return (
                      <button
                        key={p.value}
                        onClick={() => !isDisabled && setPattern(p.value)}
                        disabled={isDisabled}
                        role="radio"
                        aria-checked={pattern === p.value}
                        aria-disabled={isDisabled}
                        className={`w-full text-left pattern-btn-elite ${
                          isDisabled
                            ? 'disabled'
                            : pattern === p.value
                            ? 'selected'
                            : ''
                        }`}
                      >
                        <div className="font-medium">{p.label}</div>
                        <div className="text-sm text-slate-400">{p.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progression Selector (only when progression pattern selected) */}
              {pattern === 'progression' && (
                <div>
                  <label htmlFor="progression-select" className="block text-sm text-slate-400 mb-2">Chord Progression</label>
                  <select
                    id="progression-select"
                    value={progression}
                    onChange={(e) => setProgression(e.target.value)}
                    className="w-full select-elite mb-2"
                  >
                    {PROGRESSION_OPTIONS.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">
                    {PROGRESSION_OPTIONS.find(p => p.value === progression)?.desc}
                  </p>
                </div>
              )}

              {/* Position & Bars */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="position-slider" className="block text-sm text-slate-400 mb-2">Position (1-5)</label>
                  <input
                    id="position-slider"
                    type="range"
                    min="1"
                    max="5"
                    value={position}
                    onChange={(e) => setPosition(parseInt(e.target.value))}
                    className="w-full slider-elite"
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-valuenow={position}
                  />
                  <div className="text-center text-teal-300">{position}</div>
                </div>
                <div>
                  <label htmlFor="bars-slider" className="block text-sm text-slate-400 mb-2">Bars</label>
                  <input
                    id="bars-slider"
                    type="range"
                    min="1"
                    max="8"
                    value={bars}
                    onChange={(e) => setBars(parseInt(e.target.value))}
                    className="w-full slider-elite"
                    aria-valuemin={1}
                    aria-valuemax={8}
                    aria-valuenow={bars}
                  />
                  <div className="text-center text-teal-300">{bars}</div>
                </div>
              </div>

              {/* Tempo */}
              <div>
                <label htmlFor="tempo-slider" className="block text-sm text-slate-400 mb-2">Tempo: {tempo} BPM</label>
                <input
                  id="tempo-slider"
                  type="range"
                  min="60"
                  max="200"
                  value={tempo}
                  onChange={(e) => setTempo(parseInt(e.target.value))}
                  className="w-full slider-elite"
                  aria-valuemin={60}
                  aria-valuemax={200}
                  aria-valuenow={tempo}
                />
              </div>

              {/* Metronome & Loop Toggles */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-400">Metronome</label>
                  <button
                    onClick={() => setMetronomeEnabled(!metronomeEnabled)}
                    aria-pressed={metronomeEnabled}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      metronomeEnabled
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {metronomeEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-400">Loop</label>
                  <button
                    onClick={() => setLoopEnabled(!loopEnabled)}
                    aria-pressed={loopEnabled}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      loopEnabled
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {loopEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Display & Controls */}
          <div className="space-y-6">
            {/* Interactive Fretboard Visualization - Full Neck View */}
            <InteractiveFretboard
              activeNotes={activeNotes}
              scaleNotes={scaleNoteNames}
              root={root}
              position={position}
              onNoteClick={handleNoteClick}
              isPlaying={isPlaying}
              tuning={tuning}
            />

            {/* DAW-Style Playback Controls */}
            <div className="daw-controls-panel">
              <div className="daw-controls-row">
                {/* Play/Stop Button */}
                <button
                  onClick={playTab}
                  disabled={isLoading || tabDataRef.current.length === 0}
                  aria-label={isPlaying ? 'Stop playback' : 'Start playback'}
                  className={`daw-btn ${isPlaying ? 'daw-btn-stop' : 'daw-btn-play'} ${
                    isLoading || tabDataRef.current.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isPlaying ? '■' : '▶'}
                </button>

                {/* Loop Button */}
                <button
                  onClick={() => setLoopEnabled(!loopEnabled)}
                  aria-pressed={loopEnabled}
                  className={`daw-btn daw-btn-loop ${loopEnabled ? 'active' : ''}`}
                >
                  🔁
                </button>

                {/* Metronome Button */}
                <button
                  onClick={() => setMetronomeEnabled(!metronomeEnabled)}
                  aria-pressed={metronomeEnabled}
                  className={`daw-btn daw-btn-metronome ${metronomeEnabled ? 'active' : ''}`}
                >
                  🥁
                </button>

                {/* Tempo Display */}
                <div className="daw-tempo-display">
                  <span className="tempo-value">{tempo}</span>
                  <span className="tempo-unit">BPM</span>
                </div>

                {/* Regenerate Button */}
                <button
                  onClick={regenerate}
                  className="daw-btn daw-btn-regen"
                  aria-label="Regenerate riff"
                >
                  ↻
                </button>
              </div>

              {/* Progress Bar */}
              <div className="daw-progress-container">
                <div className="daw-progress-bar" role="progressbar" aria-valuenow={currentNoteIndex + 1} aria-valuemin={1} aria-valuemax={tabDataRef.current.length || 1}>
                  <div
                    className="daw-progress-fill"
                    style={{ width: `${tabDataRef.current.length > 0 ? (currentNoteIndex / tabDataRef.current.length) * 100 : 0}%` }}
                  />
                </div>
                <div className="daw-progress-labels">
                  <span>{currentNoteIndex + 1} / {tabDataRef.current.length || 0}</span>
                  {loopEnabled && <span className="loop-indicator">⟳ Loop</span>}
                  {isPlaying && <span className="playing-indicator">● Playing</span>}
                </div>
              </div>
            </div>

            <div className="tab-display-elite p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-header-elite">Generated Tab</h2>
                <Link
                  to={`/tabplayer?tab=${encodeURIComponent(tab)}`}
                  className="open-tabplayer-btn"
                  aria-label="Open in Tab Player for professional notation"
                >
                  Open in TabPlayer ↗
                </Link>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm" role="alert">
                  {error}
                </div>
              )}

              {/* Tab Display with Cursor */}
              <div className="tab-text-elite tab-with-cursor">
                <pre className="text-white whitespace-pre" aria-label="Generated guitar tablature">{tab || '// Select a valid pattern'}</pre>
              </div>

              {/* Info */}
              <div className="mt-4 text-sm text-slate-400">
                <p>Position {position} = frets {position === 1 ? '0-4' : `~${(position - 1) * 3}-${(position - 1) * 3 + 4}`}</p>
                <p>{tabDataRef.current.length} notes at {tempo} BPM</p>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="shortcuts-panel-elite">
              <h3 className="font-medium text-slate-300 mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><kbd className="kbd-elite">Space</kbd> Play/Stop</div>
                <div><kbd className="kbd-elite">R</kbd> Regenerate</div>
                <div><kbd className="kbd-elite">M</kbd> Metronome</div>
                <div><kbd className="kbd-elite">L</kbd> Loop</div>
                <div><kbd className="kbd-elite">C</kbd> Copy Tab</div>
                <div><kbd className="kbd-elite">&uarr;/&darr;</kbd> Tempo</div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
