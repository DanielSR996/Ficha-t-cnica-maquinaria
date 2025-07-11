const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'maquinarias_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Crear la base de datos si no existe
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.execute(`USE ${dbConfig.database}`);
    
    // Crear tabla de fichas técnicas
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS fichas_tecnicas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedimento VARCHAR(255) NOT NULL,
        clave_pedimento VARCHAR(10) NOT NULL,
        fecha_pago DATE NOT NULL,
        factura VARCHAR(255) NOT NULL,
        fecha_facturacion DATE NOT NULL,
        valor_usd DECIMAL(15,2) NOT NULL,
        valor_aduana DECIMAL(15,2) NOT NULL,
        pais_origen VARCHAR(100) NOT NULL,
        marca VARCHAR(100) NOT NULL,
        modelo VARCHAR(100) NOT NULL,
        serie VARCHAR(100) NOT NULL,
        descripcion TEXT NOT NULL,
        ubicacion_planta VARCHAR(255) NOT NULL,
        identificador_af VARCHAR(255) NOT NULL,
        qr_code_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    
    // Crear tabla de imágenes
    const createImagesTableQuery = `
      CREATE TABLE IF NOT EXISTS ficha_imagenes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ficha_id INT NOT NULL,
        imagen_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ficha_id) REFERENCES fichas_tecnicas(id) ON DELETE CASCADE
      )
    `;
    
    await connection.execute(createImagesTableQuery);
    
    connection.release();
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

module.exports = { pool, initializeDatabase }; 