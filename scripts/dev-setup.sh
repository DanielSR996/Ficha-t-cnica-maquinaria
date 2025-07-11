#!/bin/bash

# Script de configuración rápida para desarrollo local
# Ejecutar con: bash scripts/dev-setup.sh

echo "🚀 Configurando entorno de desarrollo para Maquinarias App..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

# Verificar que MySQL esté instalado y corriendo
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Node.js y MySQL detectados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ -d "backend" ]; then
    cd backend
    npm install
    cd ..
fi

if [ -d "frontend" ]; then
    cd frontend
    npm install
    cd ..
fi

echo "✅ Dependencias instaladas"

# Crear archivo .env para backend si no existe
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creando archivo de configuración..."
    cat > backend/.env << EOF
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=maquinarias_db
DB_PORT=3306

# URL base para QR codes
BASE_URL=http://localhost:3000

# Configuración de CORS
CORS_ORIGIN=http://localhost:3000
EOF
    echo "✅ Archivo .env creado en backend/"
    echo "📝 Por favor, edita backend/.env con tus credenciales de MySQL"
else
    echo "⚙️  Archivo .env ya existe"
fi

# Crear base de datos (requiere que MySQL esté corriendo)
echo "🗄️  Configurando base de datos..."
echo "Por favor, ingresa tu contraseña de MySQL root:"

mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS maquinarias_db;
SHOW DATABASES;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Base de datos configurada"
else
    echo "⚠️  Error al configurar la base de datos. Configúrala manualmente."
fi

# Crear carpetas necesarias
echo "📁 Creando carpetas necesarias..."
mkdir -p backend/uploads/imgs
mkdir -p backend/uploads/qrs
mkdir -p logs

echo "✅ Carpetas creadas"

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "Para iniciar el desarrollo:"
echo "  npm run dev           # Iniciar backend y frontend"
echo "  npm run server        # Solo backend (puerto 5000)"
echo "  npm run client        # Solo frontend (puerto 3000)"
echo ""
echo "URLs de desarrollo:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000/api"
echo "  Health check: http://localhost:5000/api/health"
echo ""
echo "📝 No olvides configurar tus credenciales de MySQL en backend/.env" 