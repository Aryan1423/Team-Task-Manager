# Task Manager

A full-stack team task management application for creating projects, managing members, tracking tasks, and monitoring progress from a clean dashboard.

The project uses a React/Vite frontend, an Express backend, Prisma ORM, PostgreSQL, JWT-based authentication, and Railway-friendly deployment configuration.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Deployment on Railway](#deployment-on-railway)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- User signup, login, logout, and authenticated session handling
- JWT authentication with protected frontend routes
- Project creation, update, deletion, and listing
- Project-based team member management
- Admin and member project roles
- Task creation, editing, deletion, assignment, filtering, and status updates
- Task statuses: `TODO`, `IN_PROGRESS`, `DONE`
- Task priorities: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- Dashboard statistics for authenticated users
- Overdue task tracking
- Profile and password update routes
- Responsive dark UI with mobile sidebar support
- Railway deployment as one full-stack service
- Prisma migrations for PostgreSQL

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router |
| UI / Icons | CSS, Lucide React, Inter font |
| API Client | Axios |
| Backend | Node.js, Express |
| Database ORM | Prisma |
| Database | PostgreSQL / Neon |
| Authentication | JWT, bcryptjs |
| Validation | express-validator |
| Deployment | Railway |

---

## Project Structure

```text
team-task-manager/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   └── package.json
├── package.json
├── railway.json
└── README.md
```

---

## Prerequisites

Install the following before running the project:

- Node.js `18+`
- npm
- PostgreSQL database URL, preferably from Neon
- Git

---

## Environment Variables

Create a `.env` file in the repository root or inside the `server` folder.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="http://localhost:3000"
```

### Variable Reference

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Yes | Secret used to sign JWT access tokens |
| `CLIENT_URL` | Yes | Allowed frontend origin for CORS |
| `PORT` | No | Backend port. Defaults to `5000` |
| `VITE_API_URL` | No | Optional frontend API base URL if frontend and backend are deployed separately |

For Neon, keep `sslmode=require` in the database URL.

---

## Local Development

### 1. Install dependencies

From the repository root:

```bash
npm install
```

This installs dependencies for the root workspace, `client`, and `server`.

### 2. Configure environment variables

Create `.env`:

```bash
cp .env.example .env
```

If `.env.example` does not exist, manually create `.env` using the variables shown above.

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Run database migrations

For local development:

```bash
cd server
npm run prisma:migrate
```

For production-style migration deployment:

```bash
npm run prisma:migrate:deploy
```

### 5. Start the backend

```bash
cd server
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 6. Start the frontend

In a second terminal:

```bash
cd client
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

During local development, Vite proxies `/api` requests to `http://localhost:5000`.

---

## Database Setup

The Prisma schema defines the following main models:

- `User`
- `Project`
- `ProjectMember`
- `Task`

It also defines these enums:

- `Role`: `ADMIN`, `MEMBER`
- `TaskStatus`: `TODO`, `IN_PROGRESS`, `DONE`
- `Priority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

Useful Prisma commands:

```bash
# Generate Prisma client
npm run prisma:generate

# Run development migration
cd server
npm run prisma:migrate

# Open Prisma Studio
cd server
npm run prisma:studio

# Deploy migrations in production
npm run prisma:migrate:deploy
```

---

## Available Scripts

### Root Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Builds the frontend and generates Prisma client |
| `npm run prisma:generate` | Generates Prisma client from the server workspace |
| `npm run prisma:migrate:deploy` | Applies Prisma migrations in production mode |
| `npm start` | Starts the server workspace |

### Client Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts Vite development server |
| `npm run build` | Builds the React app |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint |

### Server Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts Express with nodemon |
| `npm start` | Starts Express with Node |
| `npm run prisma:generate` | Generates Prisma client |
| `npm run prisma:migrate` | Runs Prisma development migrations |
| `npm run prisma:migrate:deploy` | Applies migrations for production |
| `npm run prisma:studio` | Opens Prisma Studio |

---

## API Overview

The API is mounted under `/api`.

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Returns API health status |

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create a new user account |
| `POST` | `/api/auth/login` | Log in and receive an access token |
| `GET` | `/api/auth/me` | Get the authenticated user |
| `POST` | `/api/auth/logout` | Log out |
| `PUT` | `/api/auth/profile` | Update profile name |
| `PUT` | `/api/auth/password` | Change password |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard/stats` | Get dashboard statistics for the authenticated user |

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/projects` | List authenticated user's projects |
| `POST` | `/api/projects` | Create a project |
| `GET` | `/api/projects/:id` | Get project details |
| `PUT` | `/api/projects/:id` | Update a project. Admin only |
| `DELETE` | `/api/projects/:id` | Delete a project. Admin only |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/projects/:id/tasks` | List tasks in a project |
| `POST` | `/api/projects/:id/tasks` | Create a task |
| `GET` | `/api/projects/:id/tasks/:taskId` | Get task details |
| `PUT` | `/api/projects/:id/tasks/:taskId` | Update a task |
| `DELETE` | `/api/projects/:id/tasks/:taskId` | Delete a task |

### Project Members

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/projects/:id/members` | List project members |
| `POST` | `/api/projects/:id/members` | Add a member. Admin only |
| `PUT` | `/api/projects/:id/members/:memberId` | Update member role. Admin only |
| `DELETE` | `/api/projects/:id/members/:memberId` | Remove a member. Admin only |

---

## Deployment on Railway

This project is configured to deploy as one Railway service from the repository root.

The root `railway.json` handles:

- Building the React client
- Generating Prisma client
- Applying Prisma migrations before deployment
- Starting the Express server
- Serving the built frontend from the backend service
- Checking service health at `/api/health`

### Railway Settings

| Setting | Value |
| --- | --- |
| Root Directory | Leave empty or use repository root |
| Config File | `railway.json` |
| Healthcheck Path | `/api/health` |

### Railway Environment Variables

```env
DATABASE_URL="your Neon PostgreSQL connection string"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="https://your-railway-service.up.railway.app"
```

### Railway Build and Deploy Flow

Railway uses these commands from `railway.json`:

```bash
npm run build
npm run prisma:migrate:deploy
npm start
```

Recommended approach:

- Deploy from the repository root.
- Keep the client and server in one Railway service.
- Do not create separate Railway services unless you intentionally want separate frontend and backend URLs.

A single-service deployment avoids extra CORS setup and usually does not require `VITE_API_URL`.

---

## Troubleshooting

### API health check fails on Railway

Check that:

- `DATABASE_URL` is set correctly
- `JWT_SECRET` is set
- `CLIENT_URL` matches the Railway app URL
- The Railway healthcheck path is `/api/health`
- Prisma migrations completed successfully

### Frontend cannot reach the backend locally

Check that:

- Backend is running on `http://localhost:5000`
- Frontend is running on `http://localhost:3000`
- Vite proxy is configured for `/api`
- API requests use `/api`, not a hardcoded backend URL

### CORS error in browser

Set `CLIENT_URL` to the exact frontend origin.

For local development:

```env
CLIENT_URL="http://localhost:3000"
```

For Railway single-service deployment:

```env
CLIENT_URL="https://your-railway-service.up.railway.app"
```

### Prisma connection error

Check that:

- `DATABASE_URL` is valid
- Neon database is active
- The connection string includes `sslmode=require`
- Migrations have been applied


## Production Notes

- Use a long random value for `JWT_SECRET`.
- Never commit `.env` files.
- Use `npm run prisma:migrate:deploy` for production migrations.
- Keep `DATABASE_URL` private.
- Use HTTPS URLs in production environment variables.

---

## License

This project is private by default. Add a license file if you plan to make it public.
