import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import FretVision from './pages/FretVision';
import TabPlayer from './pages/TabPlayer';
import Catalog from './pages/Catalog';
import ChordDictionary from './pages/ChordDictionary';
import Tuner from './pages/Tuner';
import Metronome from './pages/Metronome';
import BackingTracks from './pages/BackingTracks';
import ScaleTrainer from './pages/ScaleTrainer';
import EarTraining from './pages/EarTraining';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navigation />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
