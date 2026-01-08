import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navigation from './components/Navigation';
import Home from './pages/Home';

// Lazy load heavy pages for code splitting
const FretVision = lazy(() => import('./pages/FretVision'));
const TabPlayer = lazy(() => import('./pages/TabPlayer'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ChordDictionary = lazy(() => import('./pages/ChordDictionary'));
const Tuner = lazy(() => import('./pages/Tuner'));
const Metronome = lazy(() => import('./pages/Metronome'));
const BackingTracks = lazy(() => import('./pages/BackingTracks'));
const ScaleTrainer = lazy(() => import('./pages/ScaleTrainer'));
const EarTraining = lazy(() => import('./pages/EarTraining'));
const Pricing = lazy(() => import('./pages/Pricing'));
const RiffGenerator = lazy(() => import('./pages/RiffGenerator'));
const About = lazy(() => import('./pages/About'));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navigation />
        <main role="main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fretvision" element={<FretVision />} />
              <Route path="/tabplayer" element={<TabPlayer />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/chords" element={<ChordDictionary />} />
              <Route path="/tuner" element={<Tuner />} />
              <Route path="/metronome" element={<Metronome />} />
              <Route path="/backing" element={<BackingTracks />} />
              <Route path="/scales" element={<ScaleTrainer />} />
              <Route path="/ear-training" element={<EarTraining />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/riff-generator" element={<RiffGenerator />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>
        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;
