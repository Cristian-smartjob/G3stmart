# G3stmart

A project management application for SmartJob.

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Database Setup

#### Using Docker Desktop

1. Create a `.env` file in the `database/docker` directory with the following variables:

```bash
# Values on develop
POSTGRES_USER=admin
POSTGRES_PASSWORD=g3smartjob
POSTGRES_DB=g3stmart
```

2. Use one of the following commands to manage the database:

```bash
# Initialize database for the first time (creates and starts container)
npm run db:init

# Start the database container
npm run db:start

# Stop the database container
npm run db:stop

# Restart the database container
npm run db:restart

# View database logs
npm run db:logs

# Clean database (stops container and removes volumes)
npm run db:clean
```

The database will be automatically initialized with the required schema and sample data.

### 2. Install Dependencies

Install the project dependencies:

```bash
npm install
```

### 3. Prisma Setup

After installing dependencies, you need to set up Prisma:

```bash
# Generate Prisma Client
npx prisma generate
```

Note: If you're using the Docker setup with init-db script, DO NOT run `prisma migrate dev` or `prisma migrate reset` as this will override the database initialization script. The database schema is already set up by the init-db script.

### 4. Run the Development Server

After setting up the database and installing dependencies, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Features

- Client management
- People management
- Project tracking
- Leave days tracking
- Pre-invoice generation

## Technologies

- Next.js
- PostgreSQL
- TypeScript
- Docker
