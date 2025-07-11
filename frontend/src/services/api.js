import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error);
    
    if (error.response) {
      // El servidor respondió con un código de estado de error
      const message = error.response.data?.error || error.response.data?.message || 'Error desconocido';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // La petición fue realizada pero no se recibió respuesta
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {
      // Algo más causó el error
      return Promise.reject(new Error('Error al procesar la petición'));
    }
  }
);

// Servicios para fichas técnicas
export const fichasService = {
  // Crear nueva ficha técnica
  async create(formData) {
    try {
      const response = await api.post('/fichas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener ficha técnica por ID
  async getById(id) {
    try {
      const response = await api.get(`/fichas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las fichas técnicas con paginación
  async getAll(page = 1, limit = 10) {
    try {
      const response = await api.get(`/fichas?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar estado del servidor
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Utilidades para manejo de archivos
export const fileService = {
  // Obtener URL completa de imagen
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${imagePath}`;
  },

  // Obtener URL completa de QR
  getQRUrl(qrPath) {
    if (!qrPath) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (qrPath.startsWith('http')) {
      return qrPath;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${qrPath}`;
  }
};

// Validaciones
export const validationService = {
  // Validar formato de fecha
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  // Validar formato de número
  isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
  },

  // Validar formato de archivo de imagen
  isValidImage(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  },

  // Validar tamaño de archivo (en bytes)
  isValidFileSize(file, maxSizeInMB = 5) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }
};

export default api; 