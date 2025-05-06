@echo off

REM 1. Create .env at /
echo DATABASE_URL=postgresql://admin:g3smartjob@localhost:5432/g3stmart > .env

REM 2. Create .env at database/docker
echo POSTGRES_USER=admin > database\docker\.env
echo POSTGRES_PASSWORD=g3smartjob >> database\docker\.env
echo POSTGRES_DB=g3stmart >> database\docker\.env

REM 3. Start database
cd database\docker
docker compose --env-file .env -p g3stmart up -d

REM 4. Install deps & generate Prisma client
cd ..\..
call npm install
call npx prisma generate
call npx tsc prisma/seed.ts --outDir dist
call node dist/seed.js

REM 5. Run dev server
call npm run dev 