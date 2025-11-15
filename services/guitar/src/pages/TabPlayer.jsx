import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Soundfont from 'soundfont-player';

class GuitarSynthesizer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.instrument = null;
    this.loading = true;
    // Guitar string MIDI note numbers (standard tuning E-A-D-G-B-e)
    this.stringBaseMidi = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2
  }

  async loadInstrument() {
    try {
      this.instrument = await Soundfont.instrument(this.audioContext, 'acoustic_guitar_nylon');
      this.loading = false;
      return true;
    } catch (error) {
      console.error('Failed to load soundfont:', error);
      this.loading = false;
      return false;
    }
  }

  playNote(string, fret, duration = 0.5) {
    if (!this.instrument || this.loading) return;

    const midiNote = this.stringBaseMidi[string] + fret;
    this.instrument.play(midiNote, this.audioContext.currentTime, { duration, gain: 0.8 });
  }

  playMetronomeTick(isDownbeat = false) {
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.value = isDownbeat ? 1000 : 800;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    const masterGain = this.audioContext.createGain();
    masterGain.connect(this.audioContext.destination);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  isReady() {
    return !this.loading && this.instrument !== null;
  }
}

const DEFAULT_TAB = [
  'e|--0-----0-----0-----0-----|',
  'B|----3-----3-----3-----3---|',
  'G|------0-----0-----0-----0-|',
  'D|--------------------------|',
  'A|--------------------------|',
  'E|--3-----3-----3-----3-----|'
];

const EXERCISES = {
  chromatic: [
    'e|--1--2--3--4--5--4--3--2--1--------------|',
    'B|--1--2--3--4--5--4--3--2--1--------------|',
    'G|--1--2--3--4--5--4--3--2--1--------------|',
    'D|--1--2--3--4--5--4--3--2--1--------------|',
    'A|--1--2--3--4--5--4--3--2--1--------------|',
    'E|--1--2--3--4--5--4--3--2--1--------------|'
  ],
  pentatonic: [
    'e|--5--8--5--8--5--8--5--8-----------------|',
    'B|--5--8--5--8--5--8--5--8-----------------|',
    'G|--5--7--5--7--5--7--5--7-----------------|',
    'D|--5--7--5--7--5--7--5--7-----------------|',
    'A|--5--7--5--7--5--7--5--7-----------------|',
    'E|--5--8--5--8--5--8--5--8-----------------|'
  ],
  chords: [
    'e|--0-----0-----2-----3-----0--------------|',
    'B|--1-----0-----3-----0-----1--------------|',
    'G|--0-----0-----2-----0-----2--------------|',
    'D|--2-----0-----0-----0-----2--------------|',
    'A|--3-----2-----------2-----0--------------|',
    'E|--------3-----------3--------------------|'
  ]
};

export default function TabPlayer() {
  const [tab, setTab] = useState(DEFAULT_TAB);
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const synthRef = useRef(null);
  const tabDataRef = useRef([]);
  const playIntervalRef = useRef(null);
  const beatCountRef = useRef(0);

  useEffect(() => {
    const initSynth = async () => {
      synthRef.current = new GuitarSynthesizer();
      const success = await synthRef.current.loadInstrument();
      if (success) {
        setIsLoading(false);
      } else {
        setLoadError('Failed to load guitar soundfont. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initSynth();
    parseTab(tab);

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  const parseTab = (lines) => {
    const cleanedLines = lines.map(line => line.substring(2));
    const minLength = Math.min(...cleanedLines.map(line => line.length));
    const data = [];

    for (let pos = 0; pos < minLength; pos++) {
      const column = { notes: [], duration: 1 };
      for (let string = 0; string < 6; string++) {
        const char = cleanedLines[string][pos];
        if (char && char.match(/\d/)) {
          column.notes.push({ string, fret: parseInt(char) });
        }
      }
      if (column.notes.length > 0) {
        data.push(column);
      }
    }

    tabDataRef.current = data;
  };

  const play = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playNextNote();
  };

  const playNextNote = () => {
    const beatDuration = 60000 / (tempo * 2);

    playIntervalRef.current = setInterval(() => {
      const pos = currentPosition;

      if (pos >= tabDataRef.current.length) {
        if (isLooping) {
          setCurrentPosition(0);
          beatCountRef.current = 0;
        } else {
          stop();
        }
        return;
      }

      const column = tabDataRef.current[pos];
      if (column && column.notes.length > 0) {
        column.notes.forEach(note => {
          synthRef.current.playNote(note.string, note.fret);
        });
      }

      if (metronomeEnabled) {
        synthRef.current.playMetronomeTick(beatCountRef.current % 4 === 0);
        beatCountRef.current++;
      }

      setCurrentPosition(pos + 1);
    }, beatDuration);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentPosition(0);
    beatCountRef.current = 0;
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  };

  const loadExercise = (type) => {
    const newTab = EXERCISES[type];
    setTab(newTab);
    parseTab(newTab);
    stop();
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }

    playNextNote();

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentPosition, tempo, isLooping, metronomeEnabled]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-blue-400">Guitar Tab Player</h1>
        <p className="text-gray-400">Practice with Interactive Tab Playback</p>
      </header>

      {isLoading && (
        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-6 mb-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-3"></div>
          <p className="text-blue-300 font-medium">Loading guitar soundfont...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
        </div>
      )}

      {loadError && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 mb-6">
          <p className="text-red-300 font-medium">{loadError}</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={play}
            disabled={isPlaying || isLoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            {isLoading ? 'Loading...' : 'Play'}
          </button>
          <button
            onClick={stop}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Stop
          </button>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              isLooping ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
          >
            {isLooping ? 'Loop: ON' : 'Loop: OFF'}
          </button>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Tempo: {tempo} BPM</label>
            <input
              type="range"
              min="40"
              max="200"
              value={tempo}
              onChange={(e) => setTempo(parseInt(e.target.value))}
              className="w-32 accent-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="metronome"
              checked={metronomeEnabled}
              onChange={(e) => setMetronomeEnabled(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="metronome" className="text-sm font-medium">Metronome</label>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700 overflow-x-auto">
        <div className="font-mono text-lg">
          {tab.map((line, i) => (
            <div key={i} className="text-green-400 whitespace-pre">
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-blue-400">Quick Exercises</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => loadExercise('chromatic')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Chromatic Exercise
          </button>
          <button
            onClick={() => loadExercise('pentatonic')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Pentatonic Scale
          </button>
          <button
            onClick={() => loadExercise('chords')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Chord Progression
          </button>
        </div>
      </div>
    </div>
  );
}
