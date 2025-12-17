/**
 * Audio Context Manager
 *
 * Singleton pattern for managing Web Audio API AudioContext.
 * Prevents multiple AudioContext instances and handles browser compatibility.
 *
 * Usage:
 *   import { getAudioContext, closeAudioContext } from './audioContextManager';
 *
 *   const ctx = getAudioContext();
 *   // Use ctx for audio operations
 *
 *   // On component unmount (if needed):
 *   closeAudioContext();
 */

let audioContext = null;
let refCount = 0;

/**
 * Get the shared AudioContext instance
 * Creates one if it doesn't exist, or returns existing instance
 * @returns {AudioContext} The shared audio context
 */
export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  refCount++;
  return audioContext;
}

/**
 * Resume audio context if suspended
 * Useful after user interaction (browsers require user gesture to start audio)
 * @returns {Promise<void>}
 */
export async function resumeAudioContext() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

/**
 * Decrement reference count and optionally close the audio context
 * Only closes if no more references exist
 * @param {boolean} force - Force close regardless of reference count
 */
export function releaseAudioContext(force = false) {
  refCount = Math.max(0, refCount - 1);

  if (force || refCount === 0) {
    if (audioContext) {
      audioContext.close();
      audioContext = null;
      refCount = 0;
    }
  }
}

/**
 * Get current audio context state
 * @returns {string|null} 'suspended', 'running', 'closed', or null if no context
 */
export function getAudioContextState() {
  return audioContext ? audioContext.state : null;
}

/**
 * Check if audio context exists and is running
 * @returns {boolean}
 */
export function isAudioContextReady() {
  return audioContext && audioContext.state === 'running';
}

/**
 * React hook helper - get context and schedule cleanup
 * Returns a cleanup function for useEffect
 * @returns {{context: AudioContext, cleanup: function}}
 */
export function useAudioContextEffect() {
  const context = getAudioContext();
  const cleanup = () => releaseAudioContext();
  return { context, cleanup };
}
