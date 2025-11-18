import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Soundfont from 'soundfont-player';
import * as alphaTab from '@coderline/alphatab';

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
  const [searchParams] = useSearchParams();
  const gpFileName = searchParams.get('file') || 'pentatonic-major.gp';

  const [tab, setTab] = useState(DEFAULT_TAB);
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    const savedSpeed = localStorage.getItem('guitar-practice-speed');
    return savedSpeed ? parseFloat(savedSpeed) : 1.0;
  });

  const synthRef = useRef(null);
  const tabDataRef = useRef([]);
  const playIntervalRef = useRef(null);
  const beatCountRef = useRef(0);

  // alphaTab refs
  const alphaTabContainerRef = useRef(null);
  const alphaTabApiRef = useRef(null);
  const [gpFileLoading, setGpFileLoading] = useState(false);
  const [gpFileError, setGpFileError] = useState(null);
  const [soundFontLoaded, setSoundFontLoaded] = useState(false);

  const parseTab = useCallback((lines) => {
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
  }, []);

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
  }, [tab, parseTab]);

  // Initialize alphaTab
  useEffect(() => {
    if (!alphaTabContainerRef.current) return;

    const loadGPFile = async () => {
      try {
        setGpFileLoading(true);
        setGpFileError(null);

        // Initialize alphaTab with Canvas rendering and audio playback
        const api = new alphaTab.AlphaTabApi(alphaTabContainerRef.current, {
          core: {
            engine: 'html5', // Canvas rendering
            fontDirectory: '/font/', // Point to public/font/ directory
          },
          display: {
            layoutMode: 'horizontal',
          },
          player: {
            enablePlayer: true,
            enableUserInteraction: true,
            soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
          },
        });

        alphaTabApiRef.current = api;

        // Add player state event listeners
        api.playerStateChanged.on((e) => {
          setIsPlaying(e.state === alphaTab.synth.PlayerState.Playing);
        });

        // Player ready event
        api.playerReady.on(() => {
          console.log('alphaTab player ready');
          // Apply initial playback speed
          const tempoMultiplier = tempo / 120;
          const finalSpeed = tempoMultiplier * playbackSpeed;
          api.playbackSpeed = finalSpeed;
        });

        // SoundFont loaded event
        api.soundFontLoaded.on(() => {
          console.log('alphaTab soundfont loaded');
          setSoundFontLoaded(true);
        });

        // Render finished event (handles large files)
        api.renderFinished.on(() => {
          console.log('alphaTab render finished');
        });

        // Load GP file from URL param or default
        const response = await fetch(`/tabs/${gpFileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load GP file: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        api.load(new Uint8Array(arrayBuffer));

        setGpFileLoading(false);
      } catch (error) {
        console.error('alphaTab initialization error:', error);
        setGpFileError(`Failed to load Guitar Pro file: ${error.message}`);
        setGpFileLoading(false);
      }
    };

    loadGPFile();

    return () => {
      if (alphaTabApiRef.current) {
        alphaTabApiRef.current.destroy();
      }
    };
  }, [gpFileName]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentPosition(0);
    beatCountRef.current = 0;

    // Stop alphaTab player if available
    if (alphaTabApiRef.current) {
      alphaTabApiRef.current.stop();
    }

    // Also stop custom MIDI player
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }, []);

  const playNextNote = useCallback(() => {
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
  }, [tempo, currentPosition, isLooping, metronomeEnabled, stop]);

  const play = () => {
    if (isPlaying) return;

    // Only use alphaTab player (deprecate custom MIDI player)
    if (alphaTabApiRef.current) {
      alphaTabApiRef.current.play();
      setIsPlaying(true);
    }
    // Old custom MIDI player removed - alphaTab handles all playback
  };

  const handleTempoChange = (newTempo) => {
    setTempo(newTempo);

    // Update alphaTab playback speed if available
    if (alphaTabApiRef.current) {
      // alphaTab uses playbackSpeed as a multiplier
      // Calculate speed relative to 120 BPM (default), then apply practice speed
      const tempoMultiplier = newTempo / 120;
      const finalSpeed = tempoMultiplier * playbackSpeed;
      alphaTabApiRef.current.playbackSpeed = finalSpeed;
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    localStorage.setItem('guitar-practice-speed', newSpeed.toString());

    // Update alphaTab playback speed if available
    if (alphaTabApiRef.current) {
      const tempoMultiplier = tempo / 120;
      const finalSpeed = tempoMultiplier * newSpeed;
      alphaTabApiRef.current.playbackSpeed = finalSpeed;
    }
  };

  const toggleLoop = () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);

    // Update alphaTab isLooping if available
    if (alphaTabApiRef.current) {
      alphaTabApiRef.current.isLooping = newLoopState;
    }
  };

  const loadExercise = (type) => {
    const newTab = EXERCISES[type];
    setTab(newTab);
    parseTab(newTab);
    stop();
  };

  // Old MIDI player useEffect removed - alphaTab handles all playback now
  // Quick Exercises section remains as visual reference only

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex gap-4">
        <Link to="/" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <Link to="/catalog" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Back to Catalog
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
            disabled={isPlaying || isLoading || gpFileLoading || !soundFontLoaded}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-6 py-3 rounded font-medium transition-colors min-h-[44px]"
          >
            {isLoading ? 'Loading...' : gpFileLoading ? 'Loading GP...' : !soundFontLoaded ? 'Loading Audio...' : 'Play'}
          </button>
          <button
            onClick={stop}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded font-medium transition-colors min-h-[44px]"
          >
            Stop
          </button>
          <button
            onClick={toggleLoop}
            className={`px-6 py-3 rounded font-medium transition-colors min-h-[44px] ${
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
              onChange={(e) => handleTempoChange(parseInt(e.target.value))}
              className="w-48 h-11 accent-blue-500"
            />
          </div>

          <label htmlFor="metronome" className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              id="metronome"
              checked={metronomeEnabled}
              onChange={(e) => setMetronomeEnabled(e.target.checked)}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium">Metronome</span>
          </label>

          <button
            onClick={() => setPracticeMode(!practiceMode)}
            className={`px-6 py-3 rounded font-medium transition-colors min-h-[44px] ${
              practiceMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
          >
            {practiceMode ? 'Practice Mode: ON' : 'Practice Mode: OFF'}
          </button>
        </div>

        {practiceMode && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-lg font-semibold mb-4 text-purple-400">Practice Tools</h4>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium whitespace-nowrap">
                  Playback Speed:
                  <span className="ml-2 text-purple-400 font-bold text-lg">{playbackSpeed}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.25"
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-64 h-11 accent-purple-500"
                />
              </div>
              <div className="flex gap-2">
                {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Slow down difficult passages to practice technique, then gradually increase speed as you improve.
            </p>
          </div>
        )}
      </div>

      {/* alphaTab Guitar Pro File Rendering */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-blue-400">
          Guitar Pro File: {gpFileName.replace('.gp', '').replace(/-/g, ' ')}
        </h3>

        {gpFileLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-3"></div>
            <p className="text-blue-300 font-medium">Loading Guitar Pro file...</p>
          </div>
        )}

        {gpFileError && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-300 font-medium">{gpFileError}</p>
          </div>
        )}

        <div
          ref={alphaTabContainerRef}
          className="overflow-x-auto min-h-[200px]"
          style={{ minHeight: '300px' }}
        />
      </div>
    </div>
  );
}
