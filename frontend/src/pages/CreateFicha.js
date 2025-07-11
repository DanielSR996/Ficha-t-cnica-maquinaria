import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fichasService, validationService } from '../services/api';

const CreateFicha = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const [formData, setFormData] = useState({
    pedimento: '',
    clave_pedimento: '',
    fecha_pago: '',
    factura: '',
    fecha_facturacion: '',
    valor_usd: '',
    valor_aduana: '',
    pais_origen: '',
    marca: '',
    modelo: '',
    serie: '',
    descripcion: '',
    ubicacion_planta: '',
    identificador_af: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = [];
    const imageErrors = [];

    files.forEach((file, index) => {
      if (!validationService.isValidImage(file)) {
        imageErrors.push(`Archivo ${index + 1}: Tipo de archivo no válido. Solo se permiten JPG, PNG y GIF.`);
        return;
      }
      
      if (!validationService.isValidFileSize(file, 5)) {
        imageErrors.push(`Archivo ${index + 1}: El archivo es muy grande. Máximo 5MB.`);
        return;
      }
      
      validImages.push(file);
    });

    if (imageErrors.length > 0) {
      setError(imageErrors.join('\n'));
      return;
    }

    setSelectedImages(validImages);
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar campos requeridos
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        newErrors[key] = 'Este campo es requerido';
      }
    });

    // Validar fechas
    if (formData.fecha_pago && !validationService.isValidDate(formData.fecha_pago)) {
      newErrors.fecha_pago = 'Fecha inválida';
    }

    if (formData.fecha_facturacion && !validationService.isValidDate(formData.fecha_facturacion)) {
      newErrors.fecha_facturacion = 'Fecha inválida';
    }

    // Validar valores numéricos
    if (formData.valor_usd && !validationService.isValidNumber(formData.valor_usd)) {
      newErrors.valor_usd = 'Debe ser un número válido';
    }

    if (formData.valor_aduana && !validationService.isValidNumber(formData.valor_aduana)) {
      newErrors.valor_aduana = 'Debe ser un número válido';
    }

    // Validar imágenes
    if (selectedImages.length < 1) {
      newErrors.imagenes = 'Debe subir al menos 1 imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      
      // Agregar datos del formulario
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Agregar imágenes
      selectedImages.forEach(image => {
        submitData.append('imagenes', image);
      });

      const response = await fichasService.create(submitData);
      
      setSuccess('Ficha técnica creada exitosamente');
      
      // Redirigir a la ficha creada después de un breve delay
      setTimeout(() => {
        navigate(`/fichas/${response.fichaId}`);
      }, 2000);

    } catch (error) {
      setError(error.message || 'Error al crear la ficha técnica');
    } finally {
      setLoading(false);
    }
  };

  const clavesPedimento = ['AF', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-secondary-800 mb-6">
          Crear Nueva Ficha Técnica
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pedimento */}
            <div>
              <label className="form-label">
                Pedimento *
              </label>
              <input
                type="text"
                name="pedimento"
                value={formData.pedimento}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Número de pedimento"
              />
              {errors.pedimento && <p className="form-error">{errors.pedimento}</p>}
            </div>

            {/* Clave de pedimento */}
            <div>
              <label className="form-label">
                Clave de Pedimento *
              </label>
              <select
                name="clave_pedimento"
                value={formData.clave_pedimento}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Seleccionar clave</option>
                {clavesPedimento.map(clave => (
                  <option key={clave} value={clave}>{clave}</option>
                ))}
              </select>
              {errors.clave_pedimento && <p className="form-error">{errors.clave_pedimento}</p>}
            </div>

            {/* Fecha de pago */}
            <div>
              <label className="form-label">
                Fecha de Pago *
              </label>
              <input
                type="date"
                name="fecha_pago"
                value={formData.fecha_pago}
                onChange={handleInputChange}
                className="input-field"
              />
              {errors.fecha_pago && <p className="form-error">{errors.fecha_pago}</p>}
            </div>

            {/* Factura */}
            <div>
              <label className="form-label">
                Factura *
              </label>
              <input
                type="text"
                name="factura"
                value={formData.factura}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Número de factura"
              />
              {errors.factura && <p className="form-error">{errors.factura}</p>}
            </div>

            {/* Fecha de facturación */}
            <div>
              <label className="form-label">
                Fecha de Facturación *
              </label>
              <input
                type="date"
                name="fecha_facturacion"
                value={formData.fecha_facturacion}
                onChange={handleInputChange}
                className="input-field"
              />
              {errors.fecha_facturacion && <p className="form-error">{errors.fecha_facturacion}</p>}
            </div>

            {/* Valor USD */}
            <div>
              <label className="form-label">
                Valor USD *
              </label>
              <input
                type="number"
                step="0.01"
                name="valor_usd"
                value={formData.valor_usd}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
              />
              {errors.valor_usd && <p className="form-error">{errors.valor_usd}</p>}
            </div>

            {/* Valor aduana */}
            <div>
              <label className="form-label">
                Valor Aduana *
              </label>
              <input
                type="number"
                step="0.01"
                name="valor_aduana"
                value={formData.valor_aduana}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
              />
              {errors.valor_aduana && <p className="form-error">{errors.valor_aduana}</p>}
            </div>

            {/* País de origen */}
            <div>
              <label className="form-label">
                País de Origen *
              </label>
              <input
                type="text"
                name="pais_origen"
                value={formData.pais_origen}
                onChange={handleInputChange}
                className="input-field"
                placeholder="País de origen"
              />
              {errors.pais_origen && <p className="form-error">{errors.pais_origen}</p>}
            </div>

            {/* Marca */}
            <div>
              <label className="form-label">
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Marca de la maquinaria"
              />
              {errors.marca && <p className="form-error">{errors.marca}</p>}
            </div>

            {/* Modelo */}
            <div>
              <label className="form-label">
                Modelo *
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Modelo de la maquinaria"
              />
              {errors.modelo && <p className="form-error">{errors.modelo}</p>}
            </div>

            {/* Serie */}
            <div>
              <label className="form-label">
                Serie *
              </label>
              <input
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Número de serie"
              />
              {errors.serie && <p className="form-error">{errors.serie}</p>}
            </div>

            {/* Ubicación en planta */}
            <div>
              <label className="form-label">
                Ubicación en Planta *
              </label>
              <input
                type="text"
                name="ubicacion_planta"
                value={formData.ubicacion_planta}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ubicación dentro de la planta"
              />
              {errors.ubicacion_planta && <p className="form-error">{errors.ubicacion_planta}</p>}
            </div>

            {/* Identificador AF */}
            <div>
              <label className="form-label">
                Identificador AF *
              </label>
              <input
                type="text"
                name="identificador_af"
                value={formData.identificador_af}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Identificador AF"
              />
              {errors.identificador_af && <p className="form-error">{errors.identificador_af}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="form-label">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="input-field"
              rows="4"
              placeholder="Descripción detallada de la maquinaria"
            />
            {errors.descripcion && <p className="form-error">{errors.descripcion}</p>}
          </div>

          {/* Imágenes */}
          <div>
            <label className="form-label">
              Imágenes * (mínimo 1)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="input-field"
            />
            {selectedImages.length > 0 && (
              <p className="text-sm text-secondary-600 mt-1">
                {selectedImages.length} archivo(s) seleccionado(s)
              </p>
            )}
            {errors.imagenes && <p className="form-error">{errors.imagenes}</p>}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/fichas')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Ficha Técnica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFicha; 