#!/bin/bash

cd /home/mercaprice
LOG_FILE="/home/mercaprice/logs/mark-deleted-$(date +\%Y\%m\%d-\%H\%M).log"

echo "[$(date)] Marcando productos eliminados..." | tee -a "$LOG_FILE"

NODE_ENV=production HEADLESS=true node src/scripts/markProductsAsDeleted.js >> "$LOG_FILE" 2>&1

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "[$(date)] Completado" | tee -a "$LOG_FILE"
else
  echo "[$(date)] Error (exit code: $EXIT_CODE)" | tee -a "$LOG_FILE"
fi

find /home/mercaprice/logs -name "mark-deleted-*.log" -mtime +30 -delete

exit $EXIT_CODE
