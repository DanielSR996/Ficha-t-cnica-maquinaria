# Sistema de Gestión de Fichas Técnicas de Maquinaria

Una aplicación web completa para gestionar fichas técnicas de maquinaria importada con React en el frontend y Node.js + Express + MySQL en el backend.

## 🚀 Características

- **Formulario completo** con todos los campos requeridos para maquinaria importada
- **Subida de imágenes** (mínimo 1 por ficha)
- **Generación automática de QR** que redirige a la ficha pública
- **Fichas técnicas públicas** accesibles via QR o enlace directo
- **Interfaz moderna** con Tailwind CSS
- **API REST** completa con endpoints para crear y consultar fichas

## 📋 Requisitos

### Locales
- Node.js 16 o superior
- MySQL 5.7 o superior
- NPM o Yarn

### VPS (Hostinger)
- Ubuntu 20.04 o superior
- Acceso root o sudo
- Dominio configurado (opcional)

## 🛠️ Instalación Local

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd maquinarias-app
```

### 2. Instalar dependencias
```bash
npm run install-all
```

### 3. Configurar base de datos
```sql
-- Crear base de datos MySQL
CREATE DATABASE maquinarias_db;
CREATE USER 'maquinarias_user'@'localhost' IDENTIFIED BY 'tu_password_segura';
GRANT ALL PRIVILEGES ON maquinarias_db.* TO 'maquinarias_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend/`:
```bash
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=maquinarias_user
DB_PASSWORD=tu_password_segura
DB_NAME=maquinarias_db
DB_PORT=3306

# URL base para QR codes
BASE_URL=http://localhost:3000

# Configuración de CORS
CORS_ORIGIN=http://localhost:3000
```

### 5. Ejecutar en desarrollo
```bash
# Ejecutar backend y frontend simultáneamente
npm run dev

# O por separado:
npm run server  # Backend en puerto 5000
npm run client  # Frontend en puerto 3000
```

## 🌐 Despliegue en VPS (Hostinger)

### 1. Preparar el VPS

#### Conectar al VPS
```bash
ssh root@tu-ip-vps
```

#### Actualizar el sistema
```bash
apt update && apt upgrade -y
```

#### Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

#### Instalar MySQL
```bash
apt install mysql-server -y
mysql_secure_installation
```

#### Instalar PM2 (gestor de procesos)
```bash
npm install -g pm2
```

#### Instalar Nginx
```bash
apt install nginx -y
```

### 2. Configurar la base de datos

```bash
# Acceder a MySQL
mysql -u root -p

# Crear base de datos y usuario
CREATE DATABASE maquinarias_db;
CREATE USER 'maquinarias_user'@'localhost' IDENTIFIED BY 'password_super_segura';
GRANT ALL PRIVILEGES ON maquinarias_db.* TO 'maquinarias_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Subir y configurar la aplicación

#### Subir archivos al VPS
```bash
# Opción 1: Usando Git
git clone <tu-repositorio> /var/www/maquinarias
cd /var/www/maquinarias

# Opción 2: Usando SCP desde tu máquina local
scp -r . root@tu-ip-vps:/var/www/maquinarias
```

#### Configurar permisos
```bash
chown -R www-data:www-data /var/www/maquinarias
chmod -R 755 /var/www/maquinarias
```

#### Instalar dependencias
```bash
cd /var/www/maquinarias
npm install
cd backend && npm install
cd ../frontend && npm install
```

#### Crear archivo de configuración de producción
```bash
cd /var/www/maquinarias/backend
nano .env
```

Contenido del archivo `.env`:
```bash
# Configuración del servidor
PORT=5000
NODE_ENV=production

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=maquinarias_user
DB_PASSWORD=password_super_segura
DB_NAME=maquinarias_db
DB_PORT=3306

# URL base para QR codes (usa tu dominio)
BASE_URL=https://tu-dominio.com

# Configuración de CORS
CORS_ORIGIN=https://tu-dominio.com
```

#### Construir el frontend
```bash
cd /var/www/maquinarias/frontend
npm run build
```

### 4. Configurar PM2 para el backend

```bash
cd /var/www/maquinarias/backend

# Iniciar la aplicación con PM2
pm2 start server.js --name "maquinarias-backend"

# Configurar PM2 para iniciar automáticamente
pm2 startup
pm2 save
```

### 5. Configurar Nginx

#### Crear configuración de sitio
```bash
nano /etc/nginx/sites-available/maquinarias
```

Contenido del archivo:
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Servir archivos estáticos del frontend
    root /var/www/maquinarias/frontend/build;
    index index.html index.htm;
    
    # Configurar archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para API del backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Servir archivos de uploads
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Configurar headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Configurar cache para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Activar el sitio
```bash
ln -s /etc/nginx/sites-available/maquinarias /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### 6. Configurar SSL con Let's Encrypt (Opcional pero recomendado)

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Configurar renovación automática
crontab -e
# Agregar esta línea:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Configurar firewall

```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable
```

### 8. Monitoreo y mantenimiento

#### Verificar estado de la aplicación
```bash
pm2 status
pm2 logs maquinarias-backend
```

#### Comandos útiles
```bash
# Reiniciar la aplicación
pm2 restart maquinarias-backend

# Ver logs en tiempo real
pm2 logs maquinarias-backend --lines 50

# Monitorear recursos
pm2 monit

# Backup de base de datos
mysqldump -u maquinarias_user -p maquinarias_db > backup_$(date +%Y%m%d).sql
```

## 📝 Uso de la Aplicación

### Crear una nueva ficha técnica
1. Accede a `/crear` en tu aplicación
2. Completa todos los campos requeridos
3. Sube al menos 4 imágenes
4. Haz clic en "Crear Ficha Técnica"
5. El sistema generará automáticamente un QR code

### Ver fichas técnicas
1. Accede a `/fichas` para ver todas las fichas
2. Haz clic en "Ver Detalles" para ver una ficha específica
3. Escanea el QR code para acceso directo

### Campos requeridos
- **Pedimento**: Número del pedimento
- **Clave de pedimento**: AF, A1, A2, etc.
- **Fecha de pago**: Fecha de pago del pedimento
- **Factura**: Número de factura
- **Fecha de facturación**: Fecha de la factura
- **Valor USD**: Valor en dólares americanos
- **Valor aduana**: Valor en aduana
- **País de origen**: País de procedencia
- **Marca**: Marca de la maquinaria
- **Modelo**: Modelo de la maquinaria
- **Serie**: Número de serie
- **Descripción**: Descripción detallada
- **Ubicación en planta**: Ubicación física
- **Identificador AF**: Identificador único AF
- **Imágenes**: Mínimo 1 imagen

## 🔧 API Endpoints

### POST /api/fichas
Crear nueva ficha técnica
```javascript
// Usar FormData para subir archivos
const formData = new FormData();
formData.append('pedimento', 'PED-001');
formData.append('clave_pedimento', 'AF');
// ... otros campos
formData.append('imagenes', file1);
formData.append('imagenes', file2);
```

### GET /api/fichas/:id
Obtener ficha técnica por ID
```javascript
const response = await fetch('/api/fichas/1');
const data = await response.json();
```

### GET /api/fichas
Obtener todas las fichas con paginación
```javascript
const response = await fetch('/api/fichas?page=1&limit=10');
const data = await response.json();
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que MySQL esté corriendo
systemctl status mysql

# Verificar permisos del usuario
mysql -u maquinarias_user -p
```

### Error de permisos en uploads
```bash
# Asegurar permisos correctos
chown -R www-data:www-data /var/www/maquinarias/backend/uploads
chmod -R 755 /var/www/maquinarias/backend/uploads
```

### Error de memoria en el servidor
```bash
# Verificar memoria disponible
free -h

# Configurar swap si es necesario
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📧 Soporte

Para soporte técnico o preguntas, contacta a [tu-email@ejemplo.com] #   F i c h a - t - c n i c a - m a q u i n a r i a  
 