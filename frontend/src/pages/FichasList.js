import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fichasService } from '../services/api';

const FichasList = () => {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadFichas();
  }, [pagination.page]);

  const loadFichas = async () => {
    try {
      setLoading(true);
      const response = await fichasService.getAll(pagination.page, pagination.limit);
      setFichas(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setError(error.message || 'Error al cargar las fichas técnicas');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const PaginationButton = ({ page, isActive, onClick, disabled, children }) => (
    <button
      onClick={() => onClick(page)}
      disabled={disabled}
      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-primary-600 text-white'
          : disabled
          ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
          : 'bg-white text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
      } border border-secondary-300 first:rounded-l-lg last:rounded-r-lg`}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="border border-secondary-200 rounded-lg p-4">
                  <div className="h-6 bg-secondary-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-800">
          Fichas Técnicas
        </h1>
        <Link
          to="/crear"
          className="btn-primary"
        >
          + Nueva Ficha
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {fichas.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-secondary-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">
            No hay fichas técnicas
          </h2>
          <p className="text-secondary-600 mb-6">
            Comienza creando tu primera ficha técnica de maquinaria.
          </p>
          <Link
            to="/crear"
            className="btn-primary"
          >
            Crear Primera Ficha
          </Link>
        </div>
      ) : (
        <>
          {/* Lista de fichas */}
          <div className="space-y-4 mb-8">
            {fichas.map(ficha => (
              <div
                key={ficha.id}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-secondary-800">
                        {ficha.marca} {ficha.modelo}
                      </h3>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                        {ficha.clave_pedimento}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-secondary-600">Serie:</span>
                        <p className="text-secondary-800">{ficha.serie}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-secondary-600">Pedimento:</span>
                        <p className="text-secondary-800">{ficha.pedimento}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-secondary-600">Fecha:</span>
                        <p className="text-secondary-800">{formatDate(ficha.created_at)}</p>
                      </div>
                    </div>

                    <p className="text-secondary-600 text-sm line-clamp-2">
                      {ficha.descripcion}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    {ficha.qr_code_path && (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-1">
                          <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M16 8h4.01" />
                          </svg>
                        </div>
                        <span className="text-xs text-secondary-600">QR</span>
                      </div>
                    )}
                    
                    <Link
                      to={`/fichas/${ficha.id}`}
                      className="btn-primary"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-1">
                <PaginationButton
                  page={pagination.page - 1}
                  onClick={handlePageChange}
                  disabled={pagination.page === 1}
                >
                  ← Anterior
                </PaginationButton>

                {/* Números de página */}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => {
                  // Mostrar solo algunas páginas alrededor de la página actual
                  const shouldShow = 
                    page === 1 || 
                    page === pagination.pages || 
                    Math.abs(page - pagination.page) <= 2;
                  
                  if (!shouldShow) {
                    // Mostrar puntos suspensivos
                    if (page === 2 && pagination.page > 4) {
                      return <span key={page} className="px-2 text-secondary-400">...</span>;
                    }
                    if (page === pagination.pages - 1 && pagination.page < pagination.pages - 3) {
                      return <span key={page} className="px-2 text-secondary-400">...</span>;
                    }
                    return null;
                  }

                  return (
                    <PaginationButton
                      key={page}
                      page={page}
                      isActive={pagination.page === page}
                      onClick={handlePageChange}
                    >
                      {page}
                    </PaginationButton>
                  );
                })}

                <PaginationButton
                  page={pagination.page + 1}
                  onClick={handlePageChange}
                  disabled={pagination.page === pagination.pages}
                >
                  Siguiente →
                </PaginationButton>
              </div>
            </div>
          )}

          {/* Información de paginación */}
          <div className="text-center mt-4 text-sm text-secondary-600">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} fichas
          </div>
        </>
      )}
    </div>
  );
};

export default FichasList; 