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
  { name: 'Major 7th', intervals: [0, 4, 7, 11] },
  { name: 'Minor 7th', intervals: [0, 3, 7, 10] },
  { name: 'Dominant 7th', intervals: [0, 4, 7, 10] },
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
  const [lastAnswer, setLastAnswer] = useState(null);
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

  // Get option button class based on state
  const getOptionClass = (option) => {
    if (!showAnswer) return 'ear-training-option-btn';

    if (option.name === currentQuestion.correct.name) {
      return 'ear-training-option-btn correct';
    }
    if (lastAnswer && option.name === lastAnswer.selected && !lastAnswer.correct) {
      return 'ear-training-option-btn incorrect';
    }
    return 'ear-training-option-btn disabled-other';
  };

  const options = currentQuestion?.options || [];

  return (
    <div className="ear-training-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="ear-training-header">
          <h1 className="ear-training-title">Ear Training</h1>
          <p className="ear-training-subtitle">
            Develop your musical ear with interval and chord recognition
          </p>
        </div>

        {/* Settings Panel */}
        <div className="ear-training-panel">
          {/* Game Mode */}
          <div className="mb-6">
            <label className="ear-training-label">Game Mode</label>
            <div className="ear-training-mode-grid">
              {GAME_MODES.map(gameMode => (
                <button
                  key={gameMode.id}
                  onClick={() => {
                    setMode(gameMode.id);
                    setCurrentQuestion(null);
                  }}
                  className={`ear-training-mode-btn ${mode === gameMode.id ? 'selected' : ''}`}
                >
                  <div className="mode-name">{gameMode.name}</div>
                  <div className="mode-desc">{gameMode.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty (only for intervals) */}
          {mode === 'intervals' && (
            <div className="mb-6">
              <label className="ear-training-label">Difficulty</label>
              <div className="ear-training-difficulty-grid">
                {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setDifficulty(key);
                      setCurrentQuestion(null);
                    }}
                    className={`ear-training-difficulty-btn ${difficulty === key ? 'selected' : ''}`}
                  >
                    <div className="diff-name">{value.name}</div>
                    <div className="diff-desc">{value.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          {!currentQuestion && (
            <button onClick={startGame} className="ear-training-start-btn">
              Start Training
            </button>
          )}
        </div>

        {/* Game Area */}
        {currentQuestion && (
          <div className="ear-training-panel">
            {/* Score and Streak */}
            <div className="ear-training-score-bar">
              <div className="ear-training-score">
                Score: <span className="score-value">{score.correct}</span> / {score.total}
              </div>
              {streak > 0 && (
                <div className="ear-training-streak">{streak} streak!</div>
              )}
            </div>

            {/* Play Button */}
            <div className="ear-training-play-container">
              <button
                onClick={playQuestion}
                disabled={isPlaying}
                className={`ear-training-play-btn ${isPlaying ? 'playing' : ''}`}
              >
                <div className="play-icon">{isPlaying ? '...' : '>'}</div>
                <div className="play-label">{isPlaying ? 'Playing' : 'Play'}</div>
              </button>
              <p className="ear-training-play-hint">
                {mode === 'intervals' ? 'Listen to the two notes' : 'Listen to the chord'}
              </p>
            </div>

            {/* Answer Options */}
            <div className="ear-training-options-grid">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={showAnswer}
                  className={getOptionClass(option)}
                >
                  <div className="option-name">{option.name}</div>
                  {mode === 'intervals' && option.example && (
                    <div className="option-hint">{option.example}</div>
                  )}
                </button>
              ))}
            </div>

            {/* Result and Next */}
            {showAnswer && (
              <div className="ear-training-result">
                <div className={`ear-training-result-text ${lastAnswer.correct ? 'correct' : 'incorrect'}`}>
                  {lastAnswer.correct ? 'Correct!' : `Incorrect - it was ${lastAnswer.actual}`}
                </div>
                <button onClick={nextQuestion} className="ear-training-next-btn">
                  Next Question
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interval Reference */}
        {mode === 'intervals' && (
          <div className="ear-training-reference">
            <h2 className="ear-training-reference-title">Interval Reference</h2>
            <div className="ear-training-reference-grid">
              {INTERVALS.map(interval => {
                const isInDifficulty = DIFFICULTY_LEVELS[difficulty].intervals.includes(interval.semitones);
                return (
                  <div
                    key={interval.semitones}
                    className={`ear-training-interval-card ${isInDifficulty ? 'active' : 'inactive'}`}
                  >
                    <div className="interval-name">{interval.name}</div>
                    <div className="interval-example">{interval.example}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="ear-training-instructions">
          <h2 className="ear-training-instructions-title">How to Use</h2>
          <ol className="ear-training-instructions-list">
            <li>Select a game mode (Intervals or Chords)</li>
            <li>For intervals, choose your difficulty level</li>
            <li>Click &quot;Start Training&quot; to begin</li>
            <li>Press the Play button to hear the sound</li>
            <li>Select your answer from the options</li>
            <li>Build your streak for bonus satisfaction!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
