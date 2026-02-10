import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Manifesto from './pages/Manifesto.jsx'
import Blog from './pages/Blog.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './App.css'

const Dashboard = lazy(() => import('./crm/Dashboard.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<App />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/dashboard" element={
          <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" /></div>}>
            <Dashboard />
          </Suspense>
        } />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
