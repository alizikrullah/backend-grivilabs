# GriviLabs Backend API

Custom REST API for [GriviLabs](https://grivilabs.my.id), a web development agency specializing in custom websites for small businesses. Powers the company profile, portfolio showcase, blog, services catalog, and lead management system.

🔌 **API Base URL:** [api.grivilabs.my.id](https://api.grivilabs.my.id)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## Architecture

This backend uses a **headless CMS pattern**: the database is managed by [Directus](https://directus.io/) (self-hosted on Coolify), while this Express API serves as a custom read/write layer on top of it. Prisma is used for database access without running migrations — schema is owned by Directus.

```
Frontend (Next.js)
      |
      v
Express API  <--  JWT Auth (admin)
      |
      v
Prisma (read/write)
      |
      v
PostgreSQL  <--  Directus CMS (schema management)
```

---

## Features

- **Blog** - Public endpoint to fetch published posts with slug-based routing
- **Portfolio** - Categorized portfolio items with flags, filters, and confidentiality levels
- **Services** - Service catalog with tiered pricing and homepage display configuration
- **Lead Management** - Contact form submission handling with admin dashboard
- **File Upload** - Image upload with Sharp for resizing and optimization
- **Admin Auth** - JWT-based authentication with HttpOnly cookie refresh token
- **Security** - Helmet, CORS with multi-origin support, input validation with Zod

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Server and REST API |
| TypeScript | Type safety |
| Prisma 7 + PG Adapter | Database access layer |
| PostgreSQL | Database (managed by Directus) |
| JWT | Admin authentication |
| Multer + Sharp | File upload and image processing |
| Zod | Request validation |
| Helmet | HTTP security headers |
| cookie-parser | HttpOnly cookie support |

---

## API Endpoints

### Public
```
GET    /api/posts              # List published posts
GET    /api/posts/:slug        # Post detail

GET    /api/portfolio          # List portfolio items
GET    /api/portfolio/:slug    # Portfolio item detail

GET    /api/services           # List services with tiers
GET    /api/services/:slug     # Service detail

POST   /api/leads              # Submit contact form
```

### Admin (JWT required)
```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
POST   /api/admin/auth/refresh

POST   /api/admin/upload       # Upload image

GET    /api/admin/posts
POST   /api/admin/posts
PATCH  /api/admin/posts/:id
DELETE /api/admin/posts/:id

GET    /api/admin/portfolio
POST   /api/admin/portfolio
PATCH  /api/admin/portfolio/:id
DELETE /api/admin/portfolio/:id

GET    /api/admin/leads
PATCH  /api/admin/leads/:id

GET    /api/admin/services
POST   /api/admin/services
PATCH  /api/admin/services/:id
DELETE /api/admin/services/:id
```

---

## Database Schema

```
posts                 - Blog posts
services              - Service offerings
service_tiers         - Pricing tiers per service
portfolio_categories  - Portfolio categories
portfolio_items       - Portfolio showcase items
portfolio_flags       - Status/tag flags for portfolio items
portfolio_item_flags  - Many-to-many: items to flags
leads                 - Contact form submissions
documents             - Internal documents
```

---

## Project Structure

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Server entry point
├── config/                   # Environment config
├── class/                    # AppError base class
├── libs/
│   └── prisma/               # Prisma client instance
├── middlewares/
│   └── errorHandler/         # Centralized error handler
└── modules/
    ├── auth/                 # Admin authentication
    ├── upload/               # File upload + Sharp
    ├── posts/                # Blog posts
    ├── portfolio/            # Portfolio management
    ├── leads/                # Lead management
    └── services/             # Services catalog
prisma/
├── schema.prisma             # Read-only schema mirror
└── prisma.config.ts          # Prisma 7 config
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or existing Directus instance)

### 1. Clone Repository

```bash
git clone https://github.com/alizikrullah/backend-grivilabs.git
cd backend-grivilabs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL=
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

> Note: Never run `prisma migrate` on this project. The schema is managed by Directus.

### 5. Start Development Server

```bash
npm run dev
```

---

## Scripts

```bash
npm run dev              # Development server with hot reload
npm run build            # Compile TypeScript
npm run start            # Run production build
npm run check            # Type check without emit
npm run prisma:generate  # Generate Prisma Client
npm run prisma:pull      # Pull schema from existing database
npm run prisma:studio    # Open Prisma Studio GUI
```

---

## Deployment

| Layer | Platform | URL |
|---|---|---|
| API | Coolify (Self-hosted) | [api.grivilabs.my.id](https://api.grivilabs.my.id) |
| CMS | Directus on Coolify | Internal |
| Database | PostgreSQL on Coolify | Internal |
| File Storage | Cloudinary | |
