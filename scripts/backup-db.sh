#!/bin/bash

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/mercaprice/backups/daily"
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Iniciando backup..."

source /home/mercaprice/.env.docker

PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h localhost \
  -U mercaprice_user \
  -d mercaprice_db \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup completado: $BACKUP_FILE"

  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Tamaño: $SIZE"

  # Retención: 30 días
  find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +30 -delete

  BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | wc -l)
  echo "Backups totales: $BACKUP_COUNT"
else
  echo "[$(date)] Error en el backup"
  exit 1
fi
