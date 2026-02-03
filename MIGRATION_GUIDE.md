# Guía de Migración: Supabase → PostgreSQL Local (Proxmox LXC)

## Resumen Ejecutivo

Migración de la base de datos de **mercaprice** desde Supabase a PostgreSQL local en un contenedor LXC de Proxmox (IP: 192.168.18.121).

**Arquitectura Final**:
- PostgreSQL 16 en Docker (puerto 5432)
- pgAdmin en Docker (puerto 5050)
- Next.js app con PM2 (puerto 3000)
- Scripts de mantenimiento automatizados con cron

**Tiempo estimado**: 40-50 minutos | **Downtime**: 15-20 minutos | **Rollback**: <2 minutos

---

## 📋 Checklist Rápido

### Pre-Migración
- [ ] LXC creado en Proxmox (IP: 192.168.18.121)
- [ ] Código commiteado y pusheado
- [ ] Archivo `.env` con DATABASE_URL de Supabase listo

### Instalación
- [ ] Conectar al LXC: `ssh root@192.168.18.121`
- [ ] Instalar Node.js 20, Docker, PostgreSQL client, PM2, Git
- [ ] Crear directorios en `/home/mercaprice`
- [ ] Clonar repositorio y hacer `npm install && npm run build`
- [ ] Transferir `.env` al servidor

### Migración
- [ ] Generar passwords y guardarlas en `.env.docker`
- [ ] Hacer scripts ejecutables: `chmod +x scripts/*.sh`
- [ ] Iniciar Docker: `docker-compose --env-file .env.docker up -d`
- [ ] Backup de Supabase: `./scripts/export-from-supabase.sh`
- [ ] Ejecutar migración: `./scripts/migrate-to-local.sh backups/migration/supabase_full_XXX.sql.gz`

### Validación
- [ ] Verificar servicios: `docker ps` y `pm2 status`
- [ ] Test API: `curl http://localhost:3000/api/search?query=leche`
- [ ] Verificar Full-Text Search en BD
- [ ] Acceder vía navegador a app y pgAdmin

### Automatización
- [ ] Test backup: `./scripts/backup-db.sh`
- [ ] Configurar cron: `crontab -e` (agregar 3 líneas)
- [ ] PM2 auto-start: `pm2 startup && pm2 save`
- [ ] Reiniciar y verificar: `reboot`

---

## 🚀 PASO A PASO DETALLADO

### 1. Preparación del LXC (15 min)

#### Crear Contenedor en Proxmox
- Template: Debian 12 o Ubuntu 22.04
- IP fija: 192.168.18.121
- RAM: 2GB | Disco: 20GB | Cores: 2

#### Conectar e Instalar Dependencias

```bash
ssh root@192.168.18.121

# Actualizar sistema
apt-get update && apt-get upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Instalar herramientas
apt-get install -y postgresql-client git
npm install -g pm2

# Verificar instalaciones
node --version && npm --version && docker --version && pg_dump --version && pm2 --version
```

#### Crear Directorios

```bash
mkdir -p /home/mercaprice/{backups/{migration,daily,weekly,monthly},logs,scripts,postgres-data,pgadmin-data}
```

---

### 2. Transferir Código (5 min)

```bash
# Opción A: Clonar desde GitHub
cd /home/mercaprice
git clone https://github.com/TU_USUARIO/mercaprice.git .

# Opción B: Transferir desde local (ejecutar en tu máquina)
# scp -r . root@192.168.18.121:/home/mercaprice/

# Instalar y construir
npm install
npm run build
```

**Transferir .env desde tu máquina local**:

```bash
scp .env root@192.168.18.121:/home/mercaprice/
```

---

### 3. Configurar Docker (5 min)

```bash
cd /home/mercaprice

# Generar passwords seguras
DB_PASSWORD=$(openssl rand -base64 32)
PGADMIN_PASSWORD=$(openssl rand -base64 20)

cat > .env.docker <<EOF
DB_PASSWORD=$DB_PASSWORD
PGADMIN_PASSWORD=$PGADMIN_PASSWORD
EOF

chmod 600 .env.docker

# ⚠️ IMPORTANTE: Guardar estas passwords
cat .env.docker

# Hacer scripts ejecutables
chmod +x scripts/*.sh

# Iniciar PostgreSQL y pgAdmin
docker-compose --env-file .env.docker up -d postgres pgadmin

# Esperar y verificar
sleep 10
docker exec mercaprice-postgres pg_isready -U mercaprice_user -d mercaprice_db
# Debe decir: "accepting connections"
```

---

### 4. Backup de Supabase (5 min)

```bash
cd /home/mercaprice
./scripts/export-from-supabase.sh

# Ver archivo generado
ls -lh backups/migration/
# Anotar el nombre: supabase_full_XXXXXXXXX_XXXXXX.sql.gz
```

---

### 5. Ejecutar Migración (10-15 min)

⚠️ **A PARTIR DE AQUÍ HAY DOWNTIME**

```bash
# Reemplazar XXXXX con el nombre real del archivo
./scripts/migrate-to-local.sh backups/migration/supabase_full_XXXXXXXXX_XXXXXX.sql.gz

# Escribir 'yes' cuando pregunte
```

El script ejecutará 11 pasos automáticamente:
1. Backup del .env actual
2. Detener PM2
3. Verificar PostgreSQL local
4. Limpiar base de datos local
5. Aplicar schema de Prisma
6. Importar datos desde backup
7. Actualizar .env con DATABASE_URL local
8. Regenerar Prisma Client
9. Validar migración (conteos + FTS)
10. Reiniciar aplicación con PM2
11. Verificar estado

Debe terminar con: **"✅ MIGRACIÓN COMPLETADA"**

---

### 6. Validación (10 min)

```bash
# Verificar servicios
docker ps                # Deben haber 2 contenedores
pm2 status               # Debe estar "online"
pm2 logs mercaprice --lines 30

# Test de API
curl http://localhost:3000/api/search?query=leche
curl http://localhost:3000/api/randomProducts

# Test de Full-Text Search en BD
source .env.docker
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -c "
SELECT displayName
FROM \"Product\"
WHERE searchvector @@ to_tsquery('spanish', 'aceite')
LIMIT 5;
"
```

**Verificar desde el navegador**:
- App: `http://192.168.18.121:3000`
- pgAdmin: `http://192.168.18.121:5050` (login: `admin@mercaprice.local` / password de `.env.docker`)

---

### 7. Automatización (5 min)

```bash
# Test de backup manual
cd /home/mercaprice
./scripts/backup-db.sh

# Configurar cron
crontab -e
```

**Agregar estas líneas**:

```cron
# Mercaprice - Backups y mantenimiento
0 2 * * * /home/mercaprice/scripts/wrapper-load-data.sh
0 3 * * 0 /home/mercaprice/scripts/wrapper-mark-deleted.sh
0 4 * * * /home/mercaprice/scripts/backup-db.sh
```

**Horarios**:
- 02:00 - Carga diaria de productos
- 03:00 - Marcar eliminados (solo domingos)
- 04:00 - Backup diario

```bash
# Verificar cron
crontab -l

# Configurar PM2 auto-start
pm2 startup
# Ejecutar el comando que muestre
pm2 save
```

---

### 8. Verificación Final (5 min)

```bash
# Reiniciar el LXC
reboot

# Esperar 1 minuto y reconectar
ssh root@192.168.18.121

# Verificar que todo arrancó
docker ps
pm2 status
curl http://localhost:3000/api/randomProducts
```

---

## 🎉 Migración Completada

### URLs de Acceso
- **App**: http://192.168.18.121:3000
- **pgAdmin**: http://192.168.18.121:5050

### Credenciales PostgreSQL
- Host: `localhost` (o `192.168.18.121` desde fuera)
- Port: `5432`
- User: `mercaprice_user`
- Database: `mercaprice_db`
- Password: Ver `.env.docker`

---

## 🔧 Comandos Útiles

### PM2

```bash
pm2 status                      # Ver estado
pm2 logs mercaprice             # Ver logs en tiempo real
pm2 logs mercaprice --lines 50  # Ver últimas 50 líneas
pm2 restart mercaprice          # Reiniciar
pm2 stop mercaprice             # Detener
```

### Docker

```bash
docker ps                                    # Ver contenedores
docker logs mercaprice-postgres              # Ver logs PostgreSQL
docker-compose --env-file .env.docker restart postgres  # Reiniciar PostgreSQL
```

### PostgreSQL

```bash
# Conectar a la BD
source /home/mercaprice/.env.docker
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db

# Queries útiles
SELECT COUNT(*) FROM "Product" WHERE "deletedAt" IS NULL;  # Contar productos activos
SELECT COUNT(*) FROM "PriceHistory";                       # Contar registros de precios
```

### Backups

```bash
# Crear backup manual
/home/mercaprice/scripts/backup-db.sh

# Ver backups disponibles
ls -lh /home/mercaprice/backups/daily/
```

### Scripts de Mantenimiento

```bash
# Ejecutar carga manual de productos
/home/mercaprice/scripts/wrapper-load-data.sh

# Ver log de última ejecución
ls -lt /home/mercaprice/logs/load-data-*.log | head -1 | xargs cat

# Ver logs de cron
tail -f /var/log/syslog | grep CRON
```

### Actualización de Código

```bash
cd /home/mercaprice
pm2 stop mercaprice
git pull origin main
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart mercaprice
```

---

## 🆘 Troubleshooting

### PostgreSQL No Responde

```bash
docker logs mercaprice-postgres --tail 50
docker-compose --env-file .env.docker restart postgres
sleep 10
docker exec mercaprice-postgres pg_isready -U mercaprice_user -d mercaprice_db
```

### PM2 No Está Online

```bash
pm2 logs mercaprice --lines 50
pm2 restart mercaprice

# Si falla, reiniciar de cero
pm2 delete mercaprice
pm2 start ecosystem.config.js
```

### Error de Conexión a BD

```bash
# Verificar DATABASE_URL
cat /home/mercaprice/.env | grep DATABASE_URL

# Si es incorrecta, regenerar
source /home/mercaprice/.env.docker
sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://mercaprice_user:${DB_PASSWORD}@localhost:5432/mercaprice_db\"|" /home/mercaprice/.env

npx prisma generate
pm2 restart mercaprice
```

### Full-Text Search No Funciona

```bash
# Regenerar índices de búsqueda
source /home/mercaprice/.env.docker
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -c "
UPDATE \"Product\"
SET searchvector = to_tsvector('spanish', displayName);
"
```

### Scripts de Cron No Ejecutan

```bash
# Ver logs del sistema
tail -f /var/log/syslog | grep CRON

# Verificar permisos
ls -la /home/mercaprice/scripts/
chmod +x /home/mercaprice/scripts/*.sh

# Ejecutar manualmente para ver errores
/home/mercaprice/scripts/wrapper-load-data.sh
```

---

## 🔄 Rollback a Supabase

Si algo sale mal y necesitas volver a Supabase:

```bash
cd /home/mercaprice
./scripts/rollback-to-supabase.sh

# Escribir 'yes' cuando pregunte
```

**Tiempo de rollback: <2 minutos**

El script:
1. Detiene PM2
2. Restaura el `.env` con DATABASE_URL de Supabase
3. Regenera Prisma Client
4. Reinicia la aplicación

---

## 📊 Archivos Creados

### Configuración
- `docker-compose.yml` - Infraestructura Docker
- `ecosystem.config.js` - Configuración PM2
- `.env.docker` - Passwords de Docker

### Scripts
- `scripts/init-db.sql` - Inicialización PostgreSQL
- `scripts/export-from-supabase.sh` - Exportar desde Supabase
- `scripts/migrate-to-local.sh` - Script principal de migración
- `scripts/rollback-to-supabase.sh` - Rollback de emergencia
- `scripts/backup-db.sh` - Backup automático
- `scripts/wrapper-load-data.sh` - Wrapper para cron (carga productos)
- `scripts/wrapper-mark-deleted.sh` - Wrapper para cron (marcar eliminados)

### Modificaciones en Código
- `src/scripts/loadDataFromSitemap.js` - Soporte modo HEADLESS
- `src/scripts/markProductsAsDeleted.js` - Soporte modo HEADLESS

Ambos scripts ahora:
- Detectan `HEADLESS=true` en variables de entorno
- Solo inician Socket.io si NO están en modo headless
- Ejecutan `process.exit(0)` al finalizar (para cron)

---

## 🎯 Ventajas de la Nueva Arquitectura

- **Rendimiento**: Latencia <5ms (vs ~80-150ms con Supabase)
- **Costos**: $0 (vs ~$25/mes)
- **Control**: Total sobre la base de datos
- **Backups**: Automáticos con retención de 30 días
- **Sin límites**: No hay throttling ni límites de conexión

---

## 📝 Notas Finales

- Después de la migración, monitorea los logs durante 24-48 horas
- Verifica que los cron jobs ejecuten correctamente al día siguiente
- Configura Cloudflared para acceso externo si lo necesitas
- Guarda las contraseñas de `.env.docker` en un gestor seguro

**¡Buena suerte con la migración! 🚀**
