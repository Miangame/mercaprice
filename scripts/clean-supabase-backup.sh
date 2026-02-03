#!/bin/bash

# Script para limpiar un backup de Supabase eliminando roles y comandos problemáticos

BACKUP_FILE="$1"
OUTPUT_FILE="$2"

if [ -z "$BACKUP_FILE" ] || [ -z "$OUTPUT_FILE" ]; then
  echo "Uso: $0 <backup_original> <backup_limpio>"
  echo ""
  echo "Ejemplo:"
  echo "  $0 supabase_backup.sql.gz supabase_backup_clean.sql.gz"
  echo ""
  echo "Este script limpia el backup de Supabase eliminando:"
  echo "  - Comandos GRANT/REVOKE para roles de Supabase"
  echo "  - Referencias a roles: anon, authenticated, service_role"
  echo "  - Comandos ALTER OWNER TO postgres"
  echo "  - Otros comandos problemáticos"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Archivo no encontrado: $BACKUP_FILE"
  exit 1
fi

echo "======================================"
echo "  LIMPIEZA DE BACKUP DE SUPABASE"
echo "======================================"
echo ""
echo "Entrada:  $BACKUP_FILE"
echo "Salida:   $OUTPUT_FILE"
echo ""

# Detectar si está comprimido
if [[ "$BACKUP_FILE" == *.gz ]]; then
  IS_COMPRESSED=true
  echo "✓ Detectado archivo comprimido (.gz)"
else
  IS_COMPRESSED=false
  echo "✓ Detectado archivo sin comprimir"
fi

echo ""
echo "Limpiando backup..."

# Función para limpiar el SQL
clean_sql() {
  grep -v "GRANT.*TO.*anon" | \
  grep -v "GRANT.*TO.*authenticated" | \
  grep -v "GRANT.*TO.*service_role" | \
  grep -v "GRANT.*TO.*supabase_auth_admin" | \
  grep -v "GRANT.*TO.*supabase_storage_admin" | \
  grep -v "GRANT.*TO.*dashboard_user" | \
  grep -v "REVOKE.*FROM.*anon" | \
  grep -v "REVOKE.*FROM.*authenticated" | \
  grep -v "REVOKE.*FROM.*service_role" | \
  grep -v "ALTER.*OWNER TO postgres" | \
  grep -v "CREATE ROLE anon" | \
  grep -v "CREATE ROLE authenticated" | \
  grep -v "CREATE ROLE service_role" | \
  grep -v "CREATE SCHEMA IF NOT EXISTS auth" | \
  grep -v "CREATE SCHEMA IF NOT EXISTS storage" | \
  grep -v "CREATE SCHEMA IF NOT EXISTS realtime" | \
  grep -v "CREATE EXTENSION IF NOT EXISTS.*pg_graphql" | \
  grep -v "CREATE EXTENSION IF NOT EXISTS.*pgjwt"
}

# Procesar el archivo
if [ "$IS_COMPRESSED" = true ]; then
  if [[ "$OUTPUT_FILE" == *.gz ]]; then
    # Entrada comprimida, salida comprimida
    gunzip -c "$BACKUP_FILE" | clean_sql | gzip > "$OUTPUT_FILE"
  else
    # Entrada comprimida, salida sin comprimir
    gunzip -c "$BACKUP_FILE" | clean_sql > "$OUTPUT_FILE"
  fi
else
  if [[ "$OUTPUT_FILE" == *.gz ]]; then
    # Entrada sin comprimir, salida comprimida
    cat "$BACKUP_FILE" | clean_sql | gzip > "$OUTPUT_FILE"
  else
    # Entrada sin comprimir, salida sin comprimir
    cat "$BACKUP_FILE" | clean_sql > "$OUTPUT_FILE"
  fi
fi

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Backup limpiado correctamente"
  echo ""

  # Mostrar tamaños
  SIZE_ORIGINAL=$(du -h "$BACKUP_FILE" | cut -f1)
  SIZE_CLEAN=$(du -h "$OUTPUT_FILE" | cut -f1)

  echo "Tamaño original: $SIZE_ORIGINAL"
  echo "Tamaño limpio:   $SIZE_CLEAN"
  echo ""

  echo "Archivo listo para usar en la migración:"
  echo "  ./scripts/migrate-to-local.sh $OUTPUT_FILE"
else
  echo ""
  echo "❌ Error al limpiar el backup"
  exit 1
fi
