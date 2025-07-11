-- Script con datos de ejemplo para probar la aplicación
-- Ejecutar después de crear las tablas

USE maquinarias_db;

-- Insertar fichas técnicas de ejemplo
INSERT INTO fichas_tecnicas (
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
) VALUES 
(
    'PED-001-2024', 
    'AF', 
    '2024-01-15', 
    'FAC-001-2024', 
    '2024-01-10', 
    125000.00, 
    128000.00, 
    'Alemania', 
    'Caterpillar', 
    'CAT-320D', 
    'CAT320D12345', 
    'Excavadora hidráulica CAT 320D con sistema de control avanzado, motor diésel Caterpillar C6.6, capacidad de balde 1.2 m³, peso operativo 20.5 toneladas', 
    'Almacén A - Sector 1', 
    'AF-CAT-001'
),
(
    'PED-002-2024', 
    'A1', 
    '2024-02-20', 
    'FAC-002-2024', 
    '2024-02-15', 
    89000.00, 
    91500.00, 
    'Japón', 
    'Komatsu', 
    'PC200-8', 
    'KOM200812345', 
    'Excavadora Komatsu PC200-8 con tecnología HydrauMind, motor ecológico Komatsu SAA4D107E-1, sistema de monitoreo KOMTRAX', 
    'Almacén B - Sector 2', 
    'A1-KOM-002'
),
(
    'PED-003-2024', 
    'AF', 
    '2024-03-10', 
    'FAC-003-2024', 
    '2024-03-05', 
    95000.00, 
    97200.00, 
    'Estados Unidos', 
    'John Deere', 
    '470G LC', 
    'JD470G78901', 
    'Excavadora John Deere 470G LC con brazo largo, motor PowerTech Plus, sistema hidráulico de carga sensible, cabina ROPS/FOPS', 
    'Almacén C - Sector 3', 
    'AF-JD-003'
);

-- Verificar los datos insertados
SELECT * FROM fichas_tecnicas;

-- Mostrar estadísticas
SELECT 
    COUNT(*) as total_fichas,
    AVG(valor_usd) as promedio_valor_usd,
    MIN(valor_usd) as valor_minimo,
    MAX(valor_usd) as valor_maximo,
    COUNT(DISTINCT pais_origen) as paises_origen,
    COUNT(DISTINCT marca) as marcas_diferentes
FROM fichas_tecnicas; 