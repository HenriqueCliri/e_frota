#!/bin/bash
set -e

# Encontrar o arquivo pg_hba.conf
PG_HBA=$(find /etc/postgresql -name pg_hba.conf | head -n 1)

if [ -z "$PG_HBA" ]; then
    echo "❌ Erro: Arquivo pg_hba.conf não encontrado."
    exit 1
fi

echo "Arquivo de configuração encontrado: $PG_HBA"

# Backup do arquivo original
echo "Fazendo backup..."
sudo cp "$PG_HBA" "$PG_HBA.bak"

# Alterar autenticação para TRUST (permite conexão local sem senha)
echo "Alterando método de autenticação para TRUST..."

# Substitui 'peer', 'md5' ou 'scram-sha-256' por 'trust' para conexões locais
sudo sed -i 's/local\s\+all\s\+postgres\s\+peer/local all postgres trust/' "$PG_HBA"
sudo sed -i 's/local\s\+all\s\+all\s\+peer/local all all trust/' "$PG_HBA"
sudo sed -i 's/host\s\+all\s\+all\s\+127.0.0.1\/32\s\+scram-sha-256/host all all 127.0.0.1\/32 trust/' "$PG_HBA"
sudo sed -i 's/host\s\+all\s\+all\s\+127.0.0.1\/32\s\+md5/host all all 127.0.0.1\/32 trust/' "$PG_HBA"
sudo sed -i 's/host\s\+all\s\+all\s\+::1\/128\s\+scram-sha-256/host all all ::1\/128 trust/' "$PG_HBA"
sudo sed -i 's/host\s\+all\s\+all\s\+::1\/128\s\+md5/host all all ::1\/128 trust/' "$PG_HBA"

echo "Reiniciando PostgreSQL..."
sudo systemctl restart postgresql

echo "✅ Autenticação alterada para TRUST com sucesso!"
echo "Tente rodar o backend novamente."
