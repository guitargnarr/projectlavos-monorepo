import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { autoCorrelate, frequencyToNote, frequencyToCents, CHROMATIC_NOTES } from '../lib/pitchDetection';

// Standard tuning frequencies for 6-string guitar
const GUITAR_STRINGS = [
  { name: 'E', octave: 2, frequency: 82.41, stringNum: 6 },
  { name: 'A', octave: 2, frequency: 110.00, stringNum: 5 },
  { name: 'D', octave: 3, frequency: 146.83, stringNum: 4 },
  { name: 'G', octave: 3, frequency: 196.00, stringNum: 3 },
  { name: 'B', octave: 3, frequency: 246.94, stringNum: 2 },
  { name: 'E', octave: 4, frequency: 329.63, stringNum: 1 }
];

// Tolerance for "in tune" detection (in cents)
const IN_TUNE_THRESHOLD = 5; // cents
const CLOSE_THRESHOLD = 15; // cents

export default function Tuner() {
  const [isListening, setIsListening] = useState(false);
  const [detectedFrequency, setDetectedFrequency] = useState(null);
  const [detectedString, setDetectedString] = useState(null);
  const [detectedNote, setDetectedNote] = useState(null);
  const [centsOff, setCentsOff] = useState(0);
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);

  // Find closest guitar string to detected frequency
  const findClosestString = (frequency) => {
    if (!frequency || frequency < 70 || frequency > 350) return null;

    let closestString = GUITAR_STRINGS[0];
    let minDiff = Math.abs(frequency - closestString.frequency);

    GUITAR_STRINGS.forEach((string) => {
      const diff = Math.abs(frequency - string.frequency);
      if (diff < minDiff) {
        minDiff = diff;
        closestString = string;
      }
    });

    return closestString;
  };

  // Get tuning status based on cents off
  const getTuningStatus = (cents) => {
    const absCents = Math.abs(cents);
    if (absCents <= IN_TUNE_THRESHOLD) {
      return { status: 'perfect', color: '#14b8a6', label: 'In Tune!' };
    } else if (absCents <= CLOSE_THRESHOLD) {
      return {
        status: cents > 0 ? 'sharp' : 'flat',
        color: cents > 0 ? '#f97316' : '#3b82f6',
        label: cents > 0 ? 'Sharp' : 'Flat'
      };
    } else {
      return {
        status: cents > 0 ? 'sharp' : 'flat',
        color: cents > 0 ? '#f97316' : '#3b82f6',
        label: cents > 0 ? 'Too Sharp' : 'Too Flat'
      };
    }
  };

  // Draw the tuning gauge on canvas
  const drawGauge = (cents) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw gauge background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY + 40, 120, Math.PI * 0.75, Math.PI * 0.25, false);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw tick marks
    for (let i = -50; i <= 50; i += 10) {
      const angle = Math.PI * 0.75 + (i + 50) / 100 * Math.PI * 1.5;
      const startRadius = 110;
      const endRadius = i % 20 === 0 ? 95 : 100;

      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * startRadius,
        centerY + 40 + Math.sin(angle) * startRadius
      );
      ctx.lineTo(
        centerX + Math.cos(angle) * endRadius,
        centerY + 40 + Math.sin(angle) * endRadius
      );
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (i % 20 === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '12px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          i.toString(),
          centerX + Math.cos(angle) * 85,
          centerY + 45 + Math.sin(angle) * 85
        );
      }
    }

    // Draw center tick (in tune position)
    const centerAngle = Math.PI * 0.75 + 0.5 * Math.PI * 1.5;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(centerAngle) * 120,
      centerY + 40 + Math.sin(centerAngle) * 120
    );
    ctx.lineTo(
      centerX + Math.cos(centerAngle) * 90,
      centerY + 40 + Math.sin(centerAngle) * 90
    );
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw needle with glow
    const clampedCents = Math.max(-50, Math.min(50, cents));
    const needleAngle = Math.PI * 0.75 + (clampedCents + 50) / 100 * Math.PI * 1.5;
    const tuningStatus = getTuningStatus(cents);

    // Needle glow
    ctx.shadowColor = tuningStatus.color;
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 40);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * 100,
      centerY + 40 + Math.sin(needleAngle) * 100
    );
    ctx.strokeStyle = tuningStatus.color;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Draw needle center circle with glow
    ctx.shadowColor = tuningStatus.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 40, 10, 0, 2 * Math.PI);
    ctx.fillStyle = tuningStatus.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // Main pitch detection loop
  const detectPitch = () => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;

    if (!analyser || !audioContext) return;

    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, audioContext.sampleRate);

    if (frequency > 0) {
      setDetectedFrequency(frequency);
      setDetectedNote(frequencyToNote(frequency));

      const closestString = findClosestString(frequency);
      if (closestString) {
        setDetectedString(closestString);
        const cents = frequencyToCents(frequency, closestString.frequency);
        setCentsOff(cents);
        drawGauge(cents);
      }
    } else {
      drawGauge(0);
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  };

  // Start microphone and pitch detection
  const startTuner = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = stream;

      setIsListening(true);
      detectPitch();
    } catch (err) {
      setError('Microphone access denied. Please grant permission to use the tuner.');
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop microphone and pitch detection
  const stopTuner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    microphoneRef.current = null;

    setIsListening(false);
    setDetectedFrequency(null);
    setDetectedString(null);
    setDetectedNote(null);
    setCentsOff(0);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    return () => {
      stopTuner();
    };
  }, []);

  const tuningStatus = detectedString ? getTuningStatus(centsOff) : null;

  return (
    <div className="tuner-page">
      <div className="tuner-page-inner">
        {/* Back Link */}
        <Link to="/" className="tuner-back-link">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <header className="tuner-header">
          <h1 className="tuner-title">Guitar Tuner</h1>
          <p className="tuner-subtitle">Real-time pitch detection with Web Audio API</p>
        </header>

        {/* Control Panel */}
        <div className="tuner-control-panel">
          <button
            onClick={isListening ? stopTuner : startTuner}
            className={`tuner-button-start ${isListening ? 'tuner-button-active' : 'tuner-button-inactive'}`}
          >
            <span className="tuner-button-ring" />
            {isListening ? 'Stop' : 'Start'}
          </button>

          {error && (
            <div className="tuner-error">{error}</div>
          )}

          {isListening && !detectedFrequency && (
            <div className="tuner-listening-text">
              Play a string... Listening for pitch...
            </div>
          )}
        </div>

        {/* Gauge Display */}
        {isListening && (
          <div className="tuner-gauge-panel">
            {/* Note Display */}
            <div className="tuner-note-display">
              {detectedString ? (
                <>
                  <div className="tuner-note-name" style={{ color: tuningStatus.color }}>
                    {detectedString.name}{detectedString.octave}
                  </div>
                  <div className="tuner-note-status" style={{ color: tuningStatus.color }}>
                    {tuningStatus.label}
                  </div>
                  <div className="tuner-note-string">String {detectedString.stringNum}</div>
                </>
              ) : (
                <div className="tuner-note-name" style={{ color: '#64748b' }}>--</div>
              )}
            </div>

            {/* Pitch Indicator (Sharp/Flat/Perfect) */}
            <div className="tuner-pitch-indicator">
              <span className="text-sm text-blue-400 font-medium">FLAT</span>
              {[-3, -2, -1, 0, 1, 2, 3].map((level) => {
                let markerClass = 'tuner-pitch-marker';
                if (tuningStatus) {
                  const normalizedCents = Math.round(centsOff / 10);
                  if (level === 0 && tuningStatus.status === 'perfect') {
                    markerClass += ' perfect';
                  } else if (level === normalizedCents && level < 0) {
                    markerClass += ' flat';
                  } else if (level === normalizedCents && level > 0) {
                    markerClass += ' sharp';
                  }
                }
                return <div key={level} className={markerClass} />;
              })}
              <span className="text-sm text-orange-400 font-medium">SHARP</span>
            </div>

            {/* Detection Circles (12 semitones) */}
            <div className="tuner-detection-circles">
              {CHROMATIC_NOTES.map((note) => (
                <div
                  key={note}
                  className={`tuner-detection-dot ${detectedNote === note ? 'active' : ''}`}
                  title={note}
                >
                  <span className="tuner-detection-dot-label">{note}</span>
                </div>
              ))}
            </div>

            {/* Canvas Gauge */}
            <div className="tuner-gauge-canvas">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
              />
            </div>

            {/* Cents Display */}
            {detectedFrequency && tuningStatus && (
              <div className="tuner-cents-display">
                <div className="tuner-cents-value" style={{ color: tuningStatus.color }}>
                  {centsOff > 0 ? '+' : ''}{centsOff.toFixed(1)}
                </div>
                <div className="tuner-cents-label">cents</div>
              </div>
            )}

            {/* Frequency Info */}
            {detectedFrequency && (
              <div className="tuner-freq-info">
                <div className="tuner-freq-row">
                  Detected: <span className="tuner-freq-value tuner-freq-detected">
                    {detectedFrequency.toFixed(2)} Hz
                  </span>
                </div>
                {detectedString && (
                  <div className="tuner-freq-row">
                    Target: <span className="tuner-freq-value tuner-freq-target">
                      {detectedString.frequency.toFixed(2)} Hz
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* String Reference Grid */}
        <div className="tuner-reference-panel">
          <h3 className="tuner-reference-title">Standard Tuning Reference</h3>
          <div className="tuner-string-grid">
            {GUITAR_STRINGS.map((string) => (
              <div
                key={string.stringNum}
                className={`tuner-string-card ${
                  detectedString && detectedString.stringNum === string.stringNum ? 'detected' : ''
                }`}
              >
                <div className="tuner-string-num">String {string.stringNum}</div>
                <div className="tuner-string-name">
                  {string.name}{string.octave}
                </div>
                <div className="tuner-string-freq">
                  {string.frequency.toFixed(2)} Hz
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="tuner-instructions">
          <h3 className="tuner-instructions-title">How to Use</h3>
          <ol className="tuner-instructions-list">
            <li>Click the Start button and allow microphone access</li>
            <li>Play one string at a time on your guitar</li>
            <li>Watch the gauge needle - center means in tune!</li>
            <li>Adjust your tuning peg:
              <ul>
                <li><span className="flat-hint">Blue/Left (Flat): Tighten the string</span></li>
                <li><span className="perfect-hint">Teal/Center (In Tune): Perfect!</span></li>
                <li><span className="sharp-hint">Orange/Right (Sharp): Loosen the string</span></li>
              </ul>
            </li>
            <li>The tuner automatically detects which string you are playing</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
