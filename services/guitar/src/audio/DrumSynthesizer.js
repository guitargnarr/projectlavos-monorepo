/**
 * DrumSynthesizer.js
 * Web Audio API drum synthesis for backing tracks
 *
 * Based on:
 * - Dev.Opera drum synthesis guide
 * - TR-808 style electronic drums
 * - General MIDI percussion mapping
 */

// General MIDI drum note numbers
export const DRUM_NOTES = {
  KICK: 36,
  SNARE: 38,
  HIHAT_CLOSED: 42,
  HIHAT_OPEN: 46,
  CRASH: 49,
  RIDE: 51,
  TOM_LOW: 45,
  TOM_MID: 47,
  TOM_HIGH: 50,
};

/**
 * Creates a drum synthesizer instance
 * @param {AudioContext} audioContext - Web Audio context
 */
export function createDrumSynthesizer(audioContext) {
  // Master gain for all drums
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.8;
  masterGain.connect(audioContext.destination);

  // Individual drum volumes
  const volumes = {
    kick: 1.0,
    snare: 0.8,
    hihat: 0.5,
    crash: 0.6,
    ride: 0.5,
    tom: 0.7,
  };

  /**
   * Synthesize a kick drum
   * Uses sine wave with pitch decay for that classic 808 sound
   */
  function playKick(time, velocity = 1.0) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);

    gain.gain.setValueAtTime(velocity * volumes.kick, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.4);

    // Add click for attack
    const clickOsc = audioContext.createOscillator();
    const clickGain = audioContext.createGain();

    clickOsc.type = 'sine';
    clickOsc.frequency.value = 1000;

    clickGain.gain.setValueAtTime(velocity * 0.3 * volumes.kick, time);
    clickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);

    clickOsc.start(time);
    clickOsc.stop(time + 0.02);
  }

  /**
   * Synthesize a snare drum
   * Combines noise burst with tonal body
   */
  function playSnare(time, velocity = 1.0) {
    // Noise component (snare wires)
    const bufferSize = audioContext.sampleRate * 0.2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.5 * volumes.snare, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(time);
    noise.stop(time + 0.2);

    // Body (tonal component)
    const osc = audioContext.createOscillator();
    const oscGain = audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.05);

    oscGain.gain.setValueAtTime(velocity * 0.6 * volumes.snare, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  /**
   * Synthesize hi-hat (closed or open)
   * Uses filtered noise
   */
  function playHiHat(time, velocity = 1.0, open = false) {
    const duration = open ? 0.3 : 0.05;
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    // High-pass filter for that metallic sound
    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 7000;

    // Band-pass for body
    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 10000;
    bandpass.Q.value = 1;

    const gain = audioContext.createGain();
    const vol = open ? volumes.hihat * 1.2 : volumes.hihat;
    gain.gain.setValueAtTime(velocity * vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    noise.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  /**
   * Synthesize crash cymbal
   */
  function playCrash(time, velocity = 1.0) {
    const duration = 1.5;
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 5000;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(velocity * volumes.crash, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  /**
   * Synthesize ride cymbal
   */
  function playRide(time, velocity = 1.0) {
    const duration = 0.5;
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 8000;
    bandpass.Q.value = 2;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(velocity * volumes.ride, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  /**
   * Synthesize tom drum
   */
  function playTom(time, pitch = 'mid', velocity = 1.0) {
    const freqs = {
      low: { start: 100, end: 60 },
      mid: { start: 150, end: 80 },
      high: { start: 200, end: 100 },
    };

    const freq = freqs[pitch] || freqs.mid;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq.start, time);
    osc.frequency.exponentialRampToValueAtTime(freq.end, time + 0.15);

    gain.gain.setValueAtTime(velocity * volumes.tom, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  /**
   * Play a drum by name
   */
  function play(drumName, time, velocity = 1.0) {
    switch (drumName) {
      case 'kick':
        playKick(time, velocity);
        break;
      case 'snare':
        playSnare(time, velocity);
        break;
      case 'hihat':
      case 'hihat_closed':
        playHiHat(time, velocity, false);
        break;
      case 'hihat_open':
        playHiHat(time, velocity, true);
        break;
      case 'crash':
        playCrash(time, velocity);
        break;
      case 'ride':
        playRide(time, velocity);
        break;
      case 'tom_low':
        playTom(time, 'low', velocity);
        break;
      case 'tom_mid':
        playTom(time, 'mid', velocity);
        break;
      case 'tom_high':
        playTom(time, 'high', velocity);
        break;
      default:
        console.warn(`Unknown drum: ${drumName}`);
    }
  }

  /**
   * Set individual drum volumes
   */
  function setVolume(drum, volume) {
    if (volumes[drum] !== undefined) {
      volumes[drum] = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Set master volume
   */
  function setMasterVolume(volume) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioContext.currentTime);
  }

  return {
    play,
    playKick,
    playSnare,
    playHiHat,
    playCrash,
    playRide,
    playTom,
    setVolume,
    setMasterVolume,
    volumes,
    masterGain,
  };
}

export default createDrumSynthesizer;
