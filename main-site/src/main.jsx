import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import Manifesto from './pages/Manifesto.jsx'
import Services from './pages/Services.jsx'
import Blog from './pages/Blog.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import Guitar from './pages/Guitar.jsx'
import NotFound from './pages/NotFound.jsx'
import Louisville from './pages/Louisville.jsx'
import LouisvilleCategory from './pages/LouisvilleCategory.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './App.css'

const Dashboard = lazy(() => import('./crm/Dashboard.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<App />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="/guitar" element={<Guitar />} />
        <Route path="/louisville" element={<Louisville />} />
        <Route path="/louisville/:category" element={<LouisvilleCategory />} />
        <Route path="/dashboard" element={
          <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" /></div>}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
