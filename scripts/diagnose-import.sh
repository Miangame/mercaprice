#!/bin/bash

echo "======================================"
echo "  DIAGNÓSTICO DE IMPORTACIÓN"
echo "======================================"
echo ""

# Verificar el backup
BACKUP_FILE=$(ls -t /home/mercaprice/backups/migration/*.backup.gz /home/mercaprice/backups/migration/*.sql.gz 2>/dev/null | head -1)

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ No se encontró archivo de backup"
  exit 1
fi

echo "Backup encontrado: $BACKUP_FILE"
echo "Tamaño: $(du -h "$BACKUP_FILE" | cut -f1)"
echo ""

# Verificar contenido del backup
echo "Verificando contenido del backup..."
echo ""

if [[ "$BACKUP_FILE" == *.backup.gz ]] || [[ "$BACKUP_FILE" == *.backup ]]; then
  echo "Tipo: PostgreSQL custom format"
  echo ""
  echo "Lista de tablas en el backup:"
  if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" 2>/dev/null | pg_restore --list 2>/dev/null | grep "TABLE DATA" | head -20
  else
    pg_restore --list "$BACKUP_FILE" 2>/dev/null | grep "TABLE DATA" | head -20
  fi
elif [[ "$BACKUP_FILE" == *.sql.gz ]]; then
  echo "Tipo: SQL dump"
  echo ""
  echo "Buscando INSERT/COPY statements:"
  gunzip -c "$BACKUP_FILE" 2>/dev/null | grep -E "^(INSERT|COPY)" | head -20
fi

echo ""
echo "======================================"
echo "  ESTADO DE LA BASE DE DATOS"
echo "======================================"
echo ""

# Cargar variables
source /home/mercaprice/.env.docker

# Ver tablas existentes
echo "Tablas en la base de datos:"
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -c "\dt"

echo ""
echo "Ver estructura de la tabla Product:"
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -c "\d \"Product\""

echo ""
echo "Conteos actuales:"
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U mercaprice_user -d mercaprice_db -t -c "
SELECT 'Product: ' || COUNT(*) FROM \"Product\";
SELECT 'PriceHistory: ' || COUNT(*) FROM \"PriceHistory\";
SELECT 'Warehouse: ' || COUNT(*) FROM \"Warehouse\";
"

echo ""
echo "======================================"
echo "  INTENTAR IMPORTACIÓN MANUAL"
echo "======================================"
echo ""
echo "Si el backup tiene datos pero no se importaron, puedes intentar:"
echo ""
echo "1. Importar solo los datos (sin DROP/CREATE):"
echo "   gunzip -c $BACKUP_FILE | pg_restore -h localhost -U mercaprice_user -d mercaprice_db --data-only --no-owner --no-privileges --disable-triggers -v"
echo ""
echo "2. O para SQL:"
echo "   gunzip -c $BACKUP_FILE | PGPASSWORD=\$DB_PASSWORD psql -h localhost -U mercaprice_user -d mercaprice_db"
echo ""
