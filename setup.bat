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

REM 4. Wait for database to be ready
echo Esperando a que la base de datos esté lista...
timeout /t 5

REM 5. Execute initial database setup
echo Ejecutando script de inicialización de la base de datos...
docker exec -i g3smart-postgres psql -U admin -d g3stmart < init-db\01_setup_database.sql

REM 6. Install deps & generate Prisma client
cd ..\..
call rmdir /s /q node_modules
call rmdir /s /q prisma\generated
call rmdir /s /q .prisma
call npm install
call npx prisma generate
@REM call npx tsc prisma/seed.ts --outDir dist
@REM call node dist/seed.js

REM 7. Run dev server
call npm run dev 