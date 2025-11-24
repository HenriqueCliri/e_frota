#!/bin/bash
set -e

echo "Configurando PostgreSQL..."

# 1. Definir senha do usuário postgres
echo "Definindo senha do usuário 'postgres' para 'postgres'..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# 2. Criar banco de dados efrota (se não existir)
echo "Criando banco de dados 'efrota'..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'efrota'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE efrota;"

echo "✅ Configuração concluída com sucesso!"
echo "Agora você pode rodar o backend."
