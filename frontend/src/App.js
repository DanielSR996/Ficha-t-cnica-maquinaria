import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CreateFicha from './pages/CreateFicha';
import FichaDetail from './pages/FichaDetail';
import FichasList from './pages/FichasList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crear" element={<CreateFicha />} />
            <Route path="/fichas" element={<FichasList />} />
            <Route path="/fichas/:id" element={<FichaDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 