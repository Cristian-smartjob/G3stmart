# G3stmart

A project management application for SmartJob.

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Database Setup

First, you need to set up the PostgreSQL database:

```bash
# Connect to your PostgreSQL server
psql -U your_username -d your_database_name

# Or create a new database if needed
createdb -U your_username your_database_name

# Run the database setup script
psql -U your_username -d your_database_name -f database/setup_pg_database_updated.sql
```

### 2. Install Dependencies

Install the project dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server

After setting up the database and installing dependencies, start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
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
