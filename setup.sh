#!/bin/bash

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

# 4. Install deps & generate Prisma client
cd ../..
npm install
npx prisma generate
npx tsc prisma/seed.ts --outDir dist
node dist/seed.js

# 5. Run dev server
npm run dev 