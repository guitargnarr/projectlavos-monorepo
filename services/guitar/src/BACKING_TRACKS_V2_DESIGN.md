# High-Fidelity Backing Tracks V2 - Architecture Design

## Research Summary

### Current State (BackingTracks.jsx)
- Web Audio API oscillators for bass notes
- Simple sine wave clicks for metronome
- No drums, no real guitar tones
- Works great for practice but sounds thin

### Available Technologies

#### AlphaTab Capabilities
- Full SoundFont synthesis (sonivox.sf2)
- Multi-track support (guitar + bass + drums)
- Programmatic score generation via `api.tex()`
- AlphaTex syntax for percussion tracks
- Drum notation: `\track "Drums" \instrument percussion`
- Can use MIDI note numbers directly (36=kick, 38=snare, 42=hi-hat closed)

#### Ollama Models Available
| Model | Purpose | Output Format |
|-------|---------|---------------|
| rhythm_architect | Djent/metal rhythm patterns | JSON with frets/strings/duration |
| lead_architect | Melodic phrases | JSON with frets/strings/duration |
| guitar_expert_precise | Theory/tabs | ASCII tabs |
| master_guitar_instructor | Teaching/theory | ASCII tabs |

#### Web Audio Drum Synthesis
- Kick: Triangle oscillator + gain envelope
- Snare: Noise burst + bandpass filter
- Hi-Hat: Noise + highpass filter at 7000Hz
- References: [Dev.Opera guide](https://dev.opera.com/articles/drum-sounds-webaudio/), [Chrome Labs Demo](https://googlechromelabs.github.io/web-audio-samples/demos/shiny-drum-machine/)

## Architecture Options

### Option A: Enhanced Web Audio (Recommended for V2)
Keep current real-time approach but add proper drum synthesis.

**Pros:**
- Immediate playback, no pre-generation needed
- Dynamic tempo/key changes work instantly
- Simpler implementation
- No file generation overhead

**Cons:**
- Not as authentic as samples
- Can't export to GP5

**Implementation:**
1. Add Web Audio drum synthesizer (kick, snare, hi-hat)
2. Use Ollama models to generate chord voicings for selected key/style
3. Enhance bass with better oscillator/filter combo
4. Keep existing progression logic

### Option B: AlphaTab Generation
Generate AlphaTex notation for full multi-track playback.

**Pros:**
- High-quality SoundFont audio
- Can export to GP5
- Full notation display
- Multiple instruments (guitar, bass, drums)

**Cons:**
- Requires pre-generation of backing track
- Can't change tempo/key on-the-fly
- More complex integration
- AlphaTex syntax complexity

**Implementation:**
1. Use Ollama to generate rhythm pattern JSON
2. Convert JSON → AlphaTex notation
3. Feed to AlphaTab `api.tex()`
4. Use AlphaTab player controls

### Option C: Hybrid Approach (Best of Both)
Real-time drums + AlphaTab for guitar parts.

**Pros:**
- Best audio quality for guitar
- Real-time drums stay responsive
- Can show guitar notation

**Cons:**
- Complex synchronization
- Two audio systems to manage

## Recommended Implementation: Option A Enhanced

### Phase 1: Drum Synthesis Module
Create `DrumSynthesizer.js` with:

```javascript
// MIDI note numbers for General MIDI drums
const DRUMS = {
  KICK: 36,       // Bass Drum 1
  SNARE: 38,      // Acoustic Snare
  HIHAT_CLOSED: 42,
  HIHAT_OPEN: 46,
  CRASH: 49,
  RIDE: 51,
};

// Synthesis parameters
const drumSounds = {
  kick: {
    oscillator: 'sine',
    frequency: 150,  // Start freq
    frequencyDecay: 0.5,  // Pitch drop
    duration: 0.5,
    attack: 0.01,
    decay: 0.2,
  },
  snare: {
    noiseLength: 0.15,
    toneFrequency: 200,
    toneDuration: 0.1,
    filterFrequency: 3000,
  },
  hihat: {
    noiseLength: 0.05,
    filterFrequency: 7000,
    filterType: 'highpass',
  },
};
```

### Phase 2: Drum Pattern Generator
Create style-specific patterns:

```javascript
const DRUM_PATTERNS = {
  blues: {
    pattern: [
      // Beat 1: Kick + HH
      { beat: 0, drums: ['kick', 'hihat'] },
      // Beat 1.5: HH
      { beat: 0.5, drums: ['hihat'] },
      // Beat 2: Snare + HH
      { beat: 1, drums: ['snare', 'hihat'] },
      // etc...
    ],
    beatsPerBar: 4,
  },
  rock: { /* ... */ },
  jazz: { /* ... */ },
};
```

### Phase 3: Ollama Integration for Chords
Call Ollama to get proper chord voicings:

```javascript
async function getChordVoicing(chord, key, style) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'guitar_expert_precise',
      prompt: `Give me the fret positions for a ${chord} chord in the key of ${key} for ${style} style. Output JSON only: {"frets": [e,B,G,D,A,E], "name": "chord name"}`,
      stream: false,
    }),
  });
  return response.json();
}
```

### Phase 4: Enhanced Bass Line
Replace oscillators with:
- Triangle wave (warmer tone)
- Low-pass filter (remove harshness)
- ADSR envelope
- Optional: Sub-bass layer

## File Structure

```
src/
  audio/
    DrumSynthesizer.js     # Web Audio drum synthesis
    BassSynthesizer.js     # Enhanced bass synthesis
    GuitarSynthesizer.js   # (existing)
  data/
    drumPatterns.js        # Style-specific patterns
    chordVoicings.js       # Common voicings cache
  services/
    ollamaService.js       # API wrapper
  pages/
    BackingTracks.jsx      # Updated with new audio
```

## API Integration Points

### Ollama Service
```javascript
// src/services/ollamaService.js
const OLLAMA_URL = 'http://localhost:11434/api/generate';

export async function generateChordVoicing(key, chord, style) {
  // Uses guitar_expert_precise
}

export async function generateRhythmPattern(style, tempo) {
  // Uses rhythm_architect
}

export async function generateLeadPhrase(key, scale) {
  // Uses lead_architect
}
```

### Optional: Backend Integration
For users without local Ollama, could route through:
- guitar-model-lab.onrender.com (existing API)
- Add `/generate-chord` endpoint
- Add `/generate-drums` endpoint

## UI Enhancements

1. **Drum mixer controls:**
   - Kick volume slider
   - Snare volume slider
   - Hi-hat volume slider

2. **Bass tone control:**
   - Tone knob (filter cutoff)
   - Sub-bass toggle

3. **Pattern complexity:**
   - Simple (just kick/snare)
   - Standard (full kit)
   - Complex (fills, variations)

## Migration Path

1. Keep existing BackingTracks.jsx working
2. Add DrumSynthesizer as opt-in feature
3. A/B test with users
4. Gradually replace old audio with new

## Future Considerations

- **AlphaTab integration later**: Once happy with Web Audio approach, could add "Export to GP5" that generates AlphaTex from current settings
- **More drum styles**: Latin, funk, metal (blast beats, double bass)
- **Guitar comping**: Use Ollama to generate actual guitar parts (strumming patterns)
- **Loop sections**: Mark sections to loop for focused practice

## Next Steps

1. Create DrumSynthesizer.js
2. Add drum patterns for each style
3. Integrate into BackingTracks.jsx
4. Test and refine sounds
5. Add UI controls

---
Created: 2024-12-22
Status: Design Complete, Ready for Implementation
