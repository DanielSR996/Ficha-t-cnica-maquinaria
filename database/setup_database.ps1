# Script de PowerShell para configurar la base de datos
# Ejecutar desde PowerShell: .\database\setup_database.ps1

Write-Host "🗄️  Configurando base de datos para Maquinarias App..." -ForegroundColor Green

# Configuración
$DatabaseName = "maquinarias_db"
$Username = "root"
$ScriptPath = $PSScriptRoot

# Solicitar contraseña de MySQL
$Password = Read-Host -Prompt "Ingresa la contraseña de MySQL para el usuario '$Username'" -AsSecureString
$PasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password))

# Verificar que MySQL esté disponible
try {
    $null = Get-Command mysql -ErrorAction Stop
    Write-Host "✅ MySQL encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ MySQL no está disponible en PATH" -ForegroundColor Red
    Write-Host "Asegúrate de tener MySQL instalado y agregado al PATH" -ForegroundColor Yellow
    exit 1
}

# Ejecutar script de creación de tablas
Write-Host "📝 Creando tablas..." -ForegroundColor Yellow
try {
    if ($PasswordText) {
        mysql -u $Username -p$PasswordText < "$ScriptPath\create_tables.sql"
    } else {
        mysql -u $Username < "$ScriptPath\create_tables.sql"
    }
    Write-Host "✅ Tablas creadas correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al crear tablas: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Preguntar si quiere insertar datos de ejemplo
$InsertSampleData = Read-Host "¿Deseas insertar datos de ejemplo? (y/n)"
if ($InsertSampleData -eq "y" -or $InsertSampleData -eq "Y") {
    Write-Host "📝 Insertando datos de ejemplo..." -ForegroundColor Yellow
    try {
        if ($PasswordText) {
            mysql -u $Username -p$PasswordText < "$ScriptPath\sample_data.sql"
        } else {
            mysql -u $Username < "$ScriptPath\sample_data.sql"
        }
        Write-Host "✅ Datos de ejemplo insertados correctamente" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error al insertar datos de ejemplo: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Verificar la configuración
Write-Host "🔍 Verificando configuración..." -ForegroundColor Yellow
try {
    $Query = "USE $DatabaseName; SHOW TABLES;"
    if ($PasswordText) {
        $Tables = mysql -u $Username -p$PasswordText -e $Query
    } else {
        $Tables = mysql -u $Username -e $Query
    }
    Write-Host "✅ Configuración completada" -ForegroundColor Green
    Write-Host "Tablas disponibles:" -ForegroundColor Cyan
    Write-Host $Tables -ForegroundColor White
} catch {
    Write-Host "❌ Error al verificar configuración: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 ¡Base de datos configurada correctamente!" -ForegroundColor Green
Write-Host "Ya puedes ejecutar la aplicación con: npm run dev" -ForegroundColor Cyan 