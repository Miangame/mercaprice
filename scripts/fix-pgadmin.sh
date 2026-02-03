#!/bin/bash

echo "======================================"
echo "  DIAGNÓSTICO Y SOLUCIÓN pgAdmin"
echo "======================================"
echo ""

# Verificar estado
echo "Estado actual de contenedores:"
docker ps -a | grep pgadmin

echo ""
echo "Verificando logs de pgAdmin..."
docker logs mercaprice-pgadmin --tail 50

echo ""
echo "======================================"
echo "  SOLUCIÓN"
echo "======================================"
echo ""

# Detener contenedor
echo "Deteniendo pgAdmin..."
docker-compose --env-file .env.docker stop pgadmin

# Eliminar contenedor
echo "Eliminando contenedor..."
docker-compose --env-file .env.docker rm -f pgadmin

# Arreglar permisos del directorio
echo "Corrigiendo permisos del directorio de datos..."
sudo chown -R 5050:5050 /home/mercaprice/pgadmin-data
sudo chmod -R 755 /home/mercaprice/pgadmin-data

# Reiniciar contenedor
echo ""
echo "Reiniciando pgAdmin..."
docker-compose --env-file .env.docker up -d pgadmin

echo ""
echo "Esperando 10 segundos..."
sleep 10

echo ""
echo "Estado de pgAdmin:"
docker ps | grep pgadmin

echo ""
echo "Últimas líneas del log:"
docker logs mercaprice-pgadmin --tail 20

echo ""
echo "======================================"
echo "Si pgAdmin sigue fallando, verifica:"
echo "  1. Puerto 5050 no está en uso: sudo netstat -tlnp | grep 5050"
echo "  2. Variables en .env.docker son correctas"
echo "  3. Logs completos: docker logs mercaprice-pgadmin"
echo "======================================"
