# Task Manager

Full-stack team task manager with React/Vite frontend and Express/Prisma backend.

## Requirements

- Node.js 18+
- Neon PostgreSQL database URL

## Backend Setup

```bash
cd server
npm install
npm run dev
```

The API runs on `http://localhost:5000` and exposes `/api/health`.

Create a `.env` file in the repository root or in `server`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="http://localhost:3000"
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:3000`; Vite proxies `/api` to the backend.

## Railway Deployment

Deploy this app as one Railway service from the repository root. The root
`railway.json` builds the React client, generates Prisma, applies migrations,
starts the Express server, and serves the built client from the same service.

Railway settings:

- Root Directory: leave empty, or set it to the repository root.
- Config file: use `railway.json` from the repository root.
- Healthcheck path: `/api/health`.

Railway variables:

```bash
DATABASE_URL="your Neon PostgreSQL connection string"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="https://your-railway-service.up.railway.app"
```

Use the Neon connection string with `sslmode=require`. A separate `DIRECT_URL`
is not required for this project.

Deploy flow:

```bash
npm ci
npm run build
npm run prisma:migrate:deploy
npm start
```

Do not deploy `client` and `server` as separate Railway services unless you
specifically want two public services. A single root service avoids needing
`VITE_API_URL`, CORS cross-origin setup, and a second healthcheck.

## Main Flows

- Sign up or log in with email and password.
- Create projects from the Projects page.
- Open a project, add tasks, edit task details, and use the inline status action to move work forward.
- Dashboard stats are calculated from the authenticated user's projects.
