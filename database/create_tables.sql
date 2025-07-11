-- Script para crear las tablas de la aplicación de Maquinarias
-- Ejecutar después de crear la base de datos maquinarias_db

USE maquinarias_db;

-- Crear tabla de fichas técnicas
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
);

-- Crear tabla de imágenes de fichas
CREATE TABLE IF NOT EXISTS ficha_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ficha_id INT NOT NULL,
    imagen_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ficha_id) REFERENCES fichas_tecnicas(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_fichas_pedimento ON fichas_tecnicas(pedimento);
CREATE INDEX idx_fichas_clave_pedimento ON fichas_tecnicas(clave_pedimento);
CREATE INDEX idx_fichas_marca_modelo ON fichas_tecnicas(marca, modelo);
CREATE INDEX idx_fichas_created_at ON fichas_tecnicas(created_at);
CREATE INDEX idx_imagenes_ficha_id ON ficha_imagenes(ficha_id);

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar la estructura de las tablas
DESCRIBE fichas_tecnicas;
DESCRIBE ficha_imagenes; 