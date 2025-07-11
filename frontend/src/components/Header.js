import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-secondary-800">
              Maquinarias
            </span>
          </Link>

          <nav className="flex space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/crear"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/crear')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
              }`}
            >
              Crear Ficha
            </Link>
            <Link
              to="/fichas"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/fichas')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
              }`}
            >
              Ver Fichas
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 