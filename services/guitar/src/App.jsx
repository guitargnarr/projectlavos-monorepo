import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FretVision from './pages/FretVision';
import TabPlayer from './pages/TabPlayer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fretvision" element={<FretVision />} />
          <Route path="/tabplayer" element={<TabPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
