import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * EarTraining component - Interval recognition game
 *
 * Features:
 * - 5 progressive difficulty levels (perfect intervals → all intervals)
 * - Web Audio API tone generation
 * - Score tracking with localStorage persistence
 * - Visual feedback (green/red color coding)
 * - Reference player to hear each interval
 * - Ascending/descending interval playback
 * - Celebration animations on correct answers
 */

// Interval definitions with semitone offsets
const INTERVALS = {
  'Unison': 0,
  'Minor 2nd': 1,
  'Major 2nd': 2,
  'Minor 3rd': 3,
  'Major 3rd': 4,
  'Perfect 4th': 5,
  'Tritone': 6,
  'Perfect 5th': 7,
  'Minor 6th': 8,
  'Major 6th': 9,
  'Minor 7th': 10,
  'Major 7th': 11,
  'Octave': 12,
};

// Difficulty levels with their interval sets
const DIFFICULTY_LEVELS = {
  1: {
    name: 'Perfect Intervals',
    intervals: ['Unison', 'Perfect 4th', 'Perfect 5th', 'Octave'],
    color: 'green',
  },
  2: {
    name: 'Major/Minor 3rds & 6ths',
    intervals: ['Minor 3rd', 'Major 3rd', 'Minor 6th', 'Major 6th'],
    color: 'blue',
  },
  3: {
    name: 'Major/Minor 2nds & 7ths',
    intervals: ['Minor 2nd', 'Major 2nd', 'Minor 7th', 'Major 7th'],
    color: 'purple',
  },
  4: {
    name: 'Tritone Challenge',
    intervals: ['Perfect 4th', 'Tritone', 'Perfect 5th'],
    color: 'red',
  },
  5: {
    name: 'All Intervals',
    intervals: Object.keys(INTERVALS),
    color: 'yellow',
  },
};

// Audio context for Web Audio API
let audioContext = null;

// Initialize audio context on user interaction
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a single tone using Web Audio API
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {number} startTime - When to start (in AudioContext time)
 */
const playTone = (frequency, duration, startTime = 0) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  // Envelope: fade in/out to avoid clicks
  const now = ctx.currentTime + startTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
  gainNode.gain.linearRampToValueAtTime(0.3, now + duration - 0.01);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration);

  return oscillator;
};

/**
 * Calculate frequency from semitone offset
 * Using A4 = 440Hz as base, 12-TET tuning
 * @param {number} semitones - Semitones from A4
 */
const getFrequency = (semitones) => {
  return 440 * Math.pow(2, semitones / 12);
};

/**
 * Play an interval (two notes in sequence)
 * @param {number} semitones - Interval size in semitones
 * @param {boolean} ascending - Play ascending or descending
 */
const playInterval = (semitones, ascending = true) => {
  const baseNote = 0; // A4
  const noteDuration = 0.6;
  const gap = 0.1;

  const firstFreq = getFrequency(baseNote);
  const secondFreq = getFrequency(baseNote + (ascending ? semitones : -semitones));

  playTone(firstFreq, noteDuration, 0);
  playTone(secondFreq, noteDuration, noteDuration + gap);
};

/**
 * DifficultySelector component
 */
function DifficultySelector({ level, onLevelChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Difficulty Level
      </label>
      <select
        value={level}
        onChange={(e) => onLevelChange(Number(e.target.value))}
        className="w-full bg-gray-700 text-gray-100 rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(DIFFICULTY_LEVELS).map(([lvl, config]) => (
          <option key={lvl} value={lvl}>
            Level {lvl}: {config.name}
          </option>
        ))}
      </select>
    </div>
  );
}

DifficultySelector.propTypes = {
  level: PropTypes.number.isRequired,
  onLevelChange: PropTypes.func.isRequired,
};

/**
 * ScoreDisplay component
 */
function ScoreDisplay({ correct, total, highScore }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-700 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-400">{correct}</div>
        <div className="text-xs text-gray-400">Correct</div>
      </div>
      <div className="bg-gray-700 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-blue-400">{accuracy}%</div>
        <div className="text-xs text-gray-400">Accuracy</div>
      </div>
      <div className="bg-gray-700 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
        <div className="text-xs text-gray-400">High Score</div>
      </div>
    </div>
  );
}

ScoreDisplay.propTypes = {
  correct: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  highScore: PropTypes.number.isRequired,
};

/**
 * ProgressBar component
 */
function ProgressBar({ correct, total }) {
  const percentage = total > 0 ? (correct / total) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Progress</span>
        <span>{correct} / {total}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  correct: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

/**
 * AnswerButton component
 */
function AnswerButton({ label, onClick, feedback }) {
  let bgColor = 'bg-gray-700 hover:bg-gray-600';
  let textColor = 'text-gray-100';
  let borderColor = 'border-gray-600';

  if (feedback === 'correct') {
    bgColor = 'bg-green-500';
    textColor = 'text-white';
    borderColor = 'border-green-400';
  } else if (feedback === 'incorrect') {
    bgColor = 'bg-red-500';
    textColor = 'text-white';
    borderColor = 'border-red-400';
  }

  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} ${borderColor} border-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 hover:scale-105 active:scale-95`}
    >
      {label}
    </button>
  );
}

AnswerButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  feedback: PropTypes.oneOf(['none', 'correct', 'incorrect']),
};

/**
 * ReferencePlayer component - Click to hear any interval
 */
function ReferencePlayer({ ascending }) {
  const playReference = (intervalName) => {
    const semitones = INTERVALS[intervalName];
    playInterval(semitones, ascending);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-300 mb-3">
        Reference Player (click to hear)
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Object.keys(INTERVALS).map((intervalName) => (
          <button
            key={intervalName}
            onClick={() => playReference(intervalName)}
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 rounded px-2 py-1 text-xs transition-colors"
          >
            {intervalName}
          </button>
        ))}
      </div>
    </div>
  );
}

ReferencePlayer.propTypes = {
  ascending: PropTypes.bool.isRequired,
};

/**
 * Main EarTraining component
 */
export default function EarTraining() {
  const [level, setLevel] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [highScore, setHighScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const celebrationTimeout = useRef(null);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('guitar-ear-training-scores');
    if (saved) {
      try {
        const scores = JSON.parse(saved);
        setHighScore(scores.highScore || 0);
      } catch (e) {
        console.error('Failed to load high score:', e);
      }
    }
  }, []);

  // Save high score to localStorage
  useEffect(() => {
    if (score.correct > highScore) {
      setHighScore(score.correct);
      localStorage.setItem('guitar-ear-training-scores', JSON.stringify({
        highScore: score.correct,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [score.correct, highScore]);

  // Generate new random interval
  const generateInterval = () => {
    const availableIntervals = DIFFICULTY_LEVELS[level].intervals;
    const randomInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
    setCurrentInterval(randomInterval);
    setFeedback({});
    playInterval(INTERVALS[randomInterval], ascending);
  };

  // Handle answer selection
  const handleAnswer = (selectedInterval) => {
    if (feedback[selectedInterval]) return; // Already answered

    const isCorrect = selectedInterval === currentInterval;

    setFeedback({
      [selectedInterval]: isCorrect ? 'correct' : 'incorrect',
      [currentInterval]: 'correct',
    });

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      setShowCelebration(true);
      celebrationTimeout.current = setTimeout(() => {
        setShowCelebration(false);
      }, 1000);

      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        generateInterval();
      }, 1500);
    }
  };

  // Replay current interval
  const replayInterval = () => {
    if (currentInterval) {
      playInterval(INTERVALS[currentInterval], ascending);
    }
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    generateInterval();
  };

  // Reset game
  const resetGame = () => {
    setScore({ correct: 0, total: 0 });
    setFeedback({});
    setCurrentInterval(null);
    setGameStarted(false);
  };

  // Change level
  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    resetGame();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (celebrationTimeout.current) {
        clearTimeout(celebrationTimeout.current);
      }
    };
  }, []);

  const levelConfig = DIFFICULTY_LEVELS[level];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Interval Ear Training
        </h1>
        <p className="text-gray-400">
          Develop your pitch recognition skills by identifying musical intervals
        </p>
      </header>

      {/* Main game area */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {/* Difficulty selector */}
        <DifficultySelector level={level} onLevelChange={handleLevelChange} />

        {/* Settings */}
        <div className="mb-6">
          <label className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3 cursor-pointer">
            <span className="text-gray-300">Play Ascending</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={ascending}
                onChange={(e) => setAscending(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-14 h-8 rounded-full transition-colors ${ascending ? 'bg-green-500' : 'bg-gray-600'}`}>
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${ascending ? 'translate-x-6' : ''}`} />
              </div>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-1">
            {ascending ? 'Notes play low to high' : 'Notes play high to low'}
          </p>
        </div>

        {!gameStarted ? (
          /* Start screen */
          <div className="text-center py-8">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-8 rounded-lg text-xl hover:scale-105 transition-transform"
            >
              Start Training
            </button>
            <div className="mt-6 text-sm text-gray-400">
              Level {level}: {levelConfig.name}
            </div>
          </div>
        ) : (
          <>
            {/* Score display */}
            <ScoreDisplay correct={score.correct} total={score.total} highScore={highScore} />

            {/* Progress bar */}
            <ProgressBar correct={score.correct} total={score.total} />

            {/* Play controls */}
            <div className="mb-6 flex justify-center gap-4">
              <button
                onClick={replayInterval}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Replay Interval
              </button>

              <button
                onClick={generateInterval}
                className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Skip
              </button>

              <button
                onClick={resetGame}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Celebration animation */}
            {showCelebration && (
              <div className="mb-4 text-center animate-bounce">
                <span className="text-4xl">🎉</span>
                <span className="text-2xl font-bold text-green-400 ml-2">Correct!</span>
              </div>
            )}

            {/* Answer buttons */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                What interval did you hear?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {levelConfig.intervals.map((intervalName) => (
                  <AnswerButton
                    key={intervalName}
                    label={intervalName}
                    onClick={() => handleAnswer(intervalName)}
                    feedback={feedback[intervalName] || 'none'}
                  />
                ))}
              </div>
            </div>

            {/* Reference player */}
            <ReferencePlayer ascending={ascending} />
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">How to Play</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Select your difficulty level (start with Level 1 if you are new)</li>
          <li>Click &quot;Start Training&quot; to begin</li>
          <li>Listen to the interval (two notes played in sequence)</li>
          <li>Click the button matching the interval you heard</li>
          <li>Green = correct, red = incorrect</li>
          <li>Use the reference player to learn intervals by ear</li>
          <li>Track your progress and try to beat your high score!</li>
        </ol>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Tips for Success</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
            <li>Start with perfect intervals to build a foundation</li>
            <li>Use the reference player to memorize each interval&apos;s sound</li>
            <li>Try both ascending and descending to train your ear fully</li>
            <li>Practice regularly for best results (even 5 minutes daily helps)</li>
            <li>Associate intervals with familiar songs (e.g., P5 = Star Wars theme)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
