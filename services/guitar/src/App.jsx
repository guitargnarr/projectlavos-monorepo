import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import FretVision from './pages/FretVision';
import TabPlayer from './pages/TabPlayer';
import Catalog from './pages/Catalog';
import ChordDictionary from './pages/ChordDictionary';
import EarTraining from './pages/EarTraining';
import ScaleLibrary from './pages/ScaleLibrary';
import PracticeLogger from './pages/PracticeLogger';

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
          <Route path="/ear-training" element={<EarTraining />} />
          <Route path="/scales" element={<ScaleLibrary />} />
          <Route path="/practice-log" element={<PracticeLogger />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
