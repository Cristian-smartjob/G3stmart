# G3stmart

A project‐management app for SmartJob built with Next.js, PostgreSQL and TypeScript.

---

## 📋 Prerequisites

- **Node.js** ≥ 16
- **npm** ≥ 8
- **Docker** & **Docker Compose**  
- **Git**

---

## 🚀 One-Step Setup

We’ve provided two helper scripts—one for macOS/Linux and one for Windows—that will:

1. Clone the repo  
2. Create the `.env`  
3. Bring up the database  
4. Install dependencies  
5. Generate Prisma client  
6. Seed the database  
7. Start the dev server

# 1. Clone & enter repo
git clone https://github.com/your-org/g3stmart.git
cd g3stmart


# 2. Create .env
cat > .env <<EOF
DATABASE_URL=postgresql://admin:g3smartjob@localhost:5432/g3stmart
EOF

# 2. Create .env
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

# 5. Run dev server
npm run dev
