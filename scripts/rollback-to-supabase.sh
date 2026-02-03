#!/bin/bash

set -e

echo "============================================"
echo "  ROLLBACK A SUPABASE"
echo "============================================"
echo ""
read -p "¿Continuar con rollback? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Rollback cancelado"
  exit 0
fi

APP_DIR="/home/mercaprice"

echo "[$(date)] === Detener PM2 ==="
pm2 stop mercaprice

echo ""
echo "[$(date)] === Restaurar .env de Supabase ==="
if [ ! -f "$APP_DIR/.env.supabase.backup" ]; then
  echo "Error: No se encontró backup (.env.supabase.backup)"
  exit 1
fi

cp "$APP_DIR/.env.supabase.backup" "$APP_DIR/.env"

echo ""
echo "[$(date)] === Regenerar Prisma Client ==="
cd "$APP_DIR"
npx prisma generate

echo ""
echo "[$(date)] === Reiniciar PM2 ==="
pm2 restart mercaprice

echo ""
echo "[$(date)] === Verificar estado ==="
sleep 3
pm2 status

echo ""
echo "✅ ROLLBACK COMPLETADO"
