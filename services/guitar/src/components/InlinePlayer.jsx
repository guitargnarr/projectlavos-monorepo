import { useState, useRef, useEffect } from 'react';
import * as alphaTab from '@coderline/alphatab';
import PropTypes from 'prop-types';

/**
 * Inline GP file player - renders in a modal/drawer without page navigation
 */
export default function InlinePlayer({ filename, title, onClose }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soundFontReady, setSoundFontReady] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !filename) return;

    const loadPlayer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = new alphaTab.AlphaTabApi(containerRef.current, {
          core: {
            engine: 'html5',
            fontDirectory: '/font/',
          },
          display: {
            layoutMode: 'page',
            staveProfile: 'tab',
            scale: 0.85,
            stretchForce: 1.0,
            resources: {
              mainGlyphColor: new alphaTab.model.Color(255, 255, 255, 255),
              secondaryGlyphColor: new alphaTab.model.Color(200, 200, 200, 255),
              scoreInfoColor: new alphaTab.model.Color(255, 255, 255, 255),
              barNumberColor: new alphaTab.model.Color(45, 212, 191, 255),
              tabNumberColor: new alphaTab.model.Color(255, 255, 255, 255),
              staffLineColor: new alphaTab.model.Color(100, 116, 139, 255),
              barSeparatorColor: new alphaTab.model.Color(100, 116, 139, 255),
            },
          },
          notation: {
            rhythmMode: 'showWithBars',
          },
          player: {
            enablePlayer: true,
            enableUserInteraction: true,
            enableCursor: true,
            enableAnimatedBeatCursor: true,
            scrollElement: containerRef.current,
            scrollOffsetY: -50,
            scrollMode: 'continuous',
            soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
          },
        });

        apiRef.current = api;

        api.playerStateChanged.on((e) => {
          setIsPlaying(e.state === alphaTab.synth.PlayerState.Playing);
        });

        api.soundFontLoaded.on(() => {
          setSoundFontReady(true);
        });

        const response = await fetch(`/tabs/${filename}`);
        if (!response.ok) {
          throw new Error(`File not found: ${filename}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        api.load(new Uint8Array(arrayBuffer));

        setIsLoading(false);
      } catch (err) {
        console.error('Player error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadPlayer();

    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
  }, [filename]);

  const handlePlay = () => {
    if (apiRef.current && soundFontReady) {
      apiRef.current.play();
    }
  };

  const handleStop = () => {
    if (apiRef.current) {
      apiRef.current.stop();
    }
  };

  const handleTempoChange = (newTempo) => {
    setTempo(newTempo);
    if (apiRef.current) {
      apiRef.current.playbackSpeed = newTempo / 120;
    }
  };

  const handleLoopToggle = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    if (apiRef.current) {
      apiRef.current.isLooping = newLoop;
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      {/* Modal panel */}
      <div className="w-full max-w-5xl bg-slate-900 rounded-t-2xl shadow-2xl border-t border-slate-700 max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white truncate max-w-md">
              {title || filename.replace('.gp', '').replace(/-/g, ' ')}
            </h2>
            <p className="text-sm text-slate-400">{filename}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close player"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-b border-slate-700 flex flex-wrap items-center gap-4">
          <button
            onClick={handlePlay}
            disabled={isLoading || !soundFontReady || isPlaying}
            className="px-5 py-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            Play
          </button>

          <button
            onClick={handleStop}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            Stop
          </button>

          <button
            onClick={handleLoopToggle}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              isLooping
                ? 'bg-orange-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Loop {isLooping ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-slate-400">Tempo: {tempo} BPM</span>
            <input
              type="range"
              min="40"
              max="200"
              value={tempo}
              onChange={(e) => handleTempoChange(parseInt(e.target.value))}
              className="w-32 accent-teal-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {error ? (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 text-center">
              <p className="text-red-300 font-medium">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="min-h-[300px] rounded-lg"
              style={{ width: '100%' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

InlinePlayer.propTypes = {
  filename: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
