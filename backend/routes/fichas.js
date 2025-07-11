const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');

const router = express.Router();

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/imgs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `img-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB por archivo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Función para generar QR Code
const generateQRCode = async (fichaId, data) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const qrUrl = `${baseUrl}/fichas/${fichaId}`;
    
    const qrFileName = `qr-${fichaId}-${Date.now()}.png`;
    const qrPath = path.join(__dirname, '../uploads/qrs/', qrFileName);
    
    await QRCode.toFile(qrPath, qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return `uploads/qrs/${qrFileName}`;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};

// POST /api/fichas - Crear nueva ficha técnica
router.post('/', upload.array('imagenes', 10), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      pedimento,
      clave_pedimento,
      fecha_pago,
      factura,
      fecha_facturacion,
      valor_usd,
      valor_aduana,
      pais_origen,
      marca,
      modelo,
      serie,
      descripcion,
      ubicacion_planta,
      identificador_af
    } = req.body;
    
    // Validar campos requeridos
    if (!pedimento || !clave_pedimento || !fecha_pago || !factura || 
        !fecha_facturacion || !valor_usd || !valor_aduana || !pais_origen || 
        !marca || !modelo || !serie || !descripcion || !ubicacion_planta || 
        !identificador_af) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Validar que se subió al menos 1 imagen
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'Debe subir al menos 1 imagen' });
    }
    
    // Insertar ficha técnica
    const [result] = await connection.execute(
      `INSERT INTO fichas_tecnicas (
        pedimento, clave_pedimento, fecha_pago, factura, fecha_facturacion,
        valor_usd, valor_aduana, pais_origen, marca, modelo, serie,
        descripcion, ubicacion_planta, identificador_af
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pedimento, clave_pedimento, fecha_pago, factura, fecha_facturacion,
        valor_usd, valor_aduana, pais_origen, marca, modelo, serie,
        descripcion, ubicacion_planta, identificador_af
      ]
    );
    
    const fichaId = result.insertId;
    
    // Generar QR Code
    const qrPath = await generateQRCode(fichaId, req.body);
    
    // Actualizar ficha con la ruta del QR
    await connection.execute(
      'UPDATE fichas_tecnicas SET qr_code_path = ? WHERE id = ?',
      [qrPath, fichaId]
    );
    
    // Insertar imágenes
    for (const file of req.files) {
      await connection.execute(
        'INSERT INTO ficha_imagenes (ficha_id, imagen_path) VALUES (?, ?)',
        [fichaId, `uploads/imgs/${file.filename}`]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Ficha técnica creada exitosamente',
      fichaId: fichaId,
      qrPath: qrPath
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error creando ficha:', error);
    
    // Limpiar archivos subidos en caso de error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error eliminando archivo:', err);
        });
      });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
});

// GET /api/fichas/:id - Obtener ficha técnica por ID
router.get('/:id', async (req, res) => {
  try {
    const fichaId = req.params.id;
    
    // Obtener ficha técnica
    const [fichaRows] = await pool.execute(
      'SELECT * FROM fichas_tecnicas WHERE id = ?',
      [fichaId]
    );
    
    if (fichaRows.length === 0) {
      return res.status(404).json({ error: 'Ficha técnica no encontrada' });
    }
    
    // Obtener imágenes asociadas
    const [imageRows] = await pool.execute(
      'SELECT imagen_path FROM ficha_imagenes WHERE ficha_id = ?',
      [fichaId]
    );
    
    const ficha = fichaRows[0];
    ficha.imagenes = imageRows.map(row => row.imagen_path);
    
    res.json({
      success: true,
      data: ficha
    });
    
  } catch (error) {
    console.error('Error obteniendo ficha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/fichas - Obtener todas las fichas técnicas (con paginación)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Obtener total de fichas
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM fichas_tecnicas'
    );
    const total = countResult[0].total;
    
    // Obtener fichas con paginación
    const [fichas] = await pool.execute(
      `SELECT id, pedimento, clave_pedimento, marca, modelo, serie, 
              descripcion, created_at, qr_code_path
       FROM fichas_tecnicas 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    res.json({
      success: true,
      data: fichas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo fichas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 