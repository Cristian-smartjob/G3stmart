#!/bin/bash

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.18.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "Error: Se requiere Node.js versión $REQUIRED_VERSION o superior. Versión actual: $NODE_VERSION"
    echo "Por favor, actualiza Node.js antes de continuar."
    exit 1
fi

# 1. Create .env at /
cat > .env <<EOF
DATABASE_URL=postgresql://admin:g3smartjob@localhost:5432/g3stmart
EOF

# 2. Create .env at database/docker
cat > database/docker/.env <<EOF
POSTGRES_USER=admin
POSTGRES_PASSWORD=g3smartjob
POSTGRES_DB=g3stmart
EOF

# 3. Start database
cd database/docker
docker compose --env-file .env -p g3stmart up -d

# 4. Wait for database to be ready
echo "Esperando a que la base de datos esté lista..."
sleep 5

# 5. Execute initial database setup
echo "Ejecutando script de inicialización de la base de datos..."
docker exec -i g3smart-postgres psql -U admin -d g3stmart < init-db/01_setup_database.sql

# 6. Install deps & generate Prisma client
cd ../..
npm install
npx prisma generate
# npx tsc prisma/seed.ts --outDir dist
# node dist/seed.js

# 7. Run dev server
npm run dev 