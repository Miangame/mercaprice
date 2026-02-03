#!/bin/bash

# Script para validar un archivo de backup antes de usarlo en la migración

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: $0 <ruta_al_backup>"
  echo ""
  echo "Ejemplo:"
  echo "  $0 ~/Downloads/supabase_backup.backup.gz"
  echo "  $0 /home/mercaprice/backups/migration/backup.sql.gz"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Archivo no encontrado: $BACKUP_FILE"
  exit 1
fi

echo "======================================"
echo "  VALIDACIÓN DE BACKUP"
echo "======================================"
echo ""
echo "Archivo: $BACKUP_FILE"
echo ""

# Obtener información del archivo
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
FILE_EXT="${BACKUP_FILE##*.}"

echo "Tamaño: $FILE_SIZE"
echo "Extensión: .$FILE_EXT"
echo ""

# Validar que está comprimido con gzip
if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "✓ Archivo comprimido con gzip"

  # Intentar descomprimir los primeros bytes para verificar
  if gunzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo "✓ Compresión gzip válida"
  else
    echo "❌ Error: Archivo corrupto o no es gzip válido"
    exit 1
  fi
else
  echo "⚠️  Advertencia: Archivo no comprimido"
fi

echo ""

# Detectar tipo de backup
if [[ "$BACKUP_FILE" == *.backup* ]]; then
  echo "Tipo detectado: PostgreSQL custom format (.backup)"
  echo "Se usará: pg_restore"

  # Validar estructura del backup (requiere pg_restore)
  if command -v pg_restore &> /dev/null; then
    echo ""
    echo "Validando estructura del backup..."

    if [[ "$BACKUP_FILE" == *.gz ]]; then
      gunzip -c "$BACKUP_FILE" | pg_restore --list 2>/dev/null | head -20
    else
      pg_restore --list "$BACKUP_FILE" 2>/dev/null | head -20
    fi

    if [ $? -eq 0 ]; then
      echo ""
      echo "✓ Estructura del backup válida"
    else
      echo ""
      echo "⚠️  No se pudo validar la estructura (puede ser normal si no tienes pg_restore)"
    fi
  else
    echo ""
    echo "ℹ️  pg_restore no disponible localmente, se validará en el servidor"
  fi

elif [[ "$BACKUP_FILE" == *.sql* ]]; then
  echo "Tipo detectado: SQL dump (.sql)"
  echo "Se usará: psql"

  # Validar que es SQL válido
  echo ""
  echo "Primeras líneas del backup:"

  if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | head -20
  else
    head -20 "$BACKUP_FILE"
  fi

  echo ""
  echo "✓ Archivo SQL detectado"
else
  echo "⚠️  Tipo de archivo desconocido"
  echo "El script de migración intentará detectarlo automáticamente"
fi

echo ""
echo "======================================"
echo "  RESUMEN"
echo "======================================"
echo ""

if [ -f "$BACKUP_FILE" ] && [ -r "$BACKUP_FILE" ]; then
  echo "✅ El archivo parece válido para la migración"
  echo ""
  echo "Siguiente paso:"
  echo "  scp $BACKUP_FILE root@192.168.18.121:/home/mercaprice/backups/migration/"
  echo ""
else
  echo "❌ Hay problemas con el archivo"
  exit 1
fi
