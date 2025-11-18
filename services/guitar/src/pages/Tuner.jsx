import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
  const [centsOff, setCentsOff] = useState(0);
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);

  // Autocorrelation algorithm for pitch detection
  const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    // Calculate RMS (root mean square) to check if signal is strong enough
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    // If signal is too weak, return -1
    if (rms < 0.01) return -1;

    // Find the best offset using autocorrelation
    let lastCorrelation = 1;
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }

      correlation = 1 - correlation / MAX_SAMPLES;

      if (correlation > 0.9 && correlation > lastCorrelation) {
        const foundGoodCorrelation = correlation > bestCorrelation;
        if (foundGoodCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      }

      lastCorrelation = correlation;
    }

    if (bestCorrelation > 0.01) {
      return sampleRate / bestOffset;
    }
    return -1;
  };

  // Convert frequency difference to cents
  const frequencyToCents = (detected, target) => {
    return 1200 * Math.log2(detected / target);
  };

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
      return { status: 'in-tune', color: '#10b981', label: 'In Tune!' };
    } else if (absCents <= CLOSE_THRESHOLD) {
      return {
        status: 'close',
        color: '#fbbf24',
        label: cents > 0 ? 'Sharp' : 'Flat'
      };
    } else {
      return {
        status: 'off',
        color: cents > 0 ? '#f97316' : '#ef4444',
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

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gauge background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY + 40, 120, Math.PI * 0.75, Math.PI * 0.25, false);
    ctx.strokeStyle = '#374151';
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
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw labels for major ticks
      if (i % 20 === 0) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px sans-serif';
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
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw needle
    const clampedCents = Math.max(-50, Math.min(50, cents));
    const needleAngle = Math.PI * 0.75 + (clampedCents + 50) / 100 * Math.PI * 1.5;
    const tuningStatus = getTuningStatus(cents);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 40);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * 100,
      centerY + 40 + Math.sin(needleAngle) * 100
    );
    ctx.strokeStyle = tuningStatus.color;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw needle center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY + 40, 8, 0, 2 * Math.PI);
    ctx.fillStyle = tuningStatus.color;
    ctx.fill();
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
    setCentsOff(0);

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTuner();
    };
  }, []);

  const tuningStatus = detectedString ? getTuningStatus(centsOff) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="text-green-500 hover:text-green-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-green-400">Guitar Tuner</h1>
        <p className="text-gray-400">Real-time pitch detection using Web Audio API</p>
      </header>

      {/* Tuner Control */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700 text-center">
        <button
          onClick={isListening ? stopTuner : startTuner}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isListening ? 'Stop Tuner' : 'Start Tuner'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        {isListening && !detectedFrequency && (
          <div className="mt-4 text-gray-400">
            Play a string... Listening for pitch...
          </div>
        )}
      </div>

      {/* Gauge Display */}
      {isListening && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="text-center mb-4">
            {detectedString ? (
              <>
                <div className="text-6xl font-bold mb-2" style={{ color: tuningStatus.color }}>
                  {detectedString.name}{detectedString.octave}
                </div>
                <div className="text-2xl font-medium mb-2" style={{ color: tuningStatus.color }}>
                  {tuningStatus.label}
                </div>
                <div className="text-lg text-gray-400">
                  String {detectedString.stringNum}
                </div>
              </>
            ) : (
              <div className="text-2xl text-gray-400">Detecting...</div>
            )}
          </div>

          <div className="flex justify-center mb-4">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="max-w-full"
            />
          </div>

          {detectedFrequency && (
            <div className="text-center space-y-2">
              <div className="text-lg">
                Detected: <span className="font-mono font-bold text-blue-400">
                  {detectedFrequency.toFixed(2)} Hz
                </span>
              </div>
              {detectedString && (
                <>
                  <div className="text-lg">
                    Target: <span className="font-mono font-bold text-green-400">
                      {detectedString.frequency.toFixed(2)} Hz
                    </span>
                  </div>
                  <div className="text-lg">
                    Difference: <span className="font-mono font-bold" style={{ color: tuningStatus.color }}>
                      {centsOff > 0 ? '+' : ''}{centsOff.toFixed(1)} cents
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* String Reference Chart */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-green-400">Standard Tuning Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GUITAR_STRINGS.map((string) => (
            <div
              key={string.stringNum}
              className={`p-4 rounded-lg border-2 transition-all ${
                detectedString && detectedString.stringNum === string.stringNum
                  ? 'border-green-500 bg-green-900/20'
                  : 'border-gray-600 bg-gray-700/50'
              }`}
            >
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">String {string.stringNum}</div>
                <div className="text-3xl font-bold text-green-400">
                  {string.name}{string.octave}
                </div>
                <div className="text-sm text-gray-400 font-mono mt-1">
                  {string.frequency.toFixed(2)} Hz
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-6 mt-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-green-400">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Click &quot;Start Tuner&quot; and allow microphone access</li>
          <li>Play one string at a time on your guitar</li>
          <li>Watch the gauge needle - center means in tune!</li>
          <li>Adjust your tuning peg:
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
              <li className="text-red-400">Red/Left (Flat): Tighten the string</li>
              <li className="text-green-400">Green/Center (In Tune): Perfect!</li>
              <li className="text-orange-400">Orange/Right (Sharp): Loosen the string</li>
            </ul>
          </li>
          <li>The tuner automatically detects which string you&apos;re playing</li>
        </ol>
      </div>
    </div>
  );
}
