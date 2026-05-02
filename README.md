# Team Task Manager

Full-stack team task manager with React/Vite frontend and Express/Prisma backend.

## Requirements

- Node.js 18+
- PostgreSQL

## Backend Setup

```bash
cd server
copy .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

The API runs on `http://localhost:5000` and exposes `/api/health`.

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:3000`; Vite proxies `/api` to the backend.

## Main Flows

- Sign up or log in with email and password.
- Create projects from the Projects page.
- Open a project, add tasks, and click a task card to advance it through Todo, In Progress, and Done.
- Dashboard stats are calculated from the authenticated user's projects.
