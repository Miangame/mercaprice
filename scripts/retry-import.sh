#!/bin/bash

# Script para reintentar la importación de datos desde un backup de Supabase
# Útil cuando la primera importación falló o no importó datos

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  # Buscar el backup más reciente
  BACKUP_FILE=$(ls -t /home/mercaprice/backups/migration/*.backup.gz /home/mercaprice/backups/migration/*.sql.gz 2>/dev/null | head -1)

  if [ -z "$BACKUP_FILE" ]; then
    echo "❌ No se encontró archivo de backup"
    echo "Uso: $0 <ruta_backup>"
    exit 1
  fi

  echo "Usando backup más reciente: $BACKUP_FILE"
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Archivo no encontrado: $BACKUP_FILE"
  exit 1
fi

echo "======================================"
echo "  REINTENTO DE IMPORTACIÓN"
echo "======================================"
echo ""
echo "Backup: $BACKUP_FILE"
echo ""
read -p "¿Continuar? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Operación cancelada"
  exit 0
fi

# Cargar variables
source /home/mercaprice/.env.docker

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/home/mercaprice/logs/import_retry_${TIMESTAMP}.log"
mkdir -p /home/mercaprice/logs

exec > >(tee -a "$LOG_FILE") 2>&1

echo "[$(date)] === Iniciando reintento de importación ==="
echo ""

# Verificar conexión
echo "Verificando conexión a PostgreSQL..."
docker exec mercaprice-postgres pg_isready -U mercaprice_user -d mercaprice_db
if [ $? -ne 0 ]; then
  echo "❌ Error: PostgreSQL no está disponible"
  exit 1
fi

echo ""
echo "Importando datos..."
echo ""

# Detectar tipo de archivo
if [[ "$BACKUP_FILE" == *.backup.gz ]] || [[ "$BACKUP_FILE" == *.backup ]]; then
  echo "Tipo: PostgreSQL custom format (.backup)"

  if [[ "$BACKUP_FILE" == *.gz ]]; then
    TEMP_BACKUP="/tmp/mercaprice_backup_retry.backup"
    gunzip -c "$BACKUP_FILE" > "$TEMP_BACKUP"

    PGPASSWORD="$DB_PASSWORD" pg_restore \
      -h localhost \
      -U mercaprice_user \
      -d mercaprice_db \
      --data-only \
      --no-owner \
      --no-privileges \
      --disable-triggers \
      --verbose \
      "$TEMP_BACKUP" 2>&1

    rm -f "$TEMP_BACKUP"
  else
    PGPASSWORD="$DB_PASSWORD" pg_restore \
      -h localhost \
      -U mercaprice_user \
      -d mercaprice_db \
      --data-only \
      --no-owner \
      --no-privileges \
      --disable-triggers \
      --verbose \
      "$BACKUP_FILE" 2>&1
  fi

elif [[ "$BACKUP_FILE" == *.sql.gz ]] || [[ "$BACKUP_FILE" == *.sql ]]; then
  echo "Tipo: SQL dump"

  if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | \
      PGPASSWORD="$DB_PASSWORD" psql \
        -h localhost \
        -U mercaprice_user \
        -d mercaprice_db \
        -v ON_ERROR_STOP=0 \
        2>&1
  else
    PGPASSWORD="$DB_PASSWORD" psql \
      -h localhost \
      -U mercaprice_user \
      -d mercaprice_db \
      -v ON_ERROR_STOP=0 \
      -f "$BACKUP_FILE" 2>&1
  fi
fi

echo ""
echo "======================================"
echo "  VALIDACIÓN"
echo "======================================"
echo ""

# Contar registros
PRODUCT_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -t -c "SELECT COUNT(*) FROM \"Product\"" | tr -d ' ')
PRICE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -t -c "SELECT COUNT(*) FROM \"PriceHistory\"" | tr -d ' ')
WAREHOUSE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -t -c "SELECT COUNT(*) FROM \"Warehouse\"" | tr -d ' ')

echo "Conteos de registros:"
echo "  Product: $PRODUCT_COUNT"
echo "  PriceHistory: $PRICE_COUNT"
echo "  Warehouse: $WAREHOUSE_COUNT"
echo ""

if [ "$PRODUCT_COUNT" -gt 0 ]; then
  echo "✅ Importación exitosa"

  # Regenerar searchvector si hace falta
  echo ""
  echo "Regenerando índices de Full-Text Search..."
  PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -c "
UPDATE \"Product\"
SET searchvector = to_tsvector('spanish', \"displayName\")
WHERE searchvector IS NULL OR searchvector = '';
"

  echo ""
  echo "Reiniciando aplicación..."
  pm2 restart mercaprice

  echo ""
  echo "======================================"
  echo "  ✅ COMPLETADO"
  echo "======================================"
  echo ""
  echo "Log guardado en: $LOG_FILE"
else
  echo "❌ La importación no funcionó"
  echo ""
  echo "Posibles causas:"
  echo "  1. El backup está corrupto"
  echo "  2. El backup no contiene datos de esas tablas"
  echo "  3. Hay un problema con el formato del backup"
  echo ""
  echo "Ejecuta el script de diagnóstico para más información:"
  echo "  ./scripts/diagnose-import.sh"
  echo ""
  echo "Log guardado en: $LOG_FILE"
  exit 1
fi
