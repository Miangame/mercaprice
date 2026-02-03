#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/mercaprice/backups/migration"
BACKUP_FILE="$BACKUP_DIR/supabase_full_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Exportando desde Supabase..."

# Obtener DATABASE_URL desde .env
source /home/mercaprice/.env

# Extraer componentes de la URL
DB_URL="$DATABASE_URL"
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

# Export con pg_dump
PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup completado: $BACKUP_FILE"

  # Contar registros para validación
  echo "" > "$BACKUP_DIR/record_counts_${TIMESTAMP}.txt"
  PGPASSWORD="$DB_PASS" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -t -c "
      SELECT 'Product: ' || COUNT(*) FROM \"Product\"
      UNION ALL SELECT 'PriceHistory: ' || COUNT(*) FROM \"PriceHistory\"
      UNION ALL SELECT 'Warehouse: ' || COUNT(*) FROM \"Warehouse\";
    " >> "$BACKUP_DIR/record_counts_${TIMESTAMP}.txt"

  echo "=== Conteos de registros ==="
  cat "$BACKUP_DIR/record_counts_${TIMESTAMP}.txt"

  ls -lh "$BACKUP_FILE"
else
  echo "[$(date)] Error en el backup"
  exit 1
fi
