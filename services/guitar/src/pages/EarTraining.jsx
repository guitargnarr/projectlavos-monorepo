import { useState, useRef, useCallback, useEffect } from 'react';

const INTERVALS = [
  { name: 'Unison', semitones: 0, example: 'Same note' },
  { name: 'Minor 2nd', semitones: 1, example: 'Jaws theme' },
  { name: 'Major 2nd', semitones: 2, example: 'Happy Birthday' },
  { name: 'Minor 3rd', semitones: 3, example: 'Greensleeves' },
  { name: 'Major 3rd', semitones: 4, example: 'Oh When the Saints' },
  { name: 'Perfect 4th', semitones: 5, example: 'Here Comes the Bride' },
  { name: 'Tritone', semitones: 6, example: 'Simpsons theme' },
  { name: 'Perfect 5th', semitones: 7, example: 'Star Wars' },
  { name: 'Minor 6th', semitones: 8, example: 'The Entertainer' },
  { name: 'Major 6th', semitones: 9, example: 'NBC chime' },
  { name: 'Minor 7th', semitones: 10, example: 'Star Trek theme' },
  { name: 'Major 7th', semitones: 11, example: 'Take On Me' },
  { name: 'Octave', semitones: 12, example: 'Somewhere Over the Rainbow' },
];

const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Easy',
    description: 'Perfect intervals only',
    intervals: [0, 5, 7, 12], // Unison, P4, P5, Octave
  },
  medium: {
    name: 'Medium',
    description: 'Common intervals',
    intervals: [0, 2, 3, 4, 5, 7, 9, 12], // No tritone, minor 6th, 7ths
  },
  hard: {
    name: 'Hard',
    description: 'All intervals',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
};

const CHORD_TYPES = [
  { name: 'Major', intervals: [0, 4, 7] },
  { name: 'Minor', intervals: [0, 3, 7] },
  { name: 'Diminished', intervals: [0, 3, 6] },
  { name: 'Augmented', intervals: [0, 4, 8] },
];

const GAME_MODES = [
  { id: 'intervals', name: 'Intervals', description: 'Identify the interval between two notes' },
  { id: 'chords', name: 'Chords', description: 'Identify chord quality (major, minor, etc.)' },
];

export default function EarTraining() {
  const [mode, setMode] = useState('intervals');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null); // { correct: boolean, selected: string, actual: string }
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef(null);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play a note at given frequency
  const playNote = useCallback((frequency, duration = 0.6, startTime = 0) => {
    const audioContext = initAudioContext();
    const time = audioContext.currentTime + startTime;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Envelope for natural sound
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.4, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }, [initAudioContext]);

  // Play an interval (two notes)
  const playInterval = useCallback((baseFreq, semitones) => {
    setIsPlaying(true);
    const secondFreq = baseFreq * Math.pow(2, semitones / 12);

    playNote(baseFreq, 0.6, 0);
    playNote(secondFreq, 0.6, 0.7);

    setTimeout(() => setIsPlaying(false), 1400);
  }, [playNote]);

  // Play a chord (multiple notes)
  const playChord = useCallback((baseFreq, intervals) => {
    setIsPlaying(true);

    intervals.forEach(interval => {
      const freq = baseFreq * Math.pow(2, interval / 12);
      playNote(freq, 1.2, 0);
    });

    setTimeout(() => setIsPlaying(false), 1300);
  }, [playNote]);

  // Generate interval question
  const generateIntervalQuestion = useCallback(() => {
    const diffSettings = DIFFICULTY_LEVELS[difficulty];
    const availableIntervals = diffSettings.intervals;

    // Random base frequency between A3 (220Hz) and A4 (440Hz)
    const baseFreq = 220 + Math.random() * 220;

    // Pick random interval from available
    const intervalIndex = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
    const interval = INTERVALS.find(i => i.semitones === intervalIndex);

    // Generate 4 options (including correct answer)
    const options = [interval];
    while (options.length < 4) {
      const randomIdx = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
      const randomInterval = INTERVALS.find(i => i.semitones === randomIdx);
      if (!options.find(o => o.semitones === randomInterval.semitones)) {
        options.push(randomInterval);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return {
      type: 'interval',
      baseFrequency: baseFreq,
      correct: interval,
      options,
    };
  }, [difficulty]);

  // Generate chord question
  const generateChordQuestion = useCallback(() => {
    const baseFreq = 220 + Math.random() * 220;
    const chordType = CHORD_TYPES[Math.floor(Math.random() * CHORD_TYPES.length)];

    return {
      type: 'chord',
      baseFrequency: baseFreq,
      correct: chordType,
      options: [...CHORD_TYPES].sort(() => Math.random() - 0.5),
    };
  }, []);

  // Generate new question
  const generateQuestion = useCallback(() => {
    setShowAnswer(false);
    setLastAnswer(null);

    const question = mode === 'intervals'
      ? generateIntervalQuestion()
      : generateChordQuestion();

    setCurrentQuestion(question);
  }, [mode, generateIntervalQuestion, generateChordQuestion]);

  // Play current question
  const playQuestion = useCallback(() => {
    if (!currentQuestion) return;

    if (currentQuestion.type === 'interval') {
      playInterval(currentQuestion.baseFrequency, currentQuestion.correct.semitones);
    } else {
      playChord(currentQuestion.baseFrequency, currentQuestion.correct.intervals);
    }
  }, [currentQuestion, playInterval, playChord]);

  // Handle answer selection
  const handleAnswer = (selected) => {
    if (showAnswer) return;

    const isCorrect = mode === 'intervals'
      ? selected.semitones === currentQuestion.correct.semitones
      : selected.name === currentQuestion.correct.name;

    setShowAnswer(true);
    setLastAnswer({
      correct: isCorrect,
      selected: selected.name,
      actual: currentQuestion.correct.name,
    });

    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      setStreak(prev => prev + 1);
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
      setStreak(0);
    }
  };

  // Start new game
  const startGame = () => {
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    generateQuestion();
  };

  // Next question
  const nextQuestion = () => {
    generateQuestion();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const options = currentQuestion?.options || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Ear Training
        </h1>
        <p className="text-gray-400">
          Develop your musical ear with interval and chord recognition
        </p>
      </div>

      {/* Settings Panel */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        {/* Game Mode */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Game Mode</label>
          <div className="grid grid-cols-2 gap-4">
            {GAME_MODES.map(gameMode => (
              <button
                key={gameMode.id}
                onClick={() => {
                  setMode(gameMode.id);
                  setCurrentQuestion(null);
                }}
                className={`p-4 rounded-lg transition-all text-left ${
                  mode === gameMode.id
                    ? 'bg-pink-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="font-bold">{gameMode.name}</div>
                <div className="text-sm opacity-80">{gameMode.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty (only for intervals) */}
        {mode === 'intervals' && (
          <div className="mb-6">
            <label className="block text-gray-300 font-semibold mb-2">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setDifficulty(key);
                    setCurrentQuestion(null);
                  }}
                  className={`py-3 px-4 rounded transition-all ${
                    difficulty === key
                      ? 'bg-purple-500 text-gray-900'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-bold">{value.name}</div>
                  <div className="text-xs opacity-80">{value.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        {!currentQuestion && (
          <button
            onClick={startGame}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-gray-900 rounded-lg font-bold text-lg transition-all"
          >
            Start Training
          </button>
        )}
      </div>

      {/* Game Area */}
      {currentQuestion && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          {/* Score and Streak */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg">
              <span className="text-gray-400">Score: </span>
              <span className="font-bold text-pink-400">{score.correct}</span>
              <span className="text-gray-400"> / {score.total}</span>
            </div>
            {streak > 0 && (
              <div className="px-4 py-2 bg-purple-500 rounded-full font-bold text-gray-900">
                {streak} streak!
              </div>
            )}
          </div>

          {/* Play Button */}
          <div className="text-center mb-8">
            <button
              onClick={playQuestion}
              disabled={isPlaying}
              className={`w-32 h-32 rounded-full transition-all ${
                isPlaying
                  ? 'bg-pink-400 scale-110 animate-pulse'
                  : 'bg-pink-500 hover:bg-pink-600 hover:scale-105'
              } text-gray-900 shadow-lg`}
            >
              <div className="text-4xl mb-1">{isPlaying ? '...' : '>'}</div>
              <div className="text-sm font-bold">{isPlaying ? 'Playing' : 'Play'}</div>
            </button>
            <p className="text-gray-400 mt-4">
              {mode === 'intervals' ? 'Listen to the two notes' : 'Listen to the chord'}
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {options.map((option, idx) => {
              let buttonStyle = 'bg-gray-700 text-gray-300 hover:bg-gray-600';

              if (showAnswer) {
                if (option.name === currentQuestion.correct.name) {
                  buttonStyle = 'bg-green-500 text-gray-900';
                } else if (lastAnswer && option.name === lastAnswer.selected && !lastAnswer.correct) {
                  buttonStyle = 'bg-red-500 text-gray-900';
                } else {
                  buttonStyle = 'bg-gray-700 text-gray-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={showAnswer}
                  className={`p-4 rounded-lg transition-all ${buttonStyle}`}
                >
                  <div className="font-bold text-lg">{option.name}</div>
                  {mode === 'intervals' && option.example && (
                    <div className="text-sm opacity-70 mt-1">{option.example}</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Result and Next */}
          {showAnswer && (
            <div className="text-center">
              <div className={`text-2xl font-bold mb-4 ${lastAnswer.correct ? 'text-green-400' : 'text-red-400'}`}>
                {lastAnswer.correct ? 'Correct!' : `Incorrect - it was ${lastAnswer.actual}`}
              </div>
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-gray-900 rounded-lg font-bold transition-all"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interval Reference */}
      {mode === 'intervals' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-pink-400">Interval Reference</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {INTERVALS.map(interval => {
              const isInDifficulty = DIFFICULTY_LEVELS[difficulty].intervals.includes(interval.semitones);
              return (
                <div
                  key={interval.semitones}
                  className={`p-3 rounded border transition-all ${
                    isInDifficulty
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-gray-700 bg-gray-700/50 opacity-50'
                  }`}
                >
                  <div className="font-bold text-sm">{interval.name}</div>
                  <div className="text-xs text-gray-400">{interval.example}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-3 text-pink-400">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Select a game mode (Intervals or Chords)</li>
          <li>For intervals, choose your difficulty level</li>
          <li>Click &quot;Start Training&quot; to begin</li>
          <li>Press the Play button to hear the sound</li>
          <li>Select your answer from the options</li>
          <li>Build your streak for bonus satisfaction!</li>
        </ol>
      </div>
    </div>
  );
}
