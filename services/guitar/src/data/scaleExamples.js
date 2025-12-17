/**
 * Scale Examples Library
 *
 * Educational content for each scale type including:
 * - Genre associations
 * - Descriptions of sound/character
 * - Famous songs that use each scale
 *
 * Extracted from ScaleTrainer.jsx for reusability and maintainability.
 */

const SCALE_EXAMPLES = [
  {
    scale: 'pentatonic_minor',
    name: 'Minor Pentatonic',
    genre: 'Rock/Blues',
    description: 'The most essential scale for rock and blues guitar. Five notes that always sound good over minor and dominant 7th chords.',
    songs: ['Stairway to Heaven - Led Zeppelin', 'Back in Black - AC/DC', 'Voodoo Child - Jimi Hendrix']
  },
  {
    scale: 'blues',
    name: 'Blues Scale',
    genre: 'Blues/Rock',
    description: 'Minor pentatonic with an added "blue note" (b5). Creates that classic bluesy, gritty sound.',
    songs: ['The Thrill Is Gone - B.B. King', 'Pride and Joy - Stevie Ray Vaughan', 'Crossroads - Cream']
  },
  {
    scale: 'major',
    name: 'Major Scale',
    genre: 'Pop/Country',
    description: 'The foundation of Western music. Bright, happy sound. Essential for understanding all other scales and modes.',
    songs: ['Let It Be - Beatles', 'Sweet Home Alabama - Lynyrd Skynyrd', 'Wonderful Tonight - Eric Clapton']
  },
  {
    scale: 'minor',
    name: 'Natural Minor',
    genre: 'Rock/Metal',
    description: 'Sad, melancholic sound. The relative minor of the major scale. Foundation for many metal riffs.',
    songs: ['Nothing Else Matters - Metallica', 'Stairway to Heaven - Led Zeppelin', 'Hotel California - Eagles']
  },
  {
    scale: 'dorian',
    name: 'Dorian Mode',
    genre: 'Jazz/Funk',
    description: 'Minor scale with a raised 6th. Creates a sophisticated, jazzy minor sound. Great for minor 7th chords.',
    songs: ['So What - Miles Davis', 'Oye Como Va - Santana', 'Another Brick in the Wall - Pink Floyd']
  },
  {
    scale: 'phrygian',
    name: 'Phrygian Mode',
    genre: 'Metal/Flamenco',
    description: 'Dark, Spanish/Middle Eastern flavor. The b2 interval creates tension and drama. Popular in thrash metal.',
    songs: ['War - Joe Satriani', 'Wherever I May Roam - Metallica', 'Hangar 18 - Megadeth']
  },
  {
    scale: 'mixolydian',
    name: 'Mixolydian Mode',
    genre: 'Rock/Blues',
    description: 'Major scale with a b7. Perfect for dominant 7th chords. Creates that classic rock swagger.',
    songs: ['Sweet Child O\' Mine - Guns N\' Roses', 'Sympathy for the Devil - Rolling Stones', 'Norwegian Wood - Beatles']
  },
  {
    scale: 'harmonic_minor',
    name: 'Harmonic Minor',
    genre: 'Classical/Metal',
    description: 'Natural minor with a raised 7th. Creates dramatic, exotic sound. Essential for neoclassical shred.',
    songs: ['Mr. Crowley - Ozzy Osbourne', 'Far Beyond the Sun - Yngwie Malmsteen', 'Gates of Babylon - Rainbow']
  },
  {
    scale: 'lydian',
    name: 'Lydian Mode',
    genre: 'Fusion/Progressive',
    description: 'Major scale with a #4. Dreamy, floating quality. Popular in film scores and progressive rock.',
    songs: ['Flying in a Blue Dream - Joe Satriani', 'Freewill - Rush', 'The Simpsons Theme']
  },
  {
    scale: 'locrian',
    name: 'Locrian Mode',
    genre: 'Jazz/Experimental',
    description: 'The darkest mode with a diminished quality. Rarely used as a key center but essential for diminished chords.',
    songs: ['Dust to Dust - John Kirkpatrick', 'Army of Me - Bjork', 'YYZ - Rush (bridge)']
  },
  {
    scale: 'pentatonic_major',
    name: 'Major Pentatonic',
    genre: 'Country/Pop',
    description: 'Five-note scale with a bright, happy sound. Country music staple. Great for major chord progressions.',
    songs: ['My Girl - Temptations', 'Honky Tonk Women - Rolling Stones', 'Centerfold - J. Geils Band']
  },
  {
    scale: 'melodic_minor',
    name: 'Melodic Minor',
    genre: 'Jazz/Fusion',
    description: 'Minor scale with raised 6th and 7th. Sophisticated jazz sound. Parent scale of many advanced modes.',
    songs: ['Donna Lee - Charlie Parker', 'Spain - Chick Corea', 'Black Market - Weather Report']
  }
];

export default SCALE_EXAMPLES;

/**
 * Get example by scale key
 * @param {string} scaleKey - Scale identifier (e.g., 'pentatonic_minor')
 * @returns {object|undefined} Scale example object or undefined
 */
export function getScaleExample(scaleKey) {
  return SCALE_EXAMPLES.find(ex => ex.scale === scaleKey);
}

/**
 * Get all scale keys that have examples
 * @returns {string[]} Array of scale keys
 */
export function getAvailableScaleKeys() {
  return SCALE_EXAMPLES.map(ex => ex.scale);
}
