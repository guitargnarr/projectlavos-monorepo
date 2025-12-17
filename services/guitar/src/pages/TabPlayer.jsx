import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as alphaTab from '@coderline/alphatab';
import GuitarSynthesizer from '../lib/GuitarSynthesizer';

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
  const inlineTab = searchParams.get('tab'); // Support inline tab from /riff command

  // Parse inline tab if provided
  const parseInlineTab = (tabString) => {
    if (!tabString) return null;
    const decoded = decodeURIComponent(tabString);
    const lines = decoded.split('\n').filter(line =>
      line.trim().match(/^[eEBGDA]\|/)
    );
    return lines.length === 6 ? lines : null;
  };

  const initialTab = parseInlineTab(inlineTab) || DEFAULT_TAB;
  const [tab, setTab] = useState(initialTab);
  const [useInlineMode, setUseInlineMode] = useState(!!inlineTab);
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

  // alphaTab refs
  const alphaTabContainerRef = useRef(null);
  const alphaTabApiRef = useRef(null);
  const [gpFileLoading, setGpFileLoading] = useState(false);
  const [gpFileError, setGpFileError] = useState(null);
  const [soundFontLoaded, setSoundFontLoaded] = useState(false);

  const parseTab = useCallback((lines) => {
    const cleanedLines = lines.map(line => line.substring(2)); // Remove "e|" prefix
    const data = [];

    // Parse each string separately to handle multi-digit frets
    const stringNotes = cleanedLines.map(line => {
      const notes = [];
      let i = 0;
      while (i < line.length) {
        // Skip non-digit characters
        if (!/\d/.test(line[i])) {
          i++;
          continue;
        }
        // Found a digit - collect all consecutive digits
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

    // Find all unique note positions across all strings
    const allPositions = new Set();
    stringNotes.forEach(notes => {
      notes.forEach(n => allPositions.add(n.position));
    });
    const sortedPositions = Array.from(allPositions).sort((a, b) => a - b);

    // Build columns at each position
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

  // Initialize alphaTab (skip if using inline tab mode)
  useEffect(() => {
    if (!alphaTabContainerRef.current || useInlineMode) return;

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
            layoutMode: 'page', // Page layout - bars wrap to new rows
            staveProfile: 'tab', // Optimized for tab display
            scale: 0.9, // Slightly smaller for better fit
            stretchForce: 1.0, // Full stretch to fill width naturally
            resources: {
              // White/light colors for dark theme visibility using alphaTab.model.Color
              mainGlyphColor: new alphaTab.model.Color(255, 255, 255, 255), // White notes/stems
              secondaryGlyphColor: new alphaTab.model.Color(200, 200, 200, 255), // Light gray secondary
              scoreInfoColor: new alphaTab.model.Color(255, 255, 255, 255), // White score info
              barNumberColor: new alphaTab.model.Color(45, 212, 191, 255), // Teal bar numbers
              tabNumberColor: new alphaTab.model.Color(255, 255, 255, 255), // WHITE TAB NUMBERS
              staffLineColor: new alphaTab.model.Color(100, 116, 139, 255), // Slate-500 staff lines
              barSeparatorColor: new alphaTab.model.Color(100, 116, 139, 255), // Slate-500 bar lines
            },
          },
          notation: {
            rhythmMode: 'showWithBars', // Show rhythm notation
          },
          player: {
            enablePlayer: true,
            enableUserInteraction: true,
            enableCursor: true, // Show playback cursor
            enableAnimatedBeatCursor: true, // Smooth cursor animation
            scrollElement: alphaTabContainerRef.current, // Auto-scroll container
            scrollOffsetX: 0, // No horizontal offset needed for page layout
            scrollOffsetY: -100, // Keep cursor 100px from top during vertical scroll
            scrollMode: 'continuous', // Smooth continuous scrolling (vertical for page layout)
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
          // Player initialized
        });

        // SoundFont loaded event
        api.soundFontLoaded.on(() => {
          setSoundFontLoaded(true);
        });

        // Render finished event (handles large files)
        api.renderFinished.on(() => {
          // Render complete
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
  }, [gpFileName, useInlineMode]);

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

  // Use ref to track position to avoid stale closure issues
  const positionRef = useRef(0);

  const playNextNote = useCallback(() => {
    const beatDuration = 60000 / (tempo * 2);
    positionRef.current = 0; // Reset position when starting

    playIntervalRef.current = setInterval(() => {
      const pos = positionRef.current;

      if (pos >= tabDataRef.current.length) {
        if (isLooping) {
          positionRef.current = 0;
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

      positionRef.current = pos + 1;
      setCurrentPosition(pos + 1);
    }, beatDuration);
  }, [tempo, isLooping, metronomeEnabled, stop]);

  const play = () => {
    if (isPlaying) return;

    // Use inline MIDI player for tab param, alphaTab for GP files
    if (useInlineMode && synthRef.current?.isReady()) {
      setIsPlaying(true);
      playNextNote();
    } else if (alphaTabApiRef.current) {
      alphaTabApiRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTempoChange = (newTempo) => {
    setTempo(newTempo);

    // Update alphaTab playback speed if available
    if (alphaTabApiRef.current) {
      // alphaTab uses playbackSpeed as a multiplier
      // Calculate speed relative to 120 BPM (default)
      const speedMultiplier = newTempo / 120;
      alphaTabApiRef.current.playbackSpeed = speedMultiplier;
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
        <Link to="/" className="text-teal-400 hover:text-teal-300 flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <Link to="/catalog" className="text-teal-400 hover:text-teal-300 flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Back to Catalog
        </Link>
      </div>

      <header className="text-center mb-8 py-6 rounded-xl header-elite">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Guitar Tab Player</h1>
        <p className="text-gray-400">Practice with Interactive Tab Playback</p>
      </header>

      {isLoading && (
        <div className="bg-teal-900/30 border border-teal-500 rounded-lg p-6 mb-6 text-center controls-panel-glass">
          <div className="spinner-elite mx-auto mb-3"></div>
          <p className="text-teal-300 font-medium">Loading guitar soundfont...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
        </div>
      )}

      {loadError && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 mb-6">
          <p className="text-red-300 font-medium">{loadError}</p>
        </div>
      )}

      <div className="rounded-xl p-6 mb-6 controls-panel-glass">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={play}
            disabled={isPlaying || isLoading || (useInlineMode ? false : (gpFileLoading || !soundFontLoaded))}
            className={`btn-play disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isPlaying ? 'playing' : ''}`}
          >
            <span className="text-lg">
              {isLoading ? '...' : useInlineMode ? '▶' : (gpFileLoading ? '◌' : (!soundFontLoaded ? '◌' : '▶'))}
            </span>
          </button>
          <button
            onClick={stop}
            className="btn-stop flex items-center justify-center"
          >
            <span className="text-lg">■</span>
          </button>
          <button
            onClick={toggleLoop}
            className={`btn-loop ${isLooping ? 'active' : ''}`}
          >
            {isLooping ? '🔁 Loop ON' : '🔁 Loop OFF'}
          </button>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium tempo-label">Tempo: {tempo} BPM</label>
            <input
              type="range"
              min="40"
              max="200"
              value={tempo}
              onChange={(e) => handleTempoChange(parseInt(e.target.value))}
              className="w-48 h-11 tempo-slider"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <div
              className={`metronome-switch ${metronomeEnabled ? 'active' : ''}`}
              onClick={() => setMetronomeEnabled(!metronomeEnabled)}
            />
            <span className="text-sm font-medium text-white">Metronome</span>
          </label>
        </div>

        {/* Progress bar */}
        {isPlaying && tabDataRef.current.length > 0 && (
          <div className="mt-4 progress-bar-elite">
            <div
              className="fill"
              style={{ width: `${(currentPosition / tabDataRef.current.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Inline Tab Display (from /riff command) */}
      {useInlineMode && (
        <div className="rounded-xl p-6 mb-6 sheet-music-container controls-panel-glass">
          <h3 className="text-xl font-bold mb-4 gradient-text">
            AI-Generated Riff (E Phrygian)
          </h3>
          <pre className="font-mono text-sm sm:text-base bg-gray-900/80 p-4 rounded-lg overflow-x-auto text-green-400 border border-gray-700">
            {tab.join('\n')}
          </pre>
          <p className="text-gray-400 text-sm mt-3">
            Generated by /riff command with auto-correction for scale accuracy
          </p>
        </div>
      )}

      {/* alphaTab Guitar Pro File Rendering (only if not inline mode) */}
      {!useInlineMode && (
        <div className="rounded-xl p-6 mb-6 sheet-music-container controls-panel-glass">
          <h3 className="text-xl font-bold mb-4 gradient-text">
            Guitar Pro File: {gpFileName.replace('.gp', '').replace(/-/g, ' ')}
          </h3>

          {gpFileLoading && (
            <div className="text-center py-8">
              <div className="spinner-elite mx-auto mb-3"></div>
              <p className="text-teal-300 font-medium">Loading Guitar Pro file...</p>
            </div>
          )}

          {gpFileError && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-300 font-medium">{gpFileError}</p>
            </div>
          )}

          <div
            ref={alphaTabContainerRef}
            className="tabplayer-viewport rounded-lg"
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}
