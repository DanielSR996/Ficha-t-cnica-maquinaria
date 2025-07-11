# Configuración de Base de Datos

Esta carpeta contiene los scripts necesarios para configurar la base de datos MySQL de la aplicación Maquinarias.

## 📁 Archivos Incluidos

- `create_tables.sql` - Script para crear las tablas necesarias
- `sample_data.sql` - Datos de ejemplo para probar la aplicación
- `setup_database.ps1` - Script automatizado para Windows PowerShell
- `README.md` - Esta documentación

## 🗄️ Estructura de la Base de Datos

### Tabla: `fichas_tecnicas`
Almacena la información principal de cada ficha técnica:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT (PK) | Identificador único |
| `pedimento` | VARCHAR(255) | Número de pedimento |
| `clave_pedimento` | VARCHAR(10) | Clave del pedimento (AF, A1, etc.) |
| `fecha_pago` | DATE | Fecha de pago del pedimento |
| `factura` | VARCHAR(255) | Número de factura |
| `fecha_facturacion` | DATE | Fecha de facturación |
| `valor_usd` | DECIMAL(15,2) | Valor en dólares americanos |
| `valor_aduana` | DECIMAL(15,2) | Valor en aduana |
| `pais_origen` | VARCHAR(100) | País de origen |
| `marca` | VARCHAR(100) | Marca de la maquinaria |
| `modelo` | VARCHAR(100) | Modelo de la maquinaria |
| `serie` | VARCHAR(100) | Número de serie |
| `descripcion` | TEXT | Descripción detallada |
| `ubicacion_planta` | VARCHAR(255) | Ubicación física en planta |
| `identificador_af` | VARCHAR(255) | Identificador AF |
| `qr_code_path` | VARCHAR(255) | Ruta del código QR generado |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

### Tabla: `ficha_imagenes`
Almacena las referencias a las imágenes de cada ficha:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT (PK) | Identificador único |
| `ficha_id` | INT (FK) | Referencia a la ficha técnica |
| `imagen_path` | VARCHAR(255) | Ruta de la imagen |
| `created_at` | TIMESTAMP | Fecha de creación |

## 🚀 Métodos de Configuración

### Opción 1: Script Automatizado (Recomendado)
```powershell
# Ejecutar desde PowerShell en el directorio raíz del proyecto
.\database\setup_database.ps1
```

### Opción 2: Ejecución Manual
```bash
# 1. Crear las tablas
mysql -u root -p maquinarias_db < database/create_tables.sql

# 2. Insertar datos de ejemplo (opcional)
mysql -u root -p maquinarias_db < database/sample_data.sql
```

### Opción 3: MySQL Workbench
1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL
3. Abre el archivo `create_tables.sql`
4. Ejecuta el script
5. Opcionalmente, ejecuta `sample_data.sql`

## 📋 Requisitos Previos

1. **MySQL instalado** y corriendo
2. **Base de datos creada**: `maquinarias_db`
3. **Usuario con permisos** para crear tablas

```sql
-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS maquinarias_db;

-- Crear usuario (opcional)
CREATE USER 'maquinarias_user'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON maquinarias_db.* TO 'maquinarias_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🔍 Verificación

Para verificar que todo está configurado correctamente:

```sql
USE maquinarias_db;
SHOW TABLES;
DESCRIBE fichas_tecnicas;
DESCRIBE ficha_imagenes;
```

Deberías ver:
- Tabla `fichas_tecnicas` con 16 campos
- Tabla `ficha_imagenes` con 4 campos
- Índices creados para optimizar consultas

## 🎯 Datos de Ejemplo

El archivo `sample_data.sql` incluye 3 fichas técnicas de ejemplo:

1. **Caterpillar CAT-320D** (Excavadora de Alemania)
2. **Komatsu PC200-8** (Excavadora de Japón)
3. **John Deere 470G LC** (Excavadora de Estados Unidos)

## 🔧 Troubleshooting

### Error: "Access denied for user"
```bash
# Verificar permisos del usuario
mysql -u root -p
SHOW GRANTS FOR 'tu_usuario'@'localhost';
```

### Error: "Table doesn't exist"
```bash
# Verificar que el script se ejecutó correctamente
mysql -u root -p maquinarias_db -e "SHOW TABLES;"
```

### Error: "Unknown database"
```bash
# Verificar que la base de datos existe
mysql -u root -p -e "SHOW DATABASES;"
```

## 🔄 Reiniciar Base de Datos

Para reiniciar completamente la base de datos:

```sql
DROP DATABASE IF EXISTS maquinarias_db;
CREATE DATABASE maquinarias_db;
USE maquinarias_db;
SOURCE create_tables.sql;
SOURCE sample_data.sql;
```

## 📊 Consultas Útiles

```sql
-- Ver todas las fichas
SELECT * FROM fichas_tecnicas;

-- Contar fichas por marca
SELECT marca, COUNT(*) as total FROM fichas_tecnicas GROUP BY marca;

-- Ver fichas con sus imágenes
SELECT f.*, COUNT(i.id) as num_imagenes 
FROM fichas_tecnicas f 
LEFT JOIN ficha_imagenes i ON f.id = i.ficha_id 
GROUP BY f.id;

-- Estadísticas generales
SELECT 
    COUNT(*) as total_fichas,
    AVG(valor_usd) as promedio_valor,
    COUNT(DISTINCT marca) as marcas_diferentes,
    COUNT(DISTINCT pais_origen) as paises_origen
FROM fichas_tecnicas;
``` 