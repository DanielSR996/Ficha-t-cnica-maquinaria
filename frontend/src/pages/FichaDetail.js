import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fichasService, fileService } from '../services/api';

const FichaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadFicha();
  }, [id]);

  const loadFicha = async () => {
    try {
      setLoading(true);
      const response = await fichasService.getById(id);
      setFicha(response.data);
    } catch (error) {
      setError(error.message || 'Error al cargar la ficha técnica');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
              <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
              <div className="h-4 bg-secondary-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-secondary-800 mb-2">Error</h2>
            <p className="text-secondary-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/fichas')}
              className="btn-primary"
            >
              Volver a Fichas
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-secondary-800 mb-2">Ficha no encontrada</h2>
            <p className="text-secondary-600 mb-4">La ficha técnica solicitada no existe.</p>
            <button
              onClick={() => navigate('/fichas')}
              className="btn-primary"
            >
              Volver a Fichas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-800">
          Ficha Técnica #{ficha.id}
        </h1>
        <button
          onClick={() => navigate('/fichas')}
          className="btn-secondary"
        >
          ← Volver a Fichas
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del pedimento */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Información del Pedimento
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-secondary-600">Pedimento:</span>
                <p className="text-secondary-800">{ficha.pedimento}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Clave:</span>
                <p className="text-secondary-800">{ficha.clave_pedimento}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Fecha de Pago:</span>
                <p className="text-secondary-800">{formatDate(ficha.fecha_pago)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Factura:</span>
                <p className="text-secondary-800">{ficha.factura}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Fecha de Facturación:</span>
                <p className="text-secondary-800">{formatDate(ficha.fecha_facturacion)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">País de Origen:</span>
                <p className="text-secondary-800">{ficha.pais_origen}</p>
              </div>
            </div>
          </div>

          {/* Información técnica */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Información Técnica
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-secondary-600">Marca:</span>
                <p className="text-secondary-800 font-medium">{ficha.marca}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Modelo:</span>
                <p className="text-secondary-800 font-medium">{ficha.modelo}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Serie:</span>
                <p className="text-secondary-800">{ficha.serie}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Identificador AF:</span>
                <p className="text-secondary-800">{ficha.identificador_af}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Ubicación en Planta:</span>
                <p className="text-secondary-800">{ficha.ubicacion_planta}</p>
              </div>
            </div>
          </div>

          {/* Información financiera */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Información Financiera
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-secondary-600">Valor USD:</span>
                <p className="text-secondary-800 text-lg font-semibold text-green-600">
                  {formatCurrency(ficha.valor_usd)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Valor Aduana:</span>
                <p className="text-secondary-800 text-lg font-semibold text-blue-600">
                  {formatCurrency(ficha.valor_aduana)}
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Descripción
            </h2>
            <p className="text-secondary-700 leading-relaxed">
              {ficha.descripcion}
            </p>
          </div>

          {/* Galería de imágenes */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Galería de Imágenes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ficha.imagenes && ficha.imagenes.map((imagePath, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => openImageModal(imagePath)}
                >
                  <img
                    src={fileService.getImageUrl(imagePath)}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar con QR y acciones */}
        <div className="space-y-6">
          {/* Código QR */}
          <div className="card text-center">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Código QR
            </h2>
            {ficha.qr_code_path ? (
              <div>
                <img
                  src={fileService.getQRUrl(ficha.qr_code_path)}
                  alt="Código QR"
                  className="w-48 h-48 mx-auto mb-4 border border-secondary-200 rounded-lg"
                />
                <p className="text-sm text-secondary-600 mb-4">
                  Escanea este código para acceder a la ficha técnica
                </p>
                <a
                  href={fileService.getQRUrl(ficha.qr_code_path)}
                  download={`qr-ficha-${ficha.id}.png`}
                  className="btn-secondary text-sm"
                >
                  Descargar QR
                </a>
              </div>
            ) : (
              <p className="text-secondary-600">QR no disponible</p>
            )}
          </div>

          {/* Información adicional */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Información Adicional
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-secondary-600">Fecha de Creación:</span>
                <p className="text-secondary-800">{formatDate(ficha.created_at)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">Última Actualización:</span>
                <p className="text-secondary-800">{formatDate(ficha.updated_at)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-600">ID de Ficha:</span>
                <p className="text-secondary-800 font-mono">{ficha.id}</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">
              Acciones
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => window.print()}
                className="btn-secondary w-full"
              >
                Imprimir Ficha
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Enlace copiado al portapapeles');
                }}
                className="btn-secondary w-full"
              >
                Copiar Enlace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagen */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={fileService.getImageUrl(selectedImage)}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FichaDetail; 