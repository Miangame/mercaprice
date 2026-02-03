#!/bin/bash

cd /home/mercaprice
LOG_FILE="/home/mercaprice/logs/load-data-$(date +\%Y\%m\%d-\%H\%M).log"

echo "[$(date)] Iniciando carga de productos..." | tee -a "$LOG_FILE"

NODE_ENV=production HEADLESS=true node src/scripts/loadDataFromSitemap.js >> "$LOG_FILE" 2>&1

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "[$(date)] Carga completada" | tee -a "$LOG_FILE"
else
  echo "[$(date)] Error (exit code: $EXIT_CODE)" | tee -a "$LOG_FILE"
fi

find /home/mercaprice/logs -name "load-data-*.log" -mtime +30 -delete

exit $EXIT_CODE
