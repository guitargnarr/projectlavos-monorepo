import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scaleBooks = [
  {
    id: 'minor-pentatonic',
    title: 'Minor Pentatonic',
    category: 'Pentatonic & Blues',
    description: 'The minor pentatonic scale is the single most important scale in rock, blues, and popular music. Five notes, five positions, infinite possibilities. This resource provides every position in every key with mathematically verified tablature, companion chords to play over, and eight exercise types designed to build real fretboard fluency.',
    palette: { bg: '#0d0d0d', blob_dk: '#1a1816', blob_lt: '#2a2420', accent: '#c8842e', accent_lt: '#e8c47c' },
    pdfUrl: '/guitar/minor-pentatonic.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'major-pentatonic',
    title: 'Major Pentatonic',
    category: 'Pentatonic & Blues',
    description: 'The major pentatonic scale is the bright, uplifting counterpart to the minor pentatonic. Essential for country, pop, and major-key soloing. Every position, every key, verified and exercise-ready.',
    palette: { bg: '#0a0d10', blob_dk: '#141e28', blob_lt: '#1e2e3e', accent: '#4a90c8', accent_lt: '#8ac0e8' },
    pdfUrl: '/guitar/major-pentatonic.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'blues',
    title: 'Blues',
    category: 'Pentatonic & Blues',
    description: 'The blues scale adds one chromatic passing tone -- the b5 -- to the minor pentatonic, creating the gritty tension and release that defines the blues. Every position in every key with verified tablature and targeted exercises.',
    palette: { bg: '#0d0a0a', blob_dk: '#1e1214', blob_lt: '#2e1a1e', accent: '#a83038', accent_lt: '#d06068' },
    pdfUrl: '/guitar/blues.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'major-blues',
    title: 'Major Blues',
    category: 'Pentatonic & Blues',
    description: 'The major blues scale blends major and minor thirds by adding a b3 passing tone to the major pentatonic. The sophisticated, soulful sound heard in country blues, jazz blues, and the playing of B.B. King and Albert King.',
    palette: { bg: '#0d0c08', blob_dk: '#1e1a10', blob_lt: '#2e2818', accent: '#b89828', accent_lt: '#e0c860' },
    pdfUrl: '/guitar/major-blues.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'natural-major',
    title: 'Natural Major',
    category: 'Diatonic Modes',
    description: 'The major scale is the foundation of all Western harmony. Every chord, every mode, every key signature derives from this seven-note pattern. Mastering it across the full fretboard is essential for understanding music theory in a practical, playable way.',
    palette: { bg: '#080d0a', blob_dk: '#10201a', blob_lt: '#1a3028', accent: '#28a068', accent_lt: '#68d0a0' },
    pdfUrl: '/guitar/natural-major.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'natural-minor',
    title: 'Natural Minor',
    category: 'Diatonic Modes',
    description: 'The natural minor scale is the most common minor sound in rock and pop music. Its dark, melancholic quality drives everything from ballads to metal. This resource builds fluency across all positions and keys.',
    palette: { bg: '#0a080d', blob_dk: '#18101e', blob_lt: '#28182e', accent: '#7848a8', accent_lt: '#a880d0' },
    pdfUrl: '/guitar/natural-minor.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'dorian',
    title: 'Dorian',
    category: 'Diatonic Modes',
    description: 'The Dorian mode is a minor scale with a raised 6th -- the sound of Santana, Miles Davis, and countless jazz and funk records. Its bright minor quality makes it the most versatile mode for improvisation over minor chords.',
    palette: { bg: '#0d0b08', blob_dk: '#1e1610', blob_lt: '#30221a', accent: '#c06828', accent_lt: '#e09858' },
    pdfUrl: '/guitar/dorian.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'phrygian',
    title: 'Phrygian',
    category: 'Diatonic Modes',
    description: "The Phrygian mode's signature flat 2nd creates an unmistakable Spanish and Middle Eastern flavor. Essential for flamenco, metal, and film score work. The darkest of the common minor modes.",
    palette: { bg: '#0d0808', blob_dk: '#201010', blob_lt: '#381818', accent: '#c03030', accent_lt: '#e06060' },
    pdfUrl: '/guitar/phrygian.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'lydian',
    title: 'Lydian',
    category: 'Diatonic Modes',
    description: "The Lydian mode's raised 4th creates a dreamy, floating major sound. The signature scale of Steve Vai, Joe Satriani, and countless film composers. Bright, ethereal, and immediately recognizable.",
    palette: { bg: '#08080d', blob_dk: '#101020', blob_lt: '#181838', accent: '#5050c8', accent_lt: '#8888e8' },
    pdfUrl: '/guitar/lydian.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'mixolydian',
    title: 'Mixolydian',
    category: 'Diatonic Modes',
    description: 'The Mixolydian mode is the dominant scale -- a major scale with a flat 7th. The sound of blues-rock, classic rock, and the Allman Brothers. Essential for playing over dominant 7th chords.',
    palette: { bg: '#0d0d08', blob_dk: '#1e1e10', blob_lt: '#30301a', accent: '#a8a028', accent_lt: '#d0d060' },
    pdfUrl: '/guitar/mixolydian.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'locrian',
    title: 'Locrian',
    category: 'Diatonic Modes',
    description: 'The Locrian mode is the most dissonant diatonic mode, with both a flat 2nd and flat 5th. Used over half-diminished chords in jazz and for creating tension in metal. A challenging but essential theoretical tool.',
    palette: { bg: '#0a0a0a', blob_dk: '#161616', blob_lt: '#222222', accent: '#808080', accent_lt: '#b0b0b0' },
    pdfUrl: '/guitar/locrian.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'harmonic-minor',
    title: 'Harmonic Minor',
    category: 'Harmonic Minor Family',
    description: 'The harmonic minor scale raises the 7th degree of the natural minor, creating a leading tone and the characteristic augmented 2nd interval. The sound of classical music, neoclassical metal, and Middle Eastern tonality.',
    palette: { bg: '#0d080a', blob_dk: '#201018', blob_lt: '#381828', accent: '#a82870', accent_lt: '#d058a0' },
    pdfUrl: '/guitar/harmonic-minor.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'phrygian-dominant',
    title: 'Phrygian Dominant',
    category: 'Harmonic Minor Family',
    description: 'The Phrygian Dominant scale -- the 5th mode of harmonic minor -- is the quintessential flamenco and Middle Eastern scale. Its combination of a flat 2nd with a major 3rd creates exotic, dramatic tension.',
    palette: { bg: '#0d0a06', blob_dk: '#20180e', blob_lt: '#382818', accent: '#c89020', accent_lt: '#e0b850' },
    pdfUrl: '/guitar/phrygian-dominant.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'melodic-minor',
    title: 'Melodic Minor',
    category: 'Melodic Minor Family',
    description: 'The melodic minor scale -- also called the jazz minor -- is a minor scale with a natural 6th and 7th. The foundation of modern jazz harmony, generating seven modes that cover altered dominants, lydian dominants, and more.',
    palette: { bg: '#060d0d', blob_dk: '#0e2020', blob_lt: '#183030', accent: '#28a0a0', accent_lt: '#60d0d0' },
    pdfUrl: '/guitar/melodic-minor.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'lydian-dominant',
    title: 'Lydian Dominant',
    category: 'Melodic Minor Family',
    description: "The Lydian Dominant scale combines Lydian's raised 4th with Mixolydian's flat 7th. The overtone series scale, used over dominant 7#11 chords in jazz and fusion.",
    palette: { bg: '#0d0d06', blob_dk: '#20200e', blob_lt: '#383018', accent: '#b8b028', accent_lt: '#e0e060' },
    pdfUrl: '/guitar/lydian-dominant.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'altered',
    title: 'Altered',
    category: 'Melodic Minor Family',
    description: 'The Altered scale is the 7th mode of melodic minor, containing every possible alteration of a dominant chord: b9, #9, b5, #5. The essential jazz scale for dominant chords resolving to tonic.',
    palette: { bg: '#0d060a', blob_dk: '#200e18', blob_lt: '#381828', accent: '#b028a0', accent_lt: '#e058d0' },
    pdfUrl: '/guitar/altered.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'whole-tone',
    title: 'Whole Tone',
    category: 'Symmetric Scales',
    description: 'The whole tone scale divides the octave into six equal whole steps, creating an ambiguous, dreamlike quality with no resolution. Only two unique transpositions exist. The sound of Debussy and augmented chord passages.',
    palette: { bg: '#080a0d', blob_dk: '#101a20', blob_lt: '#182a38', accent: '#2888c0', accent_lt: '#60b8e0' },
    pdfUrl: '/guitar/whole-tone.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'half-whole-dim',
    title: 'Half-Whole Diminished',
    category: 'Symmetric Scales',
    description: 'The half-whole diminished scale alternates half and whole steps across eight notes. Used over dominant 7th chords with altered extensions. Only three unique transpositions exist. Essential jazz vocabulary.',
    palette: { bg: '#0a0d08', blob_dk: '#142010', blob_lt: '#1e3018', accent: '#50a838', accent_lt: '#80d068' },
    pdfUrl: '/guitar/half-whole-dim.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'whole-half-dim',
    title: 'Whole-Half Diminished',
    category: 'Symmetric Scales',
    description: 'The whole-half diminished scale alternates whole and half steps across eight notes. Used over diminished 7th chords. Only three unique transpositions exist. A symmetric scale that creates kaleidoscopic harmonic possibilities.',
    palette: { bg: '#0d080d', blob_dk: '#201020', blob_lt: '#381838', accent: '#a838a8', accent_lt: '#d068d0' },
    pdfUrl: '/guitar/whole-half-dim.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'bebop-dominant',
    title: 'Bebop Dominant',
    category: 'Bebop',
    description: 'The bebop dominant scale adds a passing natural 7th to the Mixolydian mode, creating an eight-note scale where chord tones land on strong beats during eighth-note lines. The scale of Charlie Parker, Dizzy Gillespie, and all of bebop.',
    palette: { bg: '#0d0a08', blob_dk: '#201810', blob_lt: '#382818', accent: '#c87828', accent_lt: '#e0a858' },
    pdfUrl: '/guitar/bebop-dominant.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'double-harmonic',
    title: 'Double Harmonic',
    category: 'Exotic Scales',
    description: 'The double harmonic major scale features two augmented 2nd intervals, creating an intensely exotic sound. Also called the Byzantine or Arabic scale, the sound of Misirlou, Bollywood, and Romani music.',
    palette: { bg: '#0d0808', blob_dk: '#201210', blob_lt: '#381e18', accent: '#c85028', accent_lt: '#e08058' },
    pdfUrl: '/guitar/double-harmonic.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'hungarian-minor',
    title: 'Hungarian Minor',
    category: 'Exotic Scales',
    description: 'The Hungarian minor scale combines a raised 4th with a flat 6th and major 7th, creating a dark, dramatic sound with two augmented 2nd intervals. The sound of Eastern European folk, klezmer, and Romani music.',
    palette: { bg: '#08080d', blob_dk: '#121220', blob_lt: '#1e1e38', accent: '#4848b8', accent_lt: '#7878e0' },
    pdfUrl: '/guitar/hungarian-minor.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'hirajoshi',
    title: 'Hirajoshi',
    category: 'Exotic Scales',
    description: 'The Hirajoshi scale is a Japanese pentatonic with a haunting, dark beauty. Its two half-step intervals create tension absent from Western pentatonics. Used by Marty Friedman, Tosin Abasi, and in ambient and progressive music.',
    palette: { bg: '#0a0d0a', blob_dk: '#142014', blob_lt: '#1e301e', accent: '#48a848', accent_lt: '#78d078' },
    pdfUrl: '/guitar/hirajoshi.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
  {
    id: 'in-sen',
    title: 'In Sen',
    category: 'Exotic Scales',
    description: 'The In Sen scale is a Japanese pentatonic with a Phrygian-like flat 2nd that creates an unstable, mysterious quality. Five notes that sound nothing like Western pentatonics -- dark, sparse, and evocative.',
    palette: { bg: '#0d0a0d', blob_dk: '#201420', blob_lt: '#301e30', accent: '#9848a8', accent_lt: '#c878d0' },
    pdfUrl: '/guitar/in-sen.pdf',
    stats: { keys: 12, positions: 5, exerciseTypes: 8, totalExercises: 480 },
  },
];

const categories = [
  { name: 'Pentatonic & Blues', ids: ['minor-pentatonic', 'major-pentatonic', 'blues', 'major-blues'] },
  { name: 'Diatonic Modes', ids: ['natural-major', 'natural-minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'] },
  { name: 'Harmonic Minor Family', ids: ['harmonic-minor', 'phrygian-dominant'] },
  { name: 'Melodic Minor Family', ids: ['melodic-minor', 'lydian-dominant', 'altered'] },
  { name: 'Symmetric Scales', ids: ['whole-tone', 'half-whole-dim', 'whole-half-dim'] },
  { name: 'Bebop', ids: ['bebop-dominant'] },
  { name: 'Exotic Scales', ids: ['double-harmonic', 'hungarian-minor', 'hirajoshi', 'in-sen'] },
];

const bookMap = Object.fromEntries(scaleBooks.map(b => [b.id, b]));

function BookCard({ book, onClick }) {
  const { palette } = book;

  return (
    <button
      onClick={onClick}
      className="card-glass-elite rounded-xl overflow-hidden text-left group cursor-pointer w-full transition-all duration-500 hover:scale-[1.02]"
      style={{ '--card-accent': palette.accent }}
    >
      <div
        className="aspect-[4/3] relative overflow-hidden"
        style={{ background: palette.bg }}
      >
        {/* Dark blob */}
        <div
          className="absolute rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${palette.blob_dk} 0%, transparent 70%)`,
            width: '200%', height: '200%', top: '-50%', left: '-30%',
          }}
        />
        {/* Light blob */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, ${palette.blob_lt} 0%, transparent 70%)`,
            width: '150%', height: '150%', bottom: '-40%', right: '-20%',
          }}
        />
        {/* Accent glow */}
        <div
          className="absolute rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${palette.accent} 0%, transparent 60%)`,
            width: '80%', height: '80%', top: '10%', left: '10%',
          }}
        />
        {/* Accent line */}
        <div
          className="absolute bottom-4 left-6 right-6 h-[1.5px] opacity-50"
          style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)` }}
        />
        {/* Scale name overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="heading-display text-2xl md:text-3xl text-white/90 tracking-[-0.02em] text-center px-4 group-hover:text-white transition-colors duration-300"
          >
            {book.title}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs tracking-[0.15em] uppercase mb-1.5" style={{ color: palette.accent_lt }}>
          {book.category}
        </p>
        <p className="text-slate-400 text-sm leading-relaxed mb-2 line-clamp-2">
          {book.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{book.stats.keys} keys</span>
          <span className="text-slate-700">|</span>
          <span>{book.stats.totalExercises} exercises</span>
          <span className="text-slate-700">|</span>
          <span>PDF</span>
        </div>
      </div>
    </button>
  );
}

function BookDetail({ book, onClose }) {
  const { palette, stats } = book;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-60 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-600/50 bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-white hover:border-teal-400/50 transition-all duration-300 group"
        aria-label="Close detail view"
      >
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Detail card */}
      <motion.div
        className="relative z-50 w-full max-w-2xl mx-4 rounded-2xl overflow-hidden border border-slate-700/50"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{ background: '#0f172a' }}
      >
        {/* Gradient header */}
        <div
          className="relative h-32 md:h-40 overflow-hidden"
          style={{ background: palette.bg }}
        >
          <div
            className="absolute rounded-full opacity-60"
            style={{
              background: `radial-gradient(circle, ${palette.blob_dk} 0%, transparent 70%)`,
              width: '200%', height: '200%', top: '-60%', left: '-30%',
            }}
          />
          <div
            className="absolute rounded-full opacity-40"
            style={{
              background: `radial-gradient(circle, ${palette.blob_lt} 0%, transparent 70%)`,
              width: '150%', height: '150%', bottom: '-50%', right: '-20%',
            }}
          />
          <div
            className="absolute rounded-full opacity-25"
            style={{
              background: `radial-gradient(circle, ${palette.accent} 0%, transparent 60%)`,
              width: '60%', height: '100%', top: '0', left: '20%',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="heading-display text-3xl md:text-4xl text-white tracking-[-0.02em]">
              {book.title}
            </h2>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          <p className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: palette.accent_lt }}>
            {book.category}
          </p>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            {book.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Keys', value: stats.keys },
              { label: 'Positions', value: stats.positions },
              { label: 'Exercise Types', value: stats.exerciseTypes },
              { label: 'Total Exercises', value: stats.totalExercises },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <div className="text-xl md:text-2xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600 mb-6 text-center">
            All tablature verified by mathematical fretboard computation
          </p>

          {/* Download button */}
          <div className="flex justify-center">
            <a
              href={book.pdfUrl}
              download
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-[0.15em] uppercase transition-all duration-500 ease-out border hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${palette.accent}15, ${palette.accent}08)`,
                borderColor: `${palette.accent}66`,
                color: palette.accent_lt,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${palette.accent}cc`;
                e.currentTarget.style.boxShadow = `0 0 30px -5px ${palette.accent}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${palette.accent}66`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Guitar() {
  const [visibleSections, setVisibleSections] = useState({});
  const [activeBook, setActiveBook] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Guitar Reference Library | Project Lavos';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="orb-3" />
      </div>
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="/" className="text-teal-400 hover:text-teal-300 transition-colors link-vintage">
            &larr; Back
          </a>
          <span className="text-slate-500 text-sm">projectlavos.com</span>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="heading-display text-4xl md:text-6xl text-white mb-4 animate-fade-in-up tracking-[-0.02em]">
            Guitar Reference Library
          </h1>
          <p className="text-lg md:text-xl text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            24 scale reference books. Every key, every position, <span className="accent-italic">verified</span>.
          </p>
          <p className="text-sm text-slate-500 mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            480 exercises per book &middot; 12 keys &middot; 5 CAGED positions &middot; 8 exercise types
          </p>
        </div>
      </header>

      {/* Category Sections */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {categories.map((cat, catIdx) => (
          <section
            key={cat.name}
            id={`cat-${catIdx}`}
            className={`mb-16 last:mb-0 transition-all duration-700 ${visibleSections[`cat-${catIdx}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="heading-display text-xl md:text-2xl text-white mb-6 tracking-[-0.01em]">
              {cat.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cat.ids.map(id => {
                const book = bookMap[id];
                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => setActiveBook(book)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Matthew Scott
          </p>
        </div>
      </footer>

      {/* Detail Modal */}
      <AnimatePresence>
        {activeBook && (
          <BookDetail
            book={activeBook}
            onClose={() => setActiveBook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
