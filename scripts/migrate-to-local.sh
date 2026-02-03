#!/bin/bash

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: $0 <ruta_backup_supabase.sql.gz>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Archivo $BACKUP_FILE no encontrado"
  exit 1
fi

echo "======================================"
echo "  MIGRACIÓN SUPABASE → LOCAL"
echo "======================================"
echo ""
echo "Backup a restaurar: $BACKUP_FILE"
echo ""
read -p "¿Continuar? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Migración cancelada"
  exit 0
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/mercaprice"
MIGRATION_LOG="$APP_DIR/logs/migration_${TIMESTAMP}.log"

mkdir -p "$APP_DIR/logs"
exec > >(tee -a "$MIGRATION_LOG") 2>&1

echo "[$(date)] === PASO 1: Backup del .env actual ==="
cp "$APP_DIR/.env" "$APP_DIR/.env.supabase.backup"

echo ""
echo "[$(date)] === PASO 2: Detener PM2 (si está corriendo) ==="
pm2 stop mercaprice || echo "PM2 no está corriendo"

echo ""
echo "[$(date)] === PASO 3: Verificar PostgreSQL local ==="
docker exec mercaprice-postgres pg_isready -U mercaprice_user -d mercaprice_db
if [ $? -ne 0 ]; then
  echo "Error: PostgreSQL no está disponible"
  exit 1
fi

echo ""
echo "[$(date)] === PASO 4: Limpiar base de datos local ==="
source "$APP_DIR/.env.docker"
PGPASSWORD="$DB_PASSWORD" psql \
  -h localhost \
  -U mercaprice_user \
  -d mercaprice_db \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo ""
echo "[$(date)] === PASO 5: Aplicar schema de Prisma ==="
cd "$APP_DIR"
TEMP_DB_URL="postgresql://mercaprice_user:${DB_PASSWORD}@localhost:5432/mercaprice_db"
export DATABASE_URL="$TEMP_DB_URL"
npx prisma migrate deploy

echo ""
echo "[$(date)] === PASO 5.5: Crear roles de Supabase (para compatibilidad) ==="
# Crear roles dummy de Supabase para evitar errores de permisos
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db <<EOF
DO \$\$
BEGIN
  -- Crear roles si no existen
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_storage_admin') THEN
    CREATE ROLE supabase_storage_admin NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'dashboard_user') THEN
    CREATE ROLE dashboard_user NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres SUPERUSER;
  END IF;

  -- Dar permisos al usuario mercaprice_user sobre estos roles
  GRANT anon TO mercaprice_user;
  GRANT authenticated TO mercaprice_user;
  GRANT service_role TO mercaprice_user;
END
\$\$;
EOF

echo ""
echo "[$(date)] === PASO 6: Importar datos desde backup ==="

# Detectar el tipo de archivo y usar la herramienta correcta
IMPORT_LOG="/tmp/mercaprice_import_$TIMESTAMP.log"

if [[ "$BACKUP_FILE" == *.backup.gz ]] || [[ "$BACKUP_FILE" == *.backup ]]; then
  echo "Detectado formato custom de PostgreSQL (.backup), usando pg_restore..."

  # Si está comprimido, descomprimir primero
  if [[ "$BACKUP_FILE" == *.gz ]]; then
    TEMP_BACKUP="/tmp/mercaprice_backup_temp.backup"
    echo "Descomprimiendo backup..."
    gunzip -c "$BACKUP_FILE" > "$TEMP_BACKUP"

    echo "Iniciando importación (esto puede tomar varios minutos)..."
    PGPASSWORD="$DB_PASSWORD" pg_restore \
      -h localhost \
      -U mercaprice_user \
      -d mercaprice_db \
      --data-only \
      --no-owner \
      --no-privileges \
      --disable-triggers \
      --verbose \
      "$TEMP_BACKUP" 2>&1 | tee "$IMPORT_LOG" | grep -E "(processing|restoring|error)" | grep -v "role.*does not exist" | grep -v "permission denied to set parameter"

    IMPORT_EXIT_CODE=${PIPESTATUS[0]}
    rm -f "$TEMP_BACKUP"
  else
    echo "Iniciando importación (esto puede tomar varios minutos)..."
    PGPASSWORD="$DB_PASSWORD" pg_restore \
      -h localhost \
      -U mercaprice_user \
      -d mercaprice_db \
      --data-only \
      --no-owner \
      --no-privileges \
      --disable-triggers \
      --verbose \
      "$BACKUP_FILE" 2>&1 | tee "$IMPORT_LOG" | grep -E "(processing|restoring|error)" | grep -v "role.*does not exist" | grep -v "permission denied to set parameter"

    IMPORT_EXIT_CODE=${PIPESTATUS[0]}
  fi
else
  echo "Detectado formato SQL (.sql.gz), usando psql..."

  # Filtrar comandos problemáticos de Supabase y ejecutar
  echo "Iniciando importación (esto puede tomar varios minutos)..."
  gunzip -c "$BACKUP_FILE" | \
    grep -v "GRANT.*TO.*anon" | \
    grep -v "GRANT.*TO.*authenticated" | \
    grep -v "GRANT.*TO.*service_role" | \
    grep -v "REVOKE.*FROM.*anon" | \
    grep -v "REVOKE.*FROM.*authenticated" | \
    grep -v "REVOKE.*FROM.*service_role" | \
    grep -v "ALTER.*OWNER TO postgres" | \
    grep -v "CREATE SCHEMA.*auth" | \
    grep -v "CREATE SCHEMA.*storage" | \
    PGPASSWORD="$DB_PASSWORD" psql \
      -h localhost \
      -U mercaprice_user \
      -d mercaprice_db \
      -v ON_ERROR_STOP=0 \
      2>&1 | tee "$IMPORT_LOG" | grep -v "role.*does not exist" | grep -v "permission denied to set parameter"

  IMPORT_EXIT_CODE=${PIPESTATUS[0]}
fi

echo ""
if [ "$IMPORT_EXIT_CODE" -ne 0 ]; then
  echo "⚠️  La importación completó con algunos errores (esto es normal con backups de Supabase)"
  echo "Log completo guardado en: $IMPORT_LOG"
else
  echo "✅ Importación completada"
fi

echo ""
echo "[$(date)] === PASO 7: Actualizar .env con DATABASE_URL local ==="
grep -v "^DATABASE_URL=" "$APP_DIR/.env" > "$APP_DIR/.env.tmp" || true
echo "DATABASE_URL=\"postgresql://mercaprice_user:${DB_PASSWORD}@localhost:5432/mercaprice_db\"" >> "$APP_DIR/.env.tmp"
mv "$APP_DIR/.env.tmp" "$APP_DIR/.env"

echo ""
echo "[$(date)] === PASO 8: Regenerar Prisma Client ==="
npx prisma generate

echo ""
echo "[$(date)] === PASO 9: Validar migración ==="

# Contar registros
PRODUCT_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -t -c "SELECT COUNT(*) FROM \"Product\"" | tr -d ' ')
PRICE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -t -c "SELECT COUNT(*) FROM \"PriceHistory\"" | tr -d ' ')
WAREHOUSE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -t -c "SELECT COUNT(*) FROM \"Warehouse\"" | tr -d ' ')

echo "Conteos de registros:"
echo "  Product: $PRODUCT_COUNT"
echo "  PriceHistory: $PRICE_COUNT"
echo "  Warehouse: $WAREHOUSE_COUNT"
echo ""

if [ "$PRODUCT_COUNT" -eq 0 ]; then
  echo "⚠️  ADVERTENCIA: No se importaron productos"
  echo "⚠️  Por favor ejecuta el script de diagnóstico:"
  echo "    ./scripts/diagnose-import.sh"
  echo ""
  echo "Log de importación guardado en: $IMPORT_LOG"
else
  echo "✅ Se importaron $PRODUCT_COUNT productos"

  echo ""
  echo "Probando Full-Text Search..."
  PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -c "
SELECT \"displayName\"
FROM \"Product\"
WHERE searchvector @@ to_tsquery('spanish', 'leche')
LIMIT 3;
" 2>&1 || echo "⚠️  Full-Text Search no disponible aún (se puede regenerar después)"
fi

echo ""
echo "[$(date)] === PASO 10: Reiniciar aplicación con PM2 ==="
pm2 restart mercaprice || pm2 start ecosystem.config.js

echo ""
echo "[$(date)] === PASO 11: Verificar estado ==="
sleep 3
pm2 status
pm2 logs mercaprice --lines 20

echo ""
echo "================================================================"
echo "  ✅ MIGRACIÓN COMPLETADA"
echo "================================================================"
echo ""
echo "Logs: $MIGRATION_LOG"
echo "Web: http://192.168.18.121:3000"
echo "pgAdmin: http://192.168.18.121:5050"
